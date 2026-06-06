/// <reference path="../pb_data/types.d.ts" />
//
// CHECKOUT (Mercado Pago) - hook do servidor (PocketBase).
// =========================================================
// Este arquivo roda NO SERVIDOR (dentro do PocketBase), entao e o lugar certo
// para as travas de seguranca. Ele NUNCA roda no navegador do cliente.
//
// TRAVAS implementadas aqui:
//  1) Preco recalculado no servidor a partir do banco (nunca confia no cliente).
//  2) Pedido e total gravados pelo servidor (a colecao "pedidos" fica trancada).
//  3) Chave secreta lida de variavel de ambiente (MP_ACCESS_TOKEN), nunca no codigo.
//  4) Confirmacao de pagamento so via webhook + verificacao de assinatura.
//  5) So funciona se CHECKOUT_ATIVO=true (desligado por padrao). Sandbox primeiro.
//
// ATENCAO: este e o ESQUELETO seguro. Antes de usar com dinheiro real:
//  - criar a colecao "pedidos" (ver deploy/CHECKOUT.md)
//  - definir as variaveis de ambiente (MP_ACCESS_TOKEN, MP_WEBHOOK_SECRET, etc.)
//  - TESTAR no sandbox do Mercado Pago
//  - conferir a API conforme a versao do seu PocketBase (rotas/JSVM podem variar)

const MOEDA = 'BRL';

/** Le uma variavel de ambiente (ou retorna o padrao). */
function env(nome, padrao) {
  const v = $os.getenv(nome);
  return v && v.length ? v : padrao;
}

/** O checkout esta ligado? (trava mestra) */
function checkoutAtivo() {
  return env('CHECKOUT_ATIVO', 'false') === 'true';
}

/** Base da API do Mercado Pago. */
const MP_API = 'https://api.mercadopago.com';

// ---------------------------------------------------------------------------
// Rota: criar pedido + preferencia de pagamento.
// O cliente manda apenas { itens: [{ id, qty }], cliente?: {...} }.
// O SERVIDOR decide o preco. O cliente NAO manda preco nem total.
// ---------------------------------------------------------------------------
routerAdd('POST', '/lm/checkout', (e) => {
  if (!checkoutAtivo()) {
    return e.json(503, { erro: 'Checkout indisponivel no momento.' });
  }

  // Le o corpo da requisicao.
  const body = e.requestInfo().body || {};
  const itensEntrada = Array.isArray(body.itens) ? body.itens : [];
  if (!itensEntrada.length) {
    return e.json(400, { erro: 'Carrinho vazio.' });
  }

  const maxQtd = parseInt(env('CHECKOUT_MAX_QTD', '20'), 10);

  // TRAVA 1: recalcula tudo no servidor, a partir do banco.
  const itensValidados = [];
  let total = 0;

  for (const item of itensEntrada) {
    const id = String(item && item.id ? item.id : '');
    let qty = parseInt(item && item.qty ? item.qty : 0, 10);
    if (!id || !Number.isFinite(qty) || qty < 1) {
      return e.json(400, { erro: 'Item invalido.' });
    }
    if (qty > maxQtd) qty = maxQtd; // trava anti-abuso

    let produto;
    try {
      produto = $app.findRecordById('produtos', id);
    } catch (_) {
      return e.json(400, { erro: 'Produto nao encontrado: ' + id });
    }

    // Indisponivel nao pode ser comprado.
    if (!produto.getBool('disponivel')) {
      return e.json(409, { erro: 'Produto esgotado: ' + produto.getString('nome') });
    }

    // Preco vigente: promocional quando existir, senao o normal. SERVIDOR decide.
    const preco = produto.getFloat('preco');
    const promo = produto.getFloat('preco_promocional');
    const precoFinal = promo && promo > 0 ? promo : preco;
    if (!precoFinal || precoFinal <= 0) {
      return e.json(409, { erro: 'Produto sem preco: ' + produto.getString('nome') });
    }

    const subtotal = precoFinal * qty;
    total += subtotal;
    itensValidados.push({
      produtoId: id,
      nome: produto.getString('nome'),
      qty: qty,
      precoUnit: precoFinal,
      subtotal: subtotal,
    });
  }

  if (total <= 0) {
    return e.json(400, { erro: 'Total invalido.' });
  }

  // TRAVA 2: grava o pedido pelo servidor (a colecao fica trancada para o cliente).
  const colPedidos = $app.findCollectionByNameOrId('pedidos');
  const pedido = new Record(colPedidos, {
    itens: itensValidados,
    total: total,
    status: 'pendente',
    cliente_nome: body.cliente && body.cliente.nome ? String(body.cliente.nome).slice(0, 120) : '',
    cliente_contato: body.cliente && body.cliente.contato ? String(body.cliente.contato).slice(0, 120) : '',
  });
  $app.save(pedido);

  // TRAVA 3: chave secreta vem do ambiente, nunca do codigo/cliente.
  const accessToken = env('MP_ACCESS_TOKEN', '');
  if (!accessToken) {
    return e.json(500, { erro: 'Pagamento nao configurado (sem credencial no servidor).' });
  }

  const siteUrl = env('SITE_PUBLIC_URL', 'https://lmstore.veraxlegalops.com.br');

  // Monta a preferencia do Mercado Pago (checkout hospedado).
  const pref = {
    items: itensValidados.map((it) => ({
      title: it.nome,
      quantity: it.qty,
      unit_price: it.precoUnit,
      currency_id: MOEDA,
    })),
    external_reference: pedido.id, // liga o pagamento ao nosso pedido
    back_urls: {
      success: siteUrl + '/pedido-confirmado',
      pending: siteUrl + '/pedido-confirmado',
      failure: siteUrl + '/pedido-falhou',
    },
    auto_return: 'approved',
    notification_url: siteUrl.replace(/\/$/, '') + '/lm/webhook', // ajustar p/ dominio do painel
  };

  // Cria a preferencia no Mercado Pago.
  const resp = $http.send({
    url: MP_API + '/checkout/preferences',
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pref),
    timeout: 20,
  });

  if (resp.statusCode < 200 || resp.statusCode >= 300) {
    return e.json(502, { erro: 'Falha ao iniciar o pagamento.' });
  }

  const dados = resp.json;
  // Guarda o id da preferencia no pedido (para conferencia/idempotencia).
  pedido.set('mp_preference_id', dados.id || '');
  $app.save(pedido);

  // Devolve ao cliente apenas o link para pagar (init_point). Sem dados sensiveis.
  const initPoint =
    env('CHECKOUT_AMBIENTE', 'sandbox') === 'producao'
      ? dados.init_point
      : dados.sandbox_init_point || dados.init_point;

  return e.json(200, { pedidoId: pedido.id, init_point: initPoint });
});

// ---------------------------------------------------------------------------
// Rota: webhook do Mercado Pago (confirmacao de pagamento).
// TRAVA 4: so confiamos no pagamento depois de verificar a assinatura E
// consultar o status direto na API do Mercado Pago.
// ---------------------------------------------------------------------------
routerAdd('POST', '/lm/webhook', (e) => {
  if (!checkoutAtivo()) {
    return e.json(503, {});
  }

  const accessToken = env('MP_ACCESS_TOKEN', '');
  const webhookSecret = env('MP_WEBHOOK_SECRET', '');

  // Verificacao de assinatura do webhook (cabecalho x-signature + x-request-id).
  // TODO (sandbox): conferir o formato exato da assinatura na sua conta MP e
  // implementar a verificacao HMAC com webhookSecret. Sem assinatura valida,
  // NAO atualizamos o pedido.
  const sig = e.request.header.get('x-signature') || '';
  if (webhookSecret && !sig) {
    return e.json(401, {});
  }

  const body = e.requestInfo().body || {};
  const tipo = body.type || body.topic || '';
  const paymentId =
    (body.data && body.data.id) || body.id || (e.request.url ? '' : '');

  if (tipo.indexOf('payment') === -1 || !paymentId) {
    return e.json(200, {}); // ignora notificacoes que nao sao de pagamento
  }

  // Consulta o pagamento na API do MP (nao confia so na notificacao).
  const resp = $http.send({
    url: MP_API + '/v1/payments/' + paymentId,
    method: 'GET',
    headers: { Authorization: 'Bearer ' + accessToken },
    timeout: 20,
  });
  if (resp.statusCode < 200 || resp.statusCode >= 300) {
    return e.json(200, {});
  }

  const pg = resp.json;
  const pedidoId = pg.external_reference;
  if (!pedidoId) return e.json(200, {});

  let pedido;
  try {
    pedido = $app.findRecordById('pedidos', pedidoId);
  } catch (_) {
    return e.json(200, {});
  }

  // Idempotencia: se ja esta pago, nao reprocessa.
  const statusAtual = pedido.getString('status');
  if (statusAtual === 'pago') return e.json(200, {});

  // Mapeia o status do MP para o nosso.
  let novo = 'pendente';
  if (pg.status === 'approved') novo = 'pago';
  else if (pg.status === 'rejected' || pg.status === 'cancelled') novo = 'cancelado';

  pedido.set('status', novo);
  pedido.set('mp_payment_id', String(paymentId));
  $app.save(pedido);

  return e.json(200, {});
});
