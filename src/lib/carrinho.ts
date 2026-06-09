/**
 * Carrinho de compras (roda no NAVEGADOR, guardado no localStorage).
 *
 * Guarda apenas o necessario para exibir (id, nome, preco, qty, imagem).
 * IMPORTANTE: o preco aqui e so para mostrar ao cliente. No checkout, o
 * SERVIDOR recalcula o preco real pelo banco (trava anti-fraude), entao um
 * preco adulterado no navegador nao afeta a cobranca.
 */

export interface ItemCarrinho {
  id: string;
  nome: string;
  preco: number; // unitario, so para exibicao
  qty: number;
  imagem: string;
}

const CHAVE = 'lm_carrinho_v1';

function ler(): ItemCarrinho[] {
  try {
    const raw = localStorage.getItem(CHAVE);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (_) {
    return [];
  }
}

function salvar(itens: ItemCarrinho[]) {
  localStorage.setItem(CHAVE, JSON.stringify(itens));
  // Avisa a interface (ex.: contador no header) que o carrinho mudou.
  window.dispatchEvent(new CustomEvent('carrinho:mudou'));
}

export function itens(): ItemCarrinho[] {
  return ler();
}

/** Quantidade total de itens (soma das quantidades). */
export function contar(): number {
  return ler().reduce((s, i) => s + (i.qty || 0), 0);
}

/** Valor total (apenas exibicao; servidor revalida). */
export function total(): number {
  return ler().reduce((s, i) => s + (i.preco || 0) * (i.qty || 0), 0);
}

/** Adiciona um item (ou soma a quantidade se ja existir). */
export function adicionar(item: Omit<ItemCarrinho, 'qty'>, qty = 1) {
  const lista = ler();
  const existente = lista.find((i) => i.id === item.id);
  if (existente) {
    existente.qty += qty;
  } else {
    lista.push({ ...item, qty });
  }
  salvar(lista);
}

/** Define a quantidade de um item (remove se <= 0). */
export function definirQty(id: string, qty: number) {
  let lista = ler();
  if (qty <= 0) {
    lista = lista.filter((i) => i.id !== id);
  } else {
    const it = lista.find((i) => i.id === id);
    if (it) it.qty = qty;
  }
  salvar(lista);
}

/** Remove um item. */
export function remover(id: string) {
  salvar(ler().filter((i) => i.id !== id));
}

/** Esvazia o carrinho. */
export function limpar() {
  salvar([]);
}

/** Itens no formato que o checkout do servidor espera ({ id, qty }). */
export function paraCheckout(): { id: string; qty: number }[] {
  return ler().map((i) => ({ id: i.id, qty: i.qty }));
}
