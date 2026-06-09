/// <reference path="../pb_data/types.d.ts" />
//
// CHECKOUT (Stripe) + FRETE (Melhor Envio) - hook do servidor (PocketBase).
// =========================================================================
// Roda NO SERVIDOR (dentro do PocketBase). E o lugar das travas de seguranca.
// Nunca roda no navegador. Tudo desligado ate CHECKOUT_ATIVO=true (sandbox).
//
// TRAVAS:
//  1) Preco recalculado no servidor a partir do banco (nunca confia no cliente).
//  2) Pedido/total gravados pelo servidor (colecao "pedidos" fica trancada).
//  3) Chaves secretas via variavel de ambiente (nunca no codigo/cliente).
//  4) Pagamento so vira "pago" via webhook do Stripe + verificacao de assinatura.
//  5) So funciona com CHECKOUT_ATIVO=true. Sandbox primeiro.
//
// ATENCAO: este e o ESQUELETO. Antes de usar com dinheiro real:
//  - criar a colecao "pedidos" (ver deploy/CHECKOUT.md)
//  - definir as variaveis de ambiente (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
//    MELHOR_ENVIO_TOKEN, etc.)
//  - TESTAR no sandbox (Stripe test + Melhor Envio sandbox)
//  - conferir os detalhes marcados como TODO conforme a versao do PocketBase

const MOEDA = 'brl';

function env(nome, padrao) {
  const v = $os.getenv(nome);
  return v && v.length ? v : padrao;
}
function ativo() {
  return env('CHECKOUT_ATIVO', 'false') === 'true';
}
function ehProducao() {
  return env('CHECKOUT_AMBIENTE', 'sandbox') === 'producao';
}
function siteUrl() {
  return env('SITE_PUBLIC_URL', 'https://lojinhadamiih.com.br').replace(/\/$/, '');
}

/** Le e valida os itens do corpo, recalculando preco/peso pelo banco (TRAVA 1). */
function validarItens(itensEntrada) {
  const maxQtd = parseInt(env('CHECKOUT_MAX_QTD', '20'), 10);
  const out = [];
  let total = 0;
  for (const item of itensEntrada || []) {
    const id = String(item && item.id ? item.id : '');
    let qty = parseInt(item && item.qty ? item.qty : 0, 10);
    if (!id || !Number.isFinite(qty) || qty < 1) throw new Error('Item invalido');
    if (qty > maxQtd) qty = maxQtd;

    let p;
    try {
      p = $app.findRecordById('produtos', id);
    } catch (_) {
      throw new Error('Produto nao encontrado: ' + id);
    }
    if (!p.getBool('disponivel')) throw new Error('Esgotado: ' + p.getString('nome'));

    const preco = p.getFloat('preco');
    const promo = p.getFloat('preco_promocional');
    const precoFinal = promo && promo > 0 ? promo : preco;
    if (!precoFinal || precoFinal <= 0) throw new Error('Sem preco: ' + p.getString('nome'));

    out.push({
      produtoId: id,
      nome: p.getString('nome'),
      qty: qty,
      precoUnit: precoFinal,
      pesoKg: p.getFloat('peso') || 0.3,
      alturaCm: p.getFloat('altura') || 10,
      larguraCm: p.getFloat('largura') || 15,
      comprimentoCm: p.getFloat('comprimento') || 20,
    });
    total += precoFinal * qty;
  }
  if (!out.length) throw new Error('Carrinho vazio');
  return { itens: out, total };
}

// ---------------------------------------------------------------------------
// FRETE: calcula via Melhor Envio. Body: { cepDestino, itens:[{id,qty}] }
// ---------------------------------------------------------------------------
routerAdd('POST', '/lm/frete', (e) => {
  if (!ativo()) return e.json(503, { erro: 'Indisponivel' });
  const body = e.requestInfo().body || {};
  const cepDestino = String(body.cepDestino || '').replace(/\D/g, '');
  if (cepDestino.length !== 8) return e.json(400, { erro: 'CEP invalido' });

  let validado;
  try {
    validado = validarItens(body.itens);
  } catch (err) {
    return e.json(400, { erro: String(err.message || err) });
  }

  const token = env('MELHOR_ENVIO_TOKEN', '');
  if (!token) return e.json(500, { erro: 'Frete nao configurado' });
  const base = ehProducao()
    ? 'https://www.melhorenvio.com.br'
    : 'https://sandbox.melhorenvio.com.br';

  const produtos = validado.itens.map((it) => ({
    id: it.produtoId,
    width: it.larguraCm,
    height: it.alturaCm,
    length: it.comprimentoCm,
    weight: it.pesoKg,
    insurance_value: it.precoUnit,
    quantity: it.qty,
  }));

  const resp = $http.send({
    url: base + '/api/v2/me/shipment/calculate',
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // Melhor Envio exige User-Agent com contato.
      'User-Agent': 'Lojinha da Miih (' + env('CONTATO_EMAIL', 'contato.lojinhadamiih@gmail.com') + ')',
    },
    body: JSON.stringify({
      from: { postal_code: env('CEP_ORIGEM', '18000000') },
      to: { postal_code: cepDestino },
      products: produtos,
    }),
    timeout: 20,
  });

  if (resp.statusCode < 200 || resp.statusCode >= 300) {
    return e.json(502, { erro: 'Falha ao calcular o frete' });
  }

  // Filtra opcoes validas (sem erro) e devolve o essencial.
  const opcoes = (resp.json || [])
    .filter((o) => o && o.price && !o.error)
    .map((o) => ({
      id: o.id,
      nome: (o.company && o.company.name ? o.company.name + ' - ' : '') + o.name,
      preco: Number(o.price),
      prazo: o.delivery_time,
    }));

  return e.json(200, { opcoes });
});

// ---------------------------------------------------------------------------
// CHECKOUT: cria a sessao de pagamento no Stripe.
// Body: { itens:[{id,qty}], frete:{nome,preco}, cliente:{nome,contato} }
// ---------------------------------------------------------------------------
routerAdd('POST', '/lm/checkout', (e) => {
  if (!ativo()) return e.json(503, { erro: 'Checkout indisponivel' });
  const body = e.requestInfo().body || {};

  let validado;
  try {
    validado = validarItens(body.itens);
  } catch (err) {
    return e.json(400, { erro: String(err.message || err) });
  }

  // Frete: aceitamos o valor escolhido, mas o ideal e revalidar chamando o
  // Melhor Envio de novo aqui. TODO (sandbox): revalidar o frete no servidor.
  const fretePreco = Math.max(0, Number(body.frete && body.frete.preco ? body.frete.preco : 0));
  const freteNome = String(body.frete && body.frete.nome ? body.frete.nome : 'Frete');

  const total = validado.total + fretePreco;

  // TRAVA 2: grava o pedido pelo servidor.
  const colPedidos = $app.findCollectionByNameOrId('pedidos');
  const pedido = new Record(colPedidos, {
    itens: validado.itens,
    total: total,
    frete: { nome: freteNome, preco: fretePreco },
    status: 'pendente',
    cliente_nome: body.cliente && body.cliente.nome ? String(body.cliente.nome).slice(0, 120) : '',
    cliente_contato: body.cliente && body.cliente.contato ? String(body.cliente.contato).slice(0, 120) : '',
  });
  $app.save(pedido);

  // TRAVA 3: chave secreta do ambiente.
  const secret = env('STRIPE_SECRET_KEY', '');
  if (!secret) return e.json(500, { erro: 'Pagamento nao configurado' });

  // Monta o corpo (form-urlencoded) da Stripe Checkout Session.
  const params = [];
  const add = (k, v) => params.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
  add('mode', 'payment');
  add('success_url', siteUrl() + '/pedido-confirmado?id=' + pedido.id);
  add('cancel_url', siteUrl() + '/carrinho');
  // Metodos: cartao e Pix (Stripe Brasil).
  add('payment_method_types[0]', 'card');
  add('payment_method_types[1]', 'pix');
  add('metadata[pedido_id]', pedido.id);

  let li = 0;
  for (const it of validado.itens) {
    add(`line_items[${li}][price_data][currency]`, MOEDA);
    add(`line_items[${li}][price_data][product_data][name]`, it.nome);
    add(`line_items[${li}][price_data][unit_amount]`, Math.round(it.precoUnit * 100)); // centavos
    add(`line_items[${li}][quantity]`, it.qty);
    li++;
  }
  if (fretePreco > 0) {
    add(`line_items[${li}][price_data][currency]`, MOEDA);
    add(`line_items[${li}][price_data][product_data][name]`, 'Frete (' + freteNome + ')');
    add(`line_items[${li}][price_data][unit_amount]`, Math.round(fretePreco * 100));
    add(`line_items[${li}][quantity]`, 1);
  }

  const resp = $http.send({
    url: 'https://api.stripe.com/v1/checkout/sessions',
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + secret,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.join('&'),
    timeout: 20,
  });

  if (resp.statusCode < 200 || resp.statusCode >= 300) {
    return e.json(502, { erro: 'Falha ao iniciar o pagamento' });
  }

  const sessao = resp.json;
  pedido.set('stripe_session_id', sessao.id || '');
  $app.save(pedido);

  return e.json(200, { pedidoId: pedido.id, url: sessao.url });
});

// ---------------------------------------------------------------------------
// WEBHOOK do Stripe: confirma o pagamento. (TRAVA 4: verificar assinatura)
// ---------------------------------------------------------------------------
routerAdd('POST', '/lm/stripe-webhook', (e) => {
  if (!ativo()) return e.json(503, {});

  const segredo = env('STRIPE_WEBHOOK_SECRET', '');
  const assinatura = e.request.header.get('Stripe-Signature') || '';

  // TODO (sandbox): implementar a verificacao HMAC-SHA256 da assinatura:
  //   signed_payload = `${t}.${corpoBruto}`  (t vem do header Stripe-Signature)
  //   esperado = HMAC_SHA256(signed_payload, segredo)  e comparar com v1.
  // Sem assinatura valida, NAO confirmar o pedido.
  if (segredo && !assinatura) return e.json(401, {});

  const evento = e.requestInfo().body || {};
  const tipo = evento.type || '';
  if (tipo !== 'checkout.session.completed') return e.json(200, {}); // ignora o resto

  const sessao = (evento.data && evento.data.object) || {};
  const pedidoId = sessao.metadata && sessao.metadata.pedido_id;
  const pago = sessao.payment_status === 'paid';
  if (!pedidoId) return e.json(200, {});

  let pedido;
  try {
    pedido = $app.findRecordById('pedidos', pedidoId);
  } catch (_) {
    return e.json(200, {});
  }
  if (pedido.getString('status') === 'pago') return e.json(200, {}); // idempotente
  if (pago) {
    pedido.set('status', 'pago');
    pedido.set('stripe_payment_intent', String(sessao.payment_intent || ''));
    $app.save(pedido);
  }
  return e.json(200, {});
});
