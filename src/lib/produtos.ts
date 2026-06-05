/**
 * Acesso aos dados de produtos.
 *
 * Os produtos vem do painel (PocketBase) e sao buscados no momento do build.
 * Se o painel estiver indisponivel (ou nao configurado), o site cai para os
 * produtos de exemplo do JSON local, para o build nunca quebrar.
 *
 * Trocar a fonte no futuro (outro CMS) so exige mudar carregarProdutos();
 * as paginas e os componentes continuam iguais.
 */
import dadosExemplo from '../data/produtos.json';
import { site } from '../config/site';
import type { Produto, Categoria, CategoriaInfo } from './types';

/** Lista de categorias e seus rotulos amigaveis (ordem de exibicao). */
export const categorias: CategoriaInfo[] = [
  { slug: 'maquiagem', rotulo: 'Maquiagem' },
  { slug: 'skincare', rotulo: 'Skincare' },
  { slug: 'kits-presentes', rotulo: 'Kits e Presentes' },
];

/** Converte um numero "solto" (number, string ou vazio) para number ou null. */
function paraNumero(valor: unknown): number | null {
  if (valor === null || valor === undefined || valor === '') return null;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

/**
 * Mapeia um registro do PocketBase para o nosso tipo Produto.
 * Os nomes dos campos seguem a colecao "produtos" do painel.
 */
function mapearRegistro(rec: any): Produto {
  const base = (site.pocketbaseUrl || '').replace(/\/$/, '');

  // O campo de arquivos (imagens) vem como lista de nomes de arquivo.
  const arquivos: string[] = Array.isArray(rec.imagens)
    ? rec.imagens
    : rec.imagens
      ? [rec.imagens]
      : [];
  const imagens = arquivos.map((arq) => ({
    src: `${base}/api/files/produtos/${rec.id}/${arq}`,
    alt: rec.nome ?? 'Produto',
  }));

  return {
    id: rec.id,
    nome: rec.nome ?? '',
    marca: rec.marca ?? '',
    // aceita o campo como "categoria" (renomeado) ou "select" (nome padrao).
    categoria: (rec.categoria ?? rec.select ?? 'maquiagem') as Categoria,
    descricao: rec.descricao ?? '',
    preco: paraNumero(rec.preco),
    precoPromocional: paraNumero(rec.preco_promocional),
    tom: rec.tom || null,
    volume: rec.volume || null,
    imagens: imagens.length
      ? imagens
      : [{ src: '/images/products/placeholder-1.svg', alt: rec.nome ?? 'Produto' }],
    disponibilidade: rec.disponivel ? 'em-estoque' : 'esgotado',
    destaque: !!rec.destaque,
    promocao: !!rec.promocao,
  };
}

/** Busca os produtos no painel (PocketBase). Cai para os exemplos se falhar. */
async function carregarProdutos(): Promise<Produto[]> {
  const base = (site.pocketbaseUrl || '').replace(/\/$/, '');
  if (!base) return dadosExemplo as Produto[];

  try {
    const url = `${base}/api/collections/produtos/records?perPage=200&sort=-created`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: any = await res.json();
    const items: any[] = Array.isArray(json.items) ? json.items : [];
    // Painel acessivel, porem ainda sem produtos: retorna lista vazia.
    return items.map(mapearRegistro);
  } catch (erro) {
    console.warn(
      '[produtos] Nao foi possivel ler do painel (PocketBase). ' +
        'Usando produtos de exemplo. Detalhe:',
      erro,
    );
    return dadosExemplo as Produto[];
  }
}

// Carrega os produtos uma vez, no momento do build (top-level await).
const produtos: Produto[] = await carregarProdutos();

/** Retorna todos os produtos. */
export function listarProdutos(): Produto[] {
  return produtos;
}

/** Retorna um produto pelo id, ou undefined se nao existir. */
export function buscarProdutoPorId(id: string): Produto | undefined {
  return listarProdutos().find((p) => p.id === id);
}

/** Retorna apenas os produtos marcados como destaque. */
export function listarDestaques(): Produto[] {
  return listarProdutos().filter((p) => p.destaque);
}

/** Retorna apenas os produtos em promocao. */
export function listarPromocoes(): Produto[] {
  return listarProdutos().filter((p) => p.promocao);
}

/** Retorna o rotulo amigavel de uma categoria. */
export function rotuloCategoria(slug: Categoria): string {
  return categorias.find((c) => c.slug === slug)?.rotulo ?? slug;
}

/**
 * Define qual preco esta valendo (promocional quando existir) e o preco "de".
 * Retorna null em precoAtual quando o produto esconde o preco (preco = null).
 */
export function precoVigente(produto: Produto): {
  precoAtual: number | null;
  precoDe: number | null;
  temPromocao: boolean;
} {
  const temPromocao =
    typeof produto.precoPromocional === 'number' &&
    produto.precoPromocional > 0;

  if (temPromocao) {
    return {
      precoAtual: produto.precoPromocional as number,
      precoDe: produto.preco,
      temPromocao: true,
    };
  }

  return { precoAtual: produto.preco, precoDe: null, temPromocao: false };
}

/** Formata um valor em reais (pt-BR). Retorna null se o valor for null. */
export function formatarPreco(valor: number | null): string | null {
  if (valor === null || valor === undefined) return null;
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
