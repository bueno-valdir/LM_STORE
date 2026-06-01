/**
 * Configuracao central de design da Lojinha da Miih.
 *
 * AQUI fica a "fonte da verdade" de cores, fontes e tokens.
 * Para mudar a identidade visual rapidamente, edite apenas este arquivo.
 *
 * Paleta: tema claro (branco), contrastes em preto e detalhes em rosa choque.
 * TODO (assets reais): confirmar o tom exato do rosa com base no logo do Canva.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Fundo claro do site (branco) e superficies.
        fundo: {
          DEFAULT: '#ffffff', // fundo principal (branco)
          claro: '#faf7f9',   // cards e secoes (branco levemente rosado)
          borda: '#ece7ea',   // bordas suaves
        },
        // Preto da marca (header, footer e textos de maior contraste).
        preto: {
          DEFAULT: '#0e0e0f',
          claro: '#1b1b1d',   // superficies escuras (ex.: menu sobre o header preto)
        },
        // Acento principal: rosa choque.
        marca: {
          DEFAULT: '#ff1493', // rosa choque
          escuro: '#d60f77',  // usado em hover e texto sobre branco (mais contraste)
          claro: '#ff66b8',
        },
        // Cores do gradiente do anel do logo (mantidas em tom rosa).
        gradiente: {
          rosa: '#ff1493',
          claro: '#ff66b8',
        },
        // Tons de texto (sobre fundo branco).
        texto: {
          DEFAULT: '#141215', // texto principal (quase preto)
          suave: '#615b62',   // texto secundario (cinza)
        },
      },
      fontFamily: {
        // Fonte de titulos. A logo usa manuscrita; aqui usamos uma display elegante
        // como aproximacao acessivel para titulos de interface.
        // TODO (assets reais): definir a fonte da marca a partir do Canva.
        titulo: ['"Poppins"', 'system-ui', 'sans-serif'],
        // Fonte de corpo de texto.
        corpo: ['"Inter"', 'system-ui', 'sans-serif'],
        // Fonte decorativa manuscrita (usada em poucos lugares, ex.: assinatura).
        manuscrita: ['"Dancing Script"', 'cursive'],
      },
      backgroundImage: {
        // Gradiente da marca (rosa choque), reutilizavel em detalhes e no logo.
        'gradiente-marca':
          'linear-gradient(135deg, #ff1493 0%, #ff66b8 100%)',
      },
      borderRadius: {
        marca: '1.25rem',
      },
      boxShadow: {
        // Sombra suave para cards no tema claro.
        marca: '0 10px 30px -14px rgba(255, 20, 147, 0.35)',
        card: '0 8px 24px -16px rgba(14, 14, 15, 0.25)',
      },
    },
  },
  plugins: [],
};
