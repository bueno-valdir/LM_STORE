/**
 * Ajuste de caminhos internos para respeitar o caminho base do site.
 *
 * No GitHub Pages o site fica em /lm_store/, entao um link "/catalogo" precisa
 * virar "/lm_store/catalogo". Use withBase() em TODO href e src de imagem que
 * comece com "/". Links externos (http...) e a montagem do wa.me ficam de fora.
 *
 * Ao migrar para dominio proprio na raiz, basta mudar `base` no astro.config;
 * este helper continua funcionando sem alterar as paginas.
 */

/** Caminho base configurado em astro.config (ex.: "/lm_store/" ou "/"). */
const BASE = import.meta.env.BASE_URL;

/** Prefixa um caminho local com o base do site, evitando barras duplicadas. */
export function withBase(caminho: string): string {
  // Caminhos externos ou ancoras puras nao mudam.
  if (/^([a-z]+:)?\/\//i.test(caminho) || caminho.startsWith('#')) {
    return caminho;
  }
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const path = caminho.startsWith('/') ? caminho : `/${caminho}`;
  return `${base}${path}`;
}
