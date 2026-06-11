/// <reference path="../pb_data/types.d.ts" />
//
// ENTREGAS (SuperFrete) - hook do servidor (PocketBase).
// =====================================================
// Roda NO SERVIDOR, nunca no navegador. O navegador so manda { id, cep, qty }.
//
// TRAVAS de seguranca:
//  1) Token do SuperFrete lido de variavel de ambiente (SUPERFRETE_TOKEN).
//  2) Peso/dimensoes vem do BANCO (produto), nunca do cliente.
//  3) CEP de origem vem do ambiente (CEP_ORIGEM), nunca do cliente.
//  4) So funciona se FRETE_ATIVO=true (desligado por padrao). Sandbox primeiro.
//  5) So pede/retorna servicos dos Correios (PAC/SEDEX/Mini Envios).
//
// Ver deploy/ENTREGAS.md para configurar (conta, token, variaveis, campos).

// Dimensoes/peso padrao quando o produto nao tiver os campos preenchidos.
// (peso em kg; medidas em cm) - pacote pequeno tipico de cosmeticos.
const DIM_PADRAO = { peso: 0.3, altura: 4, largura: 11, comprimento: 16 };

// Servicos dos Correios no SuperFrete: 1=PAC, 2=SEDEX, 17=Mini Envios.
const SERVICOS_CORREIOS = '1,2,17';

function env(nome, padrao) {
  const v = $os.getenv(nome);
  return v && v.length ? v : padrao;
}

function freteAtivo() {
  return env('FRETE_ATIVO', 'false') === 'true';
}

routerAdd('POST', '/lm/frete', (e) => {
  if (!freteAtivo()) {
    return e.json(503, { erro: 'Calculo de frete indisponivel no momento.' });
  }

  const body = e.requestInfo().body || {};
  const id = String(body.id || '');
  const cep = String(body.cep || '').replace(/\D/g, '');
  let qty = parseInt(body.qty || 1, 10);

  if (!id) return e.json(400, { erro: 'Produto nao informado.' });
  if (!/^\d{8}$/.test(cep)) return e.json(400, { erro: 'CEP invalido.' });
  if (!Number.isFinite(qty) || qty < 1) qty = 1;
  const maxQtd = parseInt(env('FRETE_MAX_QTD', '20'), 10);
  if (qty > maxQtd) qty = maxQtd;

  // TRAVA 2: dimensoes/peso e valor vem do banco.
  let produto;
  try {
    produto = $app.findRecordById('produtos', id);
  } catch (_) {
    return e.json(404, { erro: 'Produto nao encontrado.' });
  }
  const peso = (produto.getFloat('peso') || DIM_PADRAO.peso) * qty;
  const altura = produto.getFloat('altura') || DIM_PADRAO.altura;
  const largura = produto.getFloat('largura') || DIM_PADRAO.largura;
  const comprimento = produto.getFloat('comprimento') || DIM_PADRAO.comprimento;
  const valor = (produto.getFloat('preco') || 0) * qty;

  // TRAVA 1 e 3: token e CEP de origem vem do ambiente.
  const token = env('SUPERFRETE_TOKEN', '');
  if (!token) return e.json(500, { erro: 'Frete nao configurado no servidor.' });
  const cepOrigem = env('CEP_ORIGEM', '').replace(/\D/g, '');
  if (!/^\d{8}$/.test(cepOrigem)) {
    return e.json(500, { erro: 'CEP de origem nao configurado no servidor.' });
  }

  const base =
    env('SUPERFRETE_AMBIENTE', 'sandbox') === 'producao'
      ? 'https://api.superfrete.com'
      : 'https://sandbox.superfrete.com';
  // O SuperFrete exige um User-Agent identificando a aplicacao + e-mail.
  const userAgent = env('SUPERFRETE_UA', 'Lojinha da Miih (contato@lojinhadamiih.com.br)');

  const payload = {
    from: { postal_code: cepOrigem },
    to: { postal_code: cep },
    services: SERVICOS_CORREIOS,
    options: {
      own_hand: false,
      receipt: false,
      insurance_value: valor,
      use_insurance_value: valor > 0,
    },
    package: {
      height: altura,
      width: largura,
      length: comprimento,
      weight: peso,
    },
  };

  const resp = $http.send({
    url: base + '/api/v0/calculator',
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': userAgent,
    },
    body: JSON.stringify(payload),
    timeout: 20,
  });

  if (resp.statusCode < 200 || resp.statusCode >= 300) {
    return e.json(502, { erro: 'Falha ao calcular o frete.' });
  }

  const lista = resp.json || [];
  const manuseio = parseInt(env('FRETE_MANUSEIO_DIAS', '1'), 10) || 0;
  const opcoes = [];

  for (let i = 0; i < lista.length; i++) {
    const s = lista[i];
    if (!s || s.error) continue; // ignora servicos indisponiveis
    // TRAVA 5: garante que e Correios (alem de ja pedir so servicos 1/2/17).
    const empresa = (s.company && s.company.name) || 'Correios';
    if (empresa.toLowerCase().indexOf('correios') === -1) continue;
    const preco = parseFloat(s.price || s.custom_price || 0);
    if (!preco || preco <= 0) continue;
    const prazoBase = parseInt(s.delivery_time || s.custom_delivery_time || 0, 10);
    opcoes.push({
      nome: s.name || 'Correios',
      empresa: empresa,
      preco: preco,
      prazo: prazoBase + manuseio,
    });
  }

  opcoes.sort((a, b) => a.preco - b.preco);
  return e.json(200, { opcoes: opcoes });
});
