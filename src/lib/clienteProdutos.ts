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

/**
 * Converte o HTML da descricao (campo do painel pode vir com <p>, <br>, etc.)
 * em texto simples, preservando quebras de linha. Remove qualquer tag, o que
 * tambem evita injecao de HTML/script vindo do conteudo.
 */
export function textoSimples(html: string): string {
  return (html || '')
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
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

/**
 * Busca todos os produtos do painel.
 * - `cache: 'no-store'`: sempre pega dados frescos (mudancas no painel refletem na hora).
 * - dedupe: dentro do mesmo carregamento de pagina, varios componentes reusam
 *   a mesma busca (em vez de baterem no servidor varias vezes). Recarregar a
 *   pagina zera esse cache, entao nunca fica dado velho.
 */
let _cacheProdutos: Promise<ProdutoView[]> | null = null;
export function carregarProdutos(): Promise<ProdutoView[]> {
  if (!PB) return Promise.resolve([]);
  if (_cacheProdutos) return _cacheProdutos;
  _cacheProdutos = (async () => {
    const res = await fetch(
      `${PB}/api/collections/produtos/records?perPage=200&sort=-created`,
      { cache: 'no-store' },
    );
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    return (json.items || []).map(mapear);
  })().catch((e) => {
    _cacheProdutos = null; // permite tentar de novo numa proxima chamada
    throw e;
  });
  return _cacheProdutos;
}

/** Busca um produto pelo id (sempre fresco). */
export async function carregarProduto(id: string): Promise<ProdutoView | null> {
  if (!PB || !id) return null;
  const res = await fetch(
    `${PB}/api/collections/produtos/records/${encodeURIComponent(id)}`,
    { cache: 'no-store' },
  );
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

/**
 * HTML de um carrossel de produtos (titulo + setas + trilha rolavel).
 * As setas sao ligadas depois pelo script da pagina (.carrossel-prev/next).
 */
export function carrosselHTML(
  titulo: string,
  sub: string,
  verTudoHref: string,
  produtos: ProdutoView[],
): string {
  if (!produtos.length) return '';
  // Largura FIXA por card (w-[X%] + shrink-0): trava o tamanho na porcentagem
  // mesmo com poucos produtos. Com min-w, o card incha ate o tamanho natural
  // da imagem (foto gigante). O catalogo segue com o card normal.
  const cards = produtos
    .map(
      (p) =>
        `<div class="w-[42%] shrink-0 snap-start sm:w-[27%] md:w-[22%] lg:w-[18%]">${cardHTML(p, { compacto: true })}</div>`,
    )
    .join('');
  const seta = (dir: 'prev' | 'next', rotulo: string, ch: string) =>
    `<button type="button" class="carrossel-${dir} grid h-9 w-9 place-items-center rounded-full border border-fundo-borda text-texto transition-colors hover:border-marca hover:text-marca" aria-label="${rotulo}">${ch}</button>`;

  return `
  <section class="container-loja py-8">
    <div class="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 class="font-titulo text-2xl font-bold text-texto">${esc(titulo)}</h2>
        ${sub ? `<p class="text-sm text-texto-suave">${esc(sub)}</p>` : ''}
      </div>
      <div class="flex items-center gap-2">
        <a href="${esc(verTudoHref)}" class="hidden text-sm font-medium text-marca-escuro hover:underline sm:inline">Ver tudo</a>
        ${seta('prev', 'Anterior', '&lsaquo;')}
        ${seta('next', 'Próximo', '&rsaquo;')}
      </div>
    </div>
    <div class="carrossel-track flex snap-x gap-4 overflow-x-auto scroll-smooth pb-2">${cards}</div>
  </section>`;
}

/**
 * HTML de um card de produto.
 * - `compacto`: versao menor (usada nos carrosseis da home).
 *
 * Obs.: o catalogo chama `lista.map(cardHTML)`, entao o 2o argumento pode vir
 * como indice (numero). Por isso so tratamos `opts` quando for objeto.
 */
export function cardHTML(p: ProdutoView, opts?: { compacto?: boolean } | number): string {
  const compacto = typeof opts === 'object' && opts !== null ? !!opts.compacto : false;
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

  const precoTam = compacto ? 'text-sm' : 'text-base';
  const precoBloco =
    site.mostrarPrecos && atualFmt
      ? `<div class="flex items-baseline gap-1.5">
           <span class="font-titulo ${precoTam} font-bold text-marca">${atualFmt}</span>
           ${promo && deFmt ? `<span class="text-xs text-texto-suave line-through">${deFmt}</span>` : ''}
         </div>`
      : `<span class="${compacto ? 'text-xs' : 'text-sm'} font-medium text-texto-suave">Consultar no WhatsApp</span>`;

  const corpo = compacto
    ? `<div class="flex flex-1 flex-col gap-0.5 p-2.5">
         <span class="truncate text-[10px] uppercase tracking-wide text-texto-suave">${esc(p.marca)}</span>
         <h3 class="line-clamp-2 font-titulo text-xs font-semibold leading-snug text-texto">${esc(p.nome)}</h3>
         <div class="mt-auto pt-1.5">${precoBloco}</div>
       </div>`
    : `<div class="flex flex-1 flex-col gap-1 p-3">
         <span class="text-xs uppercase tracking-wide text-texto-suave">${esc(p.marca)} &middot; ${esc(rotuloCategoria(p.categoria))}</span>
         <h3 class="font-titulo text-sm font-semibold leading-snug text-texto">${esc(p.nome)}</h3>
         <div class="mt-auto pt-2">${precoBloco}</div>
       </div>`;

  return `
  <a href="${withBase('/produto')}?id=${encodeURIComponent(p.id)}"
     class="group flex flex-col overflow-hidden rounded-marca border border-fundo-borda bg-fundo shadow-card transition-colors hover:border-marca">
    <div class="relative aspect-square overflow-hidden bg-fundo-claro">
      <img src="${esc(capa.src)}" alt="${esc(capa.alt)}" width="600" height="600" loading="lazy" decoding="async"
           class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      ${etiquetas}
    </div>
    ${corpo}
  </a>`;
}
