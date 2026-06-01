import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// URL do site. Trocar para o dominio proprio quando migrar de staging.
// Importante para SEO, Open Graph e geracao do sitemap.
const SITE_URL = 'https://loja.veraxlegalops.com.br';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  // Build estatico (SSG): portavel para qualquer hospedagem (Hostinger/nginx, Vercel, Netlify).
  output: 'static',
  integrations: [
    tailwind(),
    sitemap(),
  ],
});
