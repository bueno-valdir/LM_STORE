/**
 * Cliente de produtos (roda no NAVEGADOR do visitante).
 *
 * O site le os produtos direto do painel (PocketBase) pelo navegador, e nao no
 * momento do build. Assim funciona mesmo com o servidor de build sem acesso ao
 * painel, e os produtos novos aparecem na hora (sem precisar refazer o site).
 *
 * Observacao: as classes do Tailwind usadas aqui sao escritas por extenso de
 * proposito, para o Tailwind incluir elas no CSS final.
 */
import { site } from '../config/site';
import { withBase } from './url';

const PB = (site.pocketbaseUrl || '').replace(/\/$/, '');

/** Formato de produto usado nas telas. */
export interface ProdutoView {
  id: string;
  nome: string;
  marca: string;
  categoria: string;
  descricao: string;
  preco: number | null;
  precoPromocional: number | null;
  tom: string | null;
  volume: string | null;
  imagens: { src: string; alt: string }[];
  disponivel: boolean;
  destaque: boolean;
  promocao: boolean;
}

const ROTULOS: Record<string, string> = {
  maquiagem: 'Maquiagem',
  skincare: 'Skincare',
  'kits-presentes': 'Kits e Presentes',
};

function num(v: unknown): number | null {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Escapa texto para inserir com seguranca no HTML. */
export function esc(s: string): string {
  return (s || '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
  );
}

/** Mapeia um registro do PocketBase para o formato das telas. */
function mapear(rec: any): ProdutoView {
  const arquivos: string[] = Array.isArray(rec.imagens)
    ? rec.imagens
    : rec.imagens
      ? [rec.imagens]
      : [];
  const imagens = arquivos.map((a) => ({
    src: `${PB}/api/files/produtos/${rec.id}/${a}`,
    alt: rec.nome || 'Produto',
  }));
  return {
    id: rec.id,
    nome: rec.nome || '',
    marca: rec.marca || '',
    categoria: rec.categoria || rec.select || '',
    descricao: rec.descricao || '',
    preco: num(rec.preco),
    precoPromocional: num(rec.preco_promocional),
    tom: rec.tom || null,
    volume: rec.volume || null,
    imagens: imagens.length
      ? imagens
      : [{ src: withBase('/images/products/placeholder-1.svg'), alt: rec.nome || 'Produto' }],
    disponivel: !!rec.disponivel,
    destaque: !!rec.destaque,
    promocao: !!rec.promocao,
  };
}

/** Busca todos os produtos do painel. */
export async function carregarProdutos(): Promise<ProdutoView[]> {
  if (!PB) return [];
  const res = await fetch(`${PB}/api/collections/produtos/records?perPage=200&sort=-created`);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const json = await res.json();
  return (json.items || []).map(mapear);
}

/** Busca um produto pelo id. */
export async function carregarProduto(id: string): Promise<ProdutoView | null> {
  if (!PB || !id) return null;
  const res = await fetch(`${PB}/api/collections/produtos/records/${encodeURIComponent(id)}`);
  if (!res.ok) return null;
  return mapear(await res.json());
}

export function rotuloCategoria(slug: string): string {
  return ROTULOS[slug] || slug || '';
}

export function formatarPreco(v: number | null): string | null {
  if (v === null || v === undefined) return null;
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function precoVigente(p: ProdutoView) {
  const promo = typeof p.precoPromocional === 'number' && p.precoPromocional > 0;
  return promo
    ? { atual: p.precoPromocional, de: p.preco, promo: true }
    : { atual: p.preco, de: null, promo: false };
}

/** Monta o link wa.me com a mensagem do produto. */
export function linkWhatsApp(p: ProdutoView): string {
  const partes = [`Olá! Tenho interesse no produto: ${p.nome} (${p.id})`];
  if (p.tom) partes.push(`, tom ${p.tom}`);
  const { atual } = precoVigente(p);
  const precoFmt = formatarPreco(atual);
  if (precoFmt) partes.push(` - ${precoFmt}`);
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(partes.join(''))}`;
}

/** HTML de um card de produto (catalogo e destaques). */
export function cardHTML(p: ProdutoView): string {
  const { atual, de, promo } = precoVigente(p);
  const atualFmt = formatarPreco(atual);
  const deFmt = formatarPreco(de);
  const esgotado = !p.disponivel;
  const capa = p.imagens[0];

  const etiquetas = `
    <div class="absolute left-2 top-2 flex flex-col gap-1">
      ${promo ? '<span class="etiqueta bg-marca text-white">Promoção</span>' : ''}
      ${esgotado ? '<span class="etiqueta bg-preto/80 text-white">Esgotado</span>' : ''}
    </div>`;

  const precoBloco =
    site.mostrarPrecos && atualFmt
      ? `<div class="flex items-baseline gap-2">
           <span class="font-titulo text-base font-bold text-marca">${atualFmt}</span>
           ${promo && deFmt ? `<span class="text-xs text-texto-suave line-through">${deFmt}</span>` : ''}
         </div>`
      : '<span class="text-sm font-medium text-texto-suave">Consultar no WhatsApp</span>';

  return `
  <a href="${withBase('/produto')}?id=${encodeURIComponent(p.id)}"
     class="group flex flex-col overflow-hidden rounded-marca border border-fundo-borda bg-fundo shadow-card transition-colors hover:border-marca">
    <div class="relative aspect-square overflow-hidden bg-fundo-claro">
      <img src="${esc(capa.src)}" alt="${esc(capa.alt)}" width="600" height="600" loading="lazy" decoding="async"
           class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      ${etiquetas}
    </div>
    <div class="flex flex-1 flex-col gap-1 p-3">
      <span class="text-xs uppercase tracking-wide text-texto-suave">${esc(p.marca)} &middot; ${esc(rotuloCategoria(p.categoria))}</span>
      <h3 class="font-titulo text-sm font-semibold leading-snug text-texto">${esc(p.nome)}</h3>
      <div class="mt-auto pt-2">${precoBloco}</div>
    </div>
  </a>`;
}
