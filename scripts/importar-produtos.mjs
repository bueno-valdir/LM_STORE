#!/usr/bin/env node
/**
 * Importacao em massa de produtos para o PocketBase a partir de uma planilha CSV.
 *
 * Cadastra os produtos de uma vez (textos, preco, categoria, tom, estoque, peso)
 * e ANEXA as fotos a partir de LINKS (URLs publicas) — o script baixa cada foto
 * e sobe junto. Respeita o schema atual do painel (nao muda configuracoes).
 *
 * COMO USAR (resumo; detalhes em deploy/IMPORTACAO.md):
 *   1. Preencha a planilha-modelo (scripts/modelo-produtos.csv) e exporte como CSV.
 *   2. Tenha o Node 18+ instalado.
 *   3. Rode, informando o login de admin do painel por variaveis de ambiente:
 *
 *      PB_URL="https://painel.lmstore.veraxlegalops.com.br" \
 *      PB_ADMIN_EMAIL="seu-email-admin" \
 *      PB_ADMIN_SENHA="sua-senha" \
 *      node scripts/importar-produtos.mjs caminho/para/produtos.csv
 *
 *   Use --dry-run para testar sem gravar nada:
 *      node scripts/importar-produtos.mjs produtos.csv --dry-run
 *
 * Colunas da planilha (cabecalho da 1a linha):
 *   nome, marca, categoria, preco, preco_promocional, tom, volume, descricao,
 *   peso_g, altura_cm, largura_cm, comprimento_cm, estoque, estoque_tons,
 *   destaque, promocao, disponivel, imagens
 *
 *   - categoria: o SLUG da subcategoria (ex.: base, batom). Ver src/config/categorias.ts.
 *   - tom: numero de tons (0 = sem tom; N = tons 1..N).
 *   - estoque_tons: unidades por tom separadas por | (ex.: 5|0|2). So para produtos com tom.
 *   - estoque: unidades (produtos SEM tom).
 *   - destaque/promocao/disponivel: sim/nao (ou 1/0, true/false).
 *   - imagens: uma ou mais URLs de fotos separadas por | (ex.: https://.../1.jpg|https://.../2.jpg)
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------- argumentos e configuracao ----------
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const csvPath = args.find((a) => !a.startsWith('--'));

const PB_URL = (process.env.PB_URL || 'https://painel.lmstore.veraxlegalops.com.br').replace(/\/$/, '');
const PB_ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || '';
const PB_ADMIN_SENHA = process.env.PB_ADMIN_SENHA || '';

function sair(msg) {
  console.error('\n[erro] ' + msg + '\n');
  process.exit(1);
}

if (!csvPath) sair('Informe o caminho do CSV. Ex.: node scripts/importar-produtos.mjs produtos.csv');
if (!existsSync(csvPath)) sair('Arquivo nao encontrado: ' + csvPath);
if (!dryRun && (!PB_ADMIN_EMAIL || !PB_ADMIN_SENHA)) {
  sair('Defina PB_ADMIN_EMAIL e PB_ADMIN_SENHA (login de admin do painel). Use --dry-run para testar sem gravar.');
}

// ---------- categorias (le src/config/categorias.ts) ----------
const SLUGS_RAIZ = new Set(['rosto', 'olhos', 'labios', 'sobrancelhas', 'skincare', 'pinceis', 'acessorios']);

function normalizar(s) {
  return String(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // tira acentos
    .toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Monta um resolvedor de categoria: aceita o SLUG (ex.: base) ou o NOME amigavel
 * da subcategoria (ex.: "Sérum / Tratamentos") e devolve sempre o slug.
 */
function montarResolvedorCategoria() {
  let pares = [];
  try {
    const txt = readFileSync(resolve(__dirname, '../src/config/categorias.ts'), 'utf8');
    pares = [...txt.matchAll(/slug:\s*'([a-z0-9-]+)',\s*rotulo:\s*'([^']+)'/g)]
      .map((m) => ({ slug: m[1], rotulo: m[2] }))
      .filter((p) => !SLUGS_RAIZ.has(p.slug));
  } catch {
    return (v) => ({ slug: v, ok: true }); // sem validacao se nao achar o arquivo
  }
  const porSlug = new Set(pares.map((p) => p.slug));
  const porNome = new Map(pares.map((p) => [normalizar(p.rotulo), p.slug]));
  return (v) => {
    const t = String(v || '').trim();
    if (!t) return { slug: '', ok: true };
    if (porSlug.has(t)) return { slug: t, ok: true };
    const achado = porNome.get(normalizar(t));
    return achado ? { slug: achado, ok: true } : { slug: t, ok: false };
  };
}

// ---------- parser CSV (RFC4180: aspas, virgulas e quebras dentro de aspas) ----------
function parseCSV(texto) {
  const linhas = [];
  let campo = '';
  let registro = [];
  let dentroAspas = false;
  const s = texto.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (dentroAspas) {
      if (c === '"') {
        if (s[i + 1] === '"') { campo += '"'; i++; }
        else dentroAspas = false;
      } else campo += c;
    } else if (c === '"') {
      dentroAspas = true;
    } else if (c === ',') {
      registro.push(campo); campo = '';
    } else if (c === '\n') {
      registro.push(campo); campo = '';
      linhas.push(registro); registro = [];
    } else campo += c;
  }
  if (campo.length > 0 || registro.length > 0) {
    registro.push(campo);
    linhas.push(registro);
  }
  return linhas.filter((r) => r.some((c) => c.trim() !== ''));
}

// ---------- conversores ----------
function paraNumero(v) {
  if (v == null) return '';
  let t = String(v).trim();
  if (!t) return '';
  if (t.includes('.') && t.includes(',')) t = t.replace(/\./g, '').replace(',', '.'); // 1.299,90
  else t = t.replace(',', '.'); // 49,90
  const n = Number(t);
  return Number.isFinite(n) ? n : '';
}
function paraBool(v) {
  const t = String(v ?? '').trim().toLowerCase();
  return ['sim', 's', '1', 'true', 'verdadeiro', 'x'].includes(t);
}
function estoqueTonsJSON(v) {
  const t = String(v ?? '').trim();
  if (!t) return '';
  const nums = t.split(/[|,;]/).map((x) => {
    const n = Number(String(x).trim().replace(',', '.'));
    return Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0;
  });
  return JSON.stringify(nums);
}

// ---------- PocketBase ----------
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

async function baixarImagem(url, i) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('HTTP ' + res.status + ' ao baixar ' + url);
  const tipo = res.headers.get('content-type') || 'image/jpeg';
  const buf = await res.arrayBuffer();
  let nome = basename(new URL(url).pathname) || `imagem-${i + 1}`;
  if (!/\.[a-z0-9]+$/i.test(nome)) {
    const ext = tipo.includes('png') ? 'png' : tipo.includes('webp') ? 'webp' : 'jpg';
    nome = `imagem-${i + 1}.${ext}`;
  }
  return new File([buf], nome, { type: tipo });
}

async function criarProduto(token, dados, imagens) {
  const form = new FormData();
  for (const [k, v] of Object.entries(dados)) {
    if (v === '' || v === null || v === undefined) continue;
    form.append(k, typeof v === 'boolean' ? String(v) : v);
  }
  for (const img of imagens) form.append('imagens', img, img.name);
  const res = await fetch(`${PB_URL}/api/collections/produtos/records`, {
    method: 'POST',
    headers: { Authorization: token },
    body: form,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error('HTTP ' + res.status + ': ' + txt.slice(0, 500));
  }
  return res.json();
}

// ---------- principal ----------
async function principal() {
  const linhas = parseCSV(readFileSync(csvPath, 'utf8'));
  if (linhas.length < 2) sair('A planilha precisa de um cabecalho e ao menos uma linha de produto.');

  const cabecalho = linhas[0].map((c) => c.trim().toLowerCase());
  const idx = (nome) => cabecalho.indexOf(nome);
  const col = (linha, nome) => {
    const i = idx(nome);
    return i >= 0 ? (linha[i] ?? '').trim() : '';
  };

  const resolverCategoria = montarResolvedorCategoria();
  const token = dryRun ? null : await autenticar();

  let ok = 0;
  let falhas = 0;
  const total = linhas.length - 1;

  for (let r = 1; r < linhas.length; r++) {
    const linha = linhas[r];
    const nome = col(linha, 'nome');
    if (!nome) { console.warn(`  linha ${r + 1}: sem nome, pulando.`); continue; }

    const catBruta = col(linha, 'categoria');
    const cat = resolverCategoria(catBruta);
    if (catBruta && !cat.ok) {
      console.warn(`  [aviso] linha ${r + 1} (${nome}): categoria "${catBruta}" nao reconhecida. Confira o nome.`);
    }
    const categoria = cat.slug;

    const dados = {
      nome,
      marca: col(linha, 'marca'),
      categoria,
      descricao: col(linha, 'descricao'),
      preco: paraNumero(col(linha, 'preco')),
      preco_promocional: paraNumero(col(linha, 'preco_promocional')),
      tom: paraNumero(col(linha, 'tom')),
      volume: col(linha, 'volume'),
      peso_g: paraNumero(col(linha, 'peso_g')),
      altura_cm: paraNumero(col(linha, 'altura_cm')),
      largura_cm: paraNumero(col(linha, 'largura_cm')),
      comprimento_cm: paraNumero(col(linha, 'comprimento_cm')),
      estoque: paraNumero(col(linha, 'estoque')),
      estoque_tons: estoqueTonsJSON(col(linha, 'estoque_tons')),
      destaque: paraBool(col(linha, 'destaque')),
      promocao: paraBool(col(linha, 'promocao')),
      disponivel: idx('disponivel') >= 0 ? paraBool(col(linha, 'disponivel')) : true,
    };

    const urls = col(linha, 'imagens').split('|').map((u) => u.trim()).filter(Boolean);

    if (dryRun) {
      console.log(`  [dry-run] ${nome} | cat=${categoria} | tom=${dados.tom || 0} | fotos=${urls.length}`);
      ok++;
      continue;
    }

    try {
      const imagens = [];
      for (let i = 0; i < urls.length; i++) {
        try { imagens.push(await baixarImagem(urls[i], i)); }
        catch (e) { console.warn(`    foto falhou (${urls[i]}): ${e.message}`); }
      }
      const rec = await criarProduto(token, dados, imagens);
      console.log(`  [ok] (${r}/${total}) ${nome} -> id ${rec.id} (${imagens.length} foto(s))`);
      ok++;
    } catch (e) {
      console.error(`  [falha] (${r}/${total}) ${nome}: ${e.message}`);
      falhas++;
    }
  }

  console.log(`\nConcluido. Sucesso: ${ok} | Falhas: ${falhas}${dryRun ? ' (dry-run, nada foi gravado)' : ''}\n`);
}

principal().catch((e) => sair(e.message));
