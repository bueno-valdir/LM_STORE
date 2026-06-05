/**
 * Montagem do link de pedido via WhatsApp (wa.me).
 *
 * O botao "Pedir no WhatsApp" usa estas funcoes para gerar um link com
 * mensagem pre-preenchida. Numero e formato vem da config do site.
 */
import { site } from '../config/site';
import type { Produto } from './types';
import { precoVigente, formatarPreco } from './produtos';

/**
 * Monta a mensagem de interesse em um produto.
 * Exemplo: "Olá! Tenho interesse no produto: Base Liquida (exemplo-001), tom Bege Medio - R$ 39,90".
 */
export function mensagemProduto(produto: Produto): string {
  const partes: string[] = [];
  partes.push(`Olá! Tenho interesse no produto: ${produto.nome} (${produto.id})`);

  if (produto.tom) {
    partes.push(`, tom ${produto.tom}`);
  }

  const { precoAtual } = precoVigente(produto);
  const precoFormatado = formatarPreco(precoAtual);
  if (precoFormatado) {
    partes.push(` - ${precoFormatado}`);
  }

  return partes.join('');
}

/** Mensagem generica para o botao de contato (sem produto especifico). */
export function mensagemGeral(): string {
  return `Olá! Vim pelo site da ${site.nome} e gostaria de tirar uma dúvida.`;
}

/** Gera o link wa.me com a mensagem ja codificada para URL. */
export function linkWhatsApp(mensagem: string): string {
  const texto = encodeURIComponent(mensagem);
  return `https://wa.me/${site.whatsapp}?text=${texto}`;
}

/** Atalho: link de pedido para um produto. */
export function linkPedidoProduto(produto: Produto): string {
  return linkWhatsApp(mensagemProduto(produto));
}
