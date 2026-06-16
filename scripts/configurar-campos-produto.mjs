#!/usr/bin/env node
/**
 * Cria os campos novos de PESO e TAMANHO (e garante o de TOM) na colecao
 * `produtos` do PocketBase, direto pela API de administrador.
 *
 * E IDEMPOTENTE e SEGURO: so ADICIONA os campos que estiverem faltando.
 * Nunca altera nem remove campos que ja existem (nao mexe nos seus produtos).
 *
 * Campos garantidos (todos opcionais, podem ficar vazios):
 *   - tom            Number (0 a 10, inteiro)   -> nº de tons do produto
 *   - peso_g         Number (gramas)            -> peso para o frete
 *   - altura_cm      Number (cm)                -> altura da embalagem
 *   - largura_cm     Number (cm)                -> largura da embalagem
 *   - comprimento_cm Number (cm)                -> comprimento da embalagem
 *
 * COMO USAR (mesmo login do importador):
 *
 *   PB_URL="https://painel.lmstore.veraxlegalops.com.br" \
 *   PB_ADMIN_EMAIL="seu-email-admin" \
 *   PB_ADMIN_SENHA="sua-senha" \
 *   node scripts/configurar-campos-produto.mjs
 *
 *   Use --dry-run para so ver o que seria criado, sem gravar:
 *     node scripts/configurar-campos-produto.mjs --dry-run
 */

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

const PB_URL = (process.env.PB_URL || 'https://painel.lmstore.veraxlegalops.com.br').replace(/\/$/, '');
const PB_ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || '';
const PB_ADMIN_SENHA = process.env.PB_ADMIN_SENHA || '';

function sair(msg) {
  console.error('\n[erro] ' + msg + '\n');
  process.exit(1);
}

if (!dryRun && (!PB_ADMIN_EMAIL || !PB_ADMIN_SENHA)) {
  sair('Defina PB_ADMIN_EMAIL e PB_ADMIN_SENHA (login de admin do painel). Use --dry-run para so simular.');
}

// Campos desejados (nome + tipo + limites). Sao criados so se faltarem.
const DESEJADOS = [
  { name: 'tom', tipo: 'number', min: 0, max: 10, inteiro: true },
  { name: 'peso_g', tipo: 'number', min: 0, max: null, inteiro: false },
  { name: 'altura_cm', tipo: 'number', min: 0, max: null, inteiro: false },
  { name: 'largura_cm', tipo: 'number', min: 0, max: null, inteiro: false },
  { name: 'comprimento_cm', tipo: 'number', min: 0, max: null, inteiro: false },
];

// ---------- autenticacao (igual ao importador) ----------
async function autenticar() {
  const corpo = JSON.stringify({ identity: PB_ADMIN_EMAIL, password: PB_ADMIN_SENHA });
  const headers = { 'Content-Type': 'application/json' };
  // PocketBase >= 0.23 usa _superusers; versoes antigas usam /api/admins.
  const rotas = [
    `${PB_URL}/api/collections/_superusers/auth-with-password`,
    `${PB_URL}/api/admins/auth-with-password`,
  ];
  for (const url of rotas) {
    try {
      const res = await fetch(url, { method: 'POST', headers, body: corpo });
      if (res.ok) {
        const json = await res.json();
        if (json.token) return json.token;
      }
    } catch { /* tenta a proxima rota */ }
  }
  sair('Falha ao autenticar no painel. Confira PB_URL, PB_ADMIN_EMAIL e PB_ADMIN_SENHA.');
}

// ---------- monta o objeto de campo conforme a versao do PocketBase ----------
// Novo (>=0.23): propriedades direto no campo (min, max, onlyInt).
// Antigo (<=0.22): propriedades dentro de `options` (min, max, noDecimal).
function montarCampo(def, formatoNovo) {
  if (def.tipo !== 'number') throw new Error('tipo nao suportado: ' + def.tipo);
  if (formatoNovo) {
    return {
      name: def.name,
      type: 'number',
      required: false,
      presentable: false,
      min: def.min,
      max: def.max,
      onlyInt: !!def.inteiro,
    };
  }
  return {
    name: def.name,
    type: 'number',
    required: false,
    options: { min: def.min, max: def.max, noDecimal: !!def.inteiro },
  };
}

async function principal() {
  console.log(`\nPainel: ${PB_URL}`);
  if (dryRun) console.log('(modo --dry-run: nada sera gravado)\n');

  const token = dryRun && !PB_ADMIN_EMAIL ? null : await autenticar();
  const headers = token ? { Authorization: token } : {};

  // 1) Le a colecao `produtos`.
  const resCol = await fetch(`${PB_URL}/api/collections/produtos`, { headers });
  if (!resCol.ok) {
    sair(`Nao consegui ler a colecao 'produtos' (HTTP ${resCol.status}). ` +
      (resCol.status === 401 ? 'Login sem permissao de admin?' : 'Confira o PB_URL.'));
  }
  const col = await resCol.json();

  // 2) Descobre o formato: novo usa `fields`, antigo usa `schema`.
  const formatoNovo = Array.isArray(col.fields);
  const lista = formatoNovo ? col.fields : (col.schema || []);
  const existentes = new Set(lista.map((c) => c.name));

  // 3) Decide o que falta criar.
  const faltando = DESEJADOS.filter((d) => !existentes.has(d.name));
  const jaTem = DESEJADOS.filter((d) => existentes.has(d.name)).map((d) => d.name);

  if (jaTem.length) console.log('Ja existem (mantidos como estao): ' + jaTem.join(', '));
  if (!faltando.length) {
    console.log('\nTudo certo: nenhum campo novo a criar.\n');
    return;
  }
  console.log('Vou criar: ' + faltando.map((d) => d.name).join(', '));

  if (dryRun) {
    console.log('\n(--dry-run) Nada gravado. Rode sem --dry-run para aplicar.\n');
    return;
  }

  // 4) Monta a lista final (existentes + novos) e salva.
  const novos = faltando.map((d) => montarCampo(d, formatoNovo));
  const listaFinal = [...lista, ...novos];
  const corpo = formatoNovo ? { fields: listaFinal } : { schema: listaFinal };

  const resUp = await fetch(`${PB_URL}/api/collections/${col.id}`, {
    method: 'PATCH',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  });
  if (!resUp.ok) {
    const txt = await resUp.text();
    sair(`Falha ao salvar os campos (HTTP ${resUp.status}): ${txt.slice(0, 500)}`);
  }

  console.log(`\nPronto! Campos criados: ${faltando.map((d) => d.name).join(', ')}.`);
  console.log('Abra o painel e confira em Collections > produtos.\n');
}

principal().catch((e) => sair(e.message || String(e)));
