/**
 * Arvore de categorias e subcategorias do catalogo (fonte unica da verdade).
 *
 * Esta estrutura define o menu de navegacao (mega-menu do cabecalho), os
 * filtros do catalogo e os rotulos amigaveis exibidos nos produtos.
 *
 * Como funciona:
 *  - Cada produto guarda no painel (PocketBase), no campo `categoria`, o SLUG
 *    de uma SUBcategoria (a folha), por exemplo `base`, `batom`, `sombras`.
 *  - O site descobre sozinho a categoria-mae (Rosto, Olhos, ...) a partir do
 *    slug da subcategoria, usando o mapa abaixo.
 *
 * Para adicionar/renomear uma categoria:
 *  1. Edite a arvore abaixo (slug em minusculas, sem acento e sem espaco).
 *  2. No painel, em Collections > produtos > campo `categoria` (select),
 *     mantenha as opcoes iguais aos slugs das SUBcategorias daqui.
 *     (A lista pronta para colar esta em `slugsSubcategorias()`.)
 *
 * "Marcas" nao entra aqui: e montada automaticamente a partir da marca dos
 * produtos cadastrados.
 */

export interface SubCategoria {
  /** Slug estavel (vai no campo `categoria` do produto e na URL ?sub=). */
  slug: string;
  /** Nome amigavel exibido no menu e nos filtros. */
  rotulo: string;
}

export interface CategoriaRaiz {
  /** Slug da categoria-mae (URL ?cat=). */
  slug: string;
  /** Nome amigavel da categoria-mae. */
  rotulo: string;
  /** Subcategorias (folhas) desta categoria. */
  subs: SubCategoria[];
}

/** Arvore completa, na ordem em que aparece no menu. */
export const arvoreCategorias: CategoriaRaiz[] = [
  {
    slug: 'rosto',
    rotulo: 'Rosto',
    subs: [
      { slug: 'base', rotulo: 'Base' },
      { slug: 'blush', rotulo: 'Blush' },
      { slug: 'bronzer-contorno', rotulo: 'Bronzer / Contorno' },
      { slug: 'corretivo', rotulo: 'Corretivo' },
      { slug: 'fixador-bruma', rotulo: 'Fixador / Bruma / Blindagem' },
      { slug: 'iluminador', rotulo: 'Iluminador' },
      { slug: 'paleta-pele', rotulo: 'Paleta para Pele' },
      { slug: 'po-facial', rotulo: 'Pó Facial' },
      { slug: 'primer', rotulo: 'Primer' },
    ],
  },
  {
    slug: 'olhos',
    rotulo: 'Olhos',
    subs: [
      { slug: 'cilios-posticos', rotulo: 'Cílios Postiços' },
      { slug: 'delineador', rotulo: 'Delineador' },
      { slug: 'glitter-pigmento', rotulo: 'Glitter / Pigmento' },
      { slug: 'lapis-de-olho', rotulo: 'Lápis de Olho' },
      { slug: 'mascara-de-cilios', rotulo: 'Máscara de Cílios' },
      { slug: 'sombras', rotulo: 'Sombras' },
    ],
  },
  {
    slug: 'labios',
    rotulo: 'Lábios',
    subs: [
      { slug: 'batom', rotulo: 'Batom' },
      { slug: 'esfoliante-labial', rotulo: 'Esfoliante Labial' },
      { slug: 'gloss-labial', rotulo: 'Gloss / Brilho Labial' },
      { slug: 'lapis-de-boca', rotulo: 'Lápis de Boca' },
      { slug: 'lip-balm-oil', rotulo: 'Lip Balm / Lip Oil' },
      { slug: 'lip-tint', rotulo: 'Lip Tint' },
    ],
  },
  {
    slug: 'sobrancelhas',
    rotulo: 'Sobrancelhas',
    subs: [
      { slug: 'lapis-sobrancelha', rotulo: 'Lápis / Lapiseira' },
      { slug: 'sombra-sobrancelha', rotulo: 'Sombra para Sobrancelhas' },
      { slug: 'gel-sobrancelha', rotulo: 'Gel / Pasta / Fixador' },
    ],
  },
  {
    slug: 'skincare',
    rotulo: 'Skincare',
    subs: [
      { slug: 'acessorios-skincare', rotulo: 'Acessórios para Skincare' },
      { slug: 'limpeza-facial', rotulo: 'Limpeza Facial' },
      { slug: 'esfoliante-facial', rotulo: 'Esfoliante Facial' },
      { slug: 'hidratante-facial', rotulo: 'Hidratante Facial' },
      { slug: 'demaquilante', rotulo: 'Demaquilante' },
      { slug: 'sabonete', rotulo: 'Sabonete' },
      { slug: 'serum-tratamentos', rotulo: 'Sérum / Tratamentos' },
    ],
  },
  {
    slug: 'pinceis',
    rotulo: 'Pincéis',
    subs: [
      { slug: 'kit-pinceis', rotulo: 'Kit de Pincéis' },
      { slug: 'pincel-facial', rotulo: 'Pincel Facial' },
      { slug: 'pincel-olhos', rotulo: 'Pincel para Olhos' },
      { slug: 'esponjas', rotulo: 'Esponjas' },
    ],
  },
  {
    slug: 'acessorios',
    rotulo: 'Acessórios',
    subs: [
      { slug: 'diversos', rotulo: 'Diversos' },
      { slug: 'maquiagem-infantil', rotulo: 'Maquiagem Infantil' },
    ],
  },
];

/**
 * Rotulos legados (catalogo antigo, antes da reorganizacao). Mantidos so para
 * que produtos ainda nao recategorizados continuem mostrando um nome decente.
 */
const ROTULOS_LEGADOS: Record<string, string> = {
  maquiagem: 'Maquiagem',
  'kits-presentes': 'Kits e Presentes',
};

// Indices para busca rapida (montados uma vez).
const _subPorSlug = new Map<string, SubCategoria>();
const _maePorSub = new Map<string, CategoriaRaiz>();
const _raizPorSlug = new Map<string, CategoriaRaiz>();
for (const cat of arvoreCategorias) {
  _raizPorSlug.set(cat.slug, cat);
  for (const sub of cat.subs) {
    _subPorSlug.set(sub.slug, sub);
    _maePorSub.set(sub.slug, cat);
  }
}

/** Rotulo amigavel de qualquer slug (subcategoria, categoria-mae ou legado). */
export function rotuloDe(slug: string): string {
  if (!slug) return '';
  return (
    _subPorSlug.get(slug)?.rotulo ??
    _raizPorSlug.get(slug)?.rotulo ??
    ROTULOS_LEGADOS[slug] ??
    slug
  );
}

/** Categoria-mae (raiz) de uma subcategoria; null se nao for subcategoria conhecida. */
export function categoriaMaeDe(subSlug: string): CategoriaRaiz | null {
  return _maePorSub.get(subSlug) ?? null;
}

/** True se o slug for uma categoria-mae (raiz). */
export function ehCategoriaRaiz(slug: string): boolean {
  return _raizPorSlug.has(slug);
}

/**
 * Lista de slugs das subcategorias (folhas), pronta para colar nas opcoes do
 * campo `categoria` (select) no painel do PocketBase.
 */
export function slugsSubcategorias(): string[] {
  return Array.from(_subPorSlug.keys());
}
