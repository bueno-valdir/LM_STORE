import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

/**
 * URL e caminho base do site.
 *
 * Hoje publicamos no GitHub Pages, que serve o projeto num subcaminho
 * (https://bueno-valdir.github.io/lm_store/). Por isso definimos `base`.
 *
 * Ao migrar para o dominio proprio (ex.: loja.veraxlegalops.com.br), que serve
 * na raiz, basta trocar SITE_URL e deixar BASE_PATH como '/' (string vazia
 * tambem funciona). Os links internos usam o helper withBase(), entao se
 * adaptam sozinhos.
 */
const SITE_URL = 'https://bueno-valdir.github.io';
const BASE_PATH = '/lm_store';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  // Sem barra final nas URLs internas, combina com o GitHub Pages.
  trailingSlash: 'ignore',
  // Build estatico (SSG): portavel para qualquer hospedagem (Pages, Hostinger/nginx, Vercel).
  output: 'static',
  integrations: [
    tailwind(),
    sitemap(),
  ],
});
