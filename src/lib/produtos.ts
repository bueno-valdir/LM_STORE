/**
 * Utilitarios de produtos (categorias, preco, formatacao).
 *
 * Os produtos em si sao lidos do painel (PocketBase) pelo navegador, em
 * src/lib/clienteProdutos.ts. Este arquivo mantem apenas os utilitarios que
 * tambem sao usados no build (ex.: pela montagem da mensagem do WhatsApp).
 */
import type { Produto } from './types';

// As categorias/subcategorias e seus rotulos ficam em src/config/categorias.ts.
// No runtime do site, o rotulo amigavel vem de `rotuloCategoria` em
// src/lib/clienteProdutos.ts (que usa aquela arvore).

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
