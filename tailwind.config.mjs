/**
 * Configuracao central de design da Lojinha da Miih.
 *
 * AQUI fica a "fonte da verdade" de cores, fontes e tokens.
 * Para mudar a identidade visual rapidamente, edite apenas este arquivo.
 *
 * TODO (assets reais): confirmar a paleta exata com base no logo do Canva.
 * Os valores abaixo sao uma aproximacao do gradiente da marca
 * (rosa, laranja, amarelo/dourado) sobre base escura.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base escura da marca.
        fundo: {
          DEFAULT: '#171013', // fundo principal (quase preto, levemente quente)
          claro: '#241a1f',   // cards e superficies elevadas
          borda: '#3a2a31',   // bordas suaves
        },
        // Acento principal: rosa da marca.
        marca: {
          DEFAULT: '#ff5fa2', // rosa vibrante
          escuro: '#d6437f',
          claro: '#ff8ec0',
        },
        // Cores do gradiente do anel do logo.
        gradiente: {
          rosa: '#ff5fa2',
          laranja: '#ff8a4c',
          dourado: '#ffcf5c',
        },
        // Tons de texto.
        texto: {
          DEFAULT: '#f6eef1', // texto principal sobre fundo escuro
          suave: '#c8b8c0',   // texto secundario
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
        // Gradiente da marca, reutilizavel em botoes, faixas e detalhes.
        'gradiente-marca':
          'linear-gradient(135deg, #ff5fa2 0%, #ff8a4c 55%, #ffcf5c 100%)',
      },
      borderRadius: {
        marca: '1.25rem',
      },
      boxShadow: {
        marca: '0 10px 30px -12px rgba(255, 95, 162, 0.45)',
      },
    },
  },
  plugins: [],
};
