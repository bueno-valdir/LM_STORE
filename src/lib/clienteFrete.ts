/**
 * Calculo de frete (roda no NAVEGADOR do visitante).
 *
 * O navegador so manda { id, cep, qty } para o servidor (hook do PocketBase em
 * /lm/frete). Quem decide peso/dimensoes, faz a conta com o Melhor Envio e
 * guarda o token e o servidor. Aqui nao ha nada secreto.
 */
import { site } from '../config/site';

const PB = (site.pocketbaseUrl || '').replace(/\/$/, '');

export interface OpcaoFrete {
  nome: string;
  empresa: string;
  preco: number;
  prazo: number; // dias uteis (ja inclui manuseio)
}

/** CEP valido = 8 digitos (com ou sem hifen). */
export function cepValido(cep: string): boolean {
  return /^\d{5}-?\d{3}$/.test((cep || '').trim());
}

/** Formata 12345678 -> 12345-678 enquanto digita. */
export function formatarCep(cep: string): string {
  const d = (cep || '').replace(/\D/g, '').slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

/** Pede ao servidor as opcoes de frete para um produto e um CEP de destino. */
export async function calcularFrete(produtoId: string, cep: string, qty = 1): Promise<OpcaoFrete[]> {
  if (!PB) return [];
  const res = await fetch(`${PB}/lm/frete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: produtoId, cep: (cep || '').replace(/\D/g, ''), qty }),
    cache: 'no-store',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}) as any);
    throw new Error(err.erro || 'Não foi possível calcular o frete agora.');
  }
  const data = await res.json();
  return Array.isArray(data.opcoes) ? data.opcoes : [];
}
