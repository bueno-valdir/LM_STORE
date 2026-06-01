# Lojinha da Miih

Catalogo mobile-first de maquiagem e skincare da **Lojinha da Miih** (Sorocaba-SP,
envio para todo o Brasil). Beleza acessivel, real e sem filtro, com pedido
finalizado pelo WhatsApp.

Construido com **Astro** (build estatico/SSG) e **Tailwind CSS**, pensado para
ser rapido, portavel e facil de editar sem banco de dados.

> Fase atual: desenvolvimento/staging. Build estatico portavel para migrar a um
> dominio proprio depois sem reescrever nada.

## Stack

- [Astro](https://astro.build) com saida estatica (`output: 'static'`).
- [Tailwind CSS](https://tailwindcss.com) com tokens centralizados.
- Dados de produtos em JSON local (`src/data/produtos.json`).
- Sitemap automatico (`@astrojs/sitemap`).

## Como rodar local

Pre-requisito: Node.js 18+ (recomendado 20+).

```bash
npm install      # instala dependencias
npm run dev      # sobe o servidor de desenvolvimento (http://localhost:4321)
```

Outros comandos:

```bash
npm run build    # gera o site estatico em dist/
npm run preview  # serve o dist/ localmente para conferir o build
```

## Estrutura de pastas

```
src/
  config/site.ts          # numero de WhatsApp, redes, textos e opcoes (EDITE AQUI)
  data/produtos.json      # catalogo de produtos (EDITE AQUI)
  lib/
    types.ts              # schema (tipos) do produto
    produtos.ts           # leitura/filtro de produtos e formatacao de preco
    whatsapp.ts           # montagem do link wa.me com mensagem pre-preenchida
  layouts/BaseLayout.astro# <head> com SEO + Open Graph, Header e Footer
  components/             # Header, Footer, Logo, ProductCard, WhatsAppButton
  pages/
    index.astro           # Home (hero, destaques, faixa de promocao)
    catalogo.astro        # Catalogo com filtro por categoria e atalho de promocoes
    produtos/[id].astro   # Detalhe do produto (galeria + botao WhatsApp)
    entregas-e-pagamento.astro
    sobre.astro
public/
  favicon.svg, og-default.svg
  images/products/        # imagens dos produtos (placeholders por enquanto)
tailwind.config.mjs       # CORES, FONTES e TOKENS da marca (EDITE AQUI)
```

## Como adicionar ou editar um produto

Os produtos ficam em `src/data/produtos.json`. Cada item segue o schema definido
em `src/lib/types.ts`:

```json
{
  "id": "batom-rosa-01",
  "nome": "Batom Matte Rosa",
  "marca": "Marca X",
  "categoria": "maquiagem",
  "descricao": "Texto descritivo do produto.",
  "preco": 29.9,
  "precoPromocional": 24.9,
  "tom": "Rosa Nude",
  "volume": null,
  "imagens": [
    { "src": "/images/products/batom-rosa-01.jpg", "alt": "Batom matte rosa nude" }
  ],
  "disponibilidade": "em-estoque",
  "destaque": true,
  "promocao": true
}
```

Dicas:

- `id` deve ser unico e estavel (vira a URL `/produtos/{id}` e entra na mensagem do WhatsApp).
- `categoria`: use `maquiagem`, `skincare` ou `kits-presentes` (ver `src/lib/produtos.ts`).
- Para **ocultar o preco** de um produto, use `"preco": null` (aparece "Consultar no WhatsApp").
- `precoPromocional`: quando preenchido, vira o preco em destaque e mostra o "de/por".
- `tom` e `volume` sao opcionais (use `null` quando nao se aplicar).
- Imagens vao em `public/images/products/`. Use formato moderno (`.webp`/`.avif`) quando possivel; sempre preencha o `alt` (acessibilidade).

## Configuracoes da loja

Edite `src/config/site.ts` para ajustar:

- **WhatsApp** (`whatsapp`): numero no formato `55` + DDD + numero (so digitos).
- **Mostrar precos** (`mostrarPrecos`): `true` para exibir, `false` para "consultar no WhatsApp".
- **Endereco** (`mostrarEndereco` + `endereco`): exibir ou nao o endereco fisico.
- **Instagram, e-mail, anos de tradicao, cidade, slogan e descricao (SEO)**.

## Identidade visual / tokens

Cores, fontes e tokens estao centralizados em `tailwind.config.mjs`. Para trocar
a paleta rapidamente, edite os valores em `theme.extend.colors` e
`theme.extend.fontFamily`. O gradiente da marca esta em `backgroundImage` como
`bg-gradiente-marca`.

## Como buildar e fazer deploy

O projeto gera um site **estatico** na pasta `dist/`, que pode ser hospedado em
qualquer lugar.

```bash
npm run build
```

### Opcao A (atual): GitHub Pages, automatico

O repositorio ja tem um fluxo de publicacao em `.github/workflows/deploy.yml`.
A cada push na branch de desenvolvimento, o site e buildado e publicado sozinho
numa branch `gh-pages` (criada automaticamente pelo fluxo).

Para ativar (so na primeira vez), pelo navegador, sem instalar nada:

1. Espere o fluxo rodar uma vez (aba **Actions** do repositorio, ate ficar verde).
   Isso cria a branch `gh-pages`.
2. No GitHub, va em **Settings** (Configuracoes) > **Pages**.
3. Em **Build and deployment** > **Source**, escolha **Deploy from a branch**.
4. Em **Branch**, selecione `gh-pages` e a pasta `/ (root)`. Clique em **Save**.
5. Aguarde ~1 minuto. O endereco aparece ali em **Settings > Pages**.

Endereco final: `https://bueno-valdir.github.io/lm_store/`.

O caminho base do Pages (`/lm_store`) esta em `astro.config.mjs` (`base`). Os
links internos usam o helper `src/lib/url.ts` (`withBase`), entao se adaptam ao
caminho automaticamente.

### Opcao B: Vercel ou Netlify (zero atrito)

- Conecte o repositorio. Build command: `npm run build`. Output: `dist`.
- O subdominio de staging pode apontar para esse deploy.
- Como o Vercel/Netlify servem na raiz, ajuste `base` para `'/'` em `astro.config.mjs`.

### Opcao C: VPS Hostinger com nginx

1. `npm run build` (gera `dist/`).
2. Envie o conteudo de `dist/` para o servidor (ex.: `/var/www/lojinha-da-miih`).
3. Configure o `server` do nginx apontando `root` para essa pasta, com
   `index index.html;` e `try_files $uri $uri/ =404;`.

### Migracao para dominio proprio

1. Atualize a constante `SITE_URL` em `astro.config.mjs`.
2. Coloque `BASE_PATH` como `'/'` em `astro.config.mjs` (dominio proprio serve na raiz).
3. Atualize o `Sitemap:` em `public/robots.txt`.
4. Rebuild e redeploy.

## Itens a anexar / confirmar

Pontos marcados no codigo com `TODO (assets reais)` ou `TODO (confirmar)`:

- [ ] **Logo oficial** (Canva): colocar em `public/logo.svg` e atualizar `src/components/Logo.astro`.
- [ ] **Paleta exata** da marca: confirmar e ajustar em `tailwind.config.mjs`.
- [ ] **Numero de WhatsApp** real (formato `5515...`): em `src/config/site.ts`.
- [ ] **Mostrar precos?** padrao = sim, ajustar `mostrarPrecos` se precisar.
- [ ] **Endereco fisico?** decidir e ajustar `mostrarEndereco`/`endereco`.
- [ ] **Fotos reais** dos produtos: em `public/images/products/` (substituir placeholders).
- [ ] **Banner Open Graph** real (`public/og-default.svg` -> imagem 1200x630).
- [ ] **Textos institucionais** (entregas, pagamento e Sobre): substituir os placeholders.
- [ ] **Produtos reais** no lugar dos 3 exemplos em `src/data/produtos.json`.

## Convencoes

- Sem travessao (em-dash) em textos de interface; usar virgula ou parenteses.
- Comentarios em portugues onde fizer sentido.
- Commits descritivos.
