/**
 * Acesso aos dados de produtos.
 *
 * Hoje os dados vem de um JSON local (src/data/produtos.json), facil de editar
 * sem banco. Para migrar a um CMS no futuro, basta trocar a implementacao
 * destas funcoes mantendo a mesma assinatura; as paginas nao mudam.
 */
import dados from '../data/produtos.json';
import type { Produto, Categoria, CategoriaInfo } from './types';

/** Lista de categorias e seus rotulos amigaveis (ordem de exibicao). */
export const categorias: CategoriaInfo[] = [
  { slug: 'maquiagem', rotulo: 'Maquiagem' },
  { slug: 'skincare', rotulo: 'Skincare' },
  { slug: 'kits-presentes', rotulo: 'Kits e Presentes' },
];

/** Retorna todos os produtos. */
export function listarProdutos(): Produto[] {
  return dados as Produto[];
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
