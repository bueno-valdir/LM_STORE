import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

/**
 * URL e caminho base do site (configuraveis por ambiente).
 *
 * Sao lidos de variaveis de ambiente para o mesmo codigo servir em dois lugares:
 *
 * - GitHub Pages (rascunho/teste): serve num subcaminho com o nome do
 *   repositorio. Padrao: SITE_URL = https://bueno-valdir.github.io e
 *   SITE_BASE = /LM_STORE. O Pages diferencia maiusculas, por isso /LM_STORE.
 *
 * - Hostinger (dominio proprio): serve na raiz. O fluxo de deploy define
 *   SITE_BASE = "/" e SITE_URL = o dominio real (ex.: https://seudominio.com.br).
 *
 * Para mudar fora de CI, basta exportar as variaveis antes do build, ex.:
 *   SITE_BASE=/ SITE_URL=https://seudominio.com.br npm run build
 */
const SITE_URL = process.env.SITE_URL || 'https://bueno-valdir.github.io';
const BASE_PATH = process.env.SITE_BASE || '/LM_STORE';

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
