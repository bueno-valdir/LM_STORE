import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

/**
 * URL e caminho base do site.
 *
 * Hoje publicamos no GitHub Pages, que serve o projeto num subcaminho com o
 * nome EXATO do repositorio (https://bueno-valdir.github.io/LM_STORE/). O Pages
 * diferencia maiusculas/minusculas no caminho, entao BASE_PATH precisa bater
 * com o nome do repositorio (LM_STORE, em maiusculas).
 *
 * Ao migrar para o dominio proprio (ex.: loja.veraxlegalops.com.br), que serve
 * na raiz, basta trocar SITE_URL e deixar BASE_PATH como '/'. Os links internos
 * usam o helper withBase(), entao se adaptam sozinhos.
 */
const SITE_URL = 'https://bueno-valdir.github.io';
const BASE_PATH = '/LM_STORE';

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
