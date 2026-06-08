# Painel de conteudo (logo, banners e barra de aviso)

Permite editar o visual pelo painel logado (PocketBase), sem mexer no codigo:
logo, banners do hero e texto da barra de aviso. O site le tudo com **fallback**
(se a colecao nao existir/estiver vazia, usa o conteudo atual e nada quebra).

## Colecao 1: `configuracao` (logo + barra de aviso)

Crie a colecao **`configuracao`** (tipo Base) com os campos:

| Campo | Tipo | Observacao |
|---|---|---|
| `barra_aviso` | Plain text | texto da faixa no topo (opcional) |
| `logo` | File (single) | imagem da logo (PNG/SVG, fundo transparente de preferencia) |

- Crie **1 unico registro** e preencha o que quiser (pode deixar a barra vazia).
- **API rules:** List e View **destravados** (publico le); Create/Update/Delete
  **travados** (so admin). Igual aos produtos.

## Colecao 2: `banners` (hero)

Crie a colecao **`banners`** (tipo Base) com os campos:

| Campo | Tipo | Observacao |
|---|---|---|
| `imagem` | File (single) | a arte do banner (ex.: 1600x600). So banners com imagem aparecem |
| `titulo` | Plain text | usado no alt/acessibilidade (opcional) |
| `subtitulo` | Plain text | opcional |
| `link` | Plain text | para onde o banner leva ao clicar (opcional) |
| `ordem` | Number | ordem de exibicao (1, 2, 3...) |
| `ativo` | Bool | so aparece se marcado |

- **API rules:** List e View **destravados**; Create/Update/Delete **travados**.

## Como funciona depois de criar

- Subiu uma **logo** em `configuracao` → o site troca o placeholder pela sua logo.
- Cadastrou **banners** ativos → o hero passa a mostrar suas imagens (em ordem),
  no lugar dos slides de texto.
- Mudou o texto de `barra_aviso` → a faixa do topo atualiza.

Tudo na hora (e so atualizar a pagina), sem refazer o site.

## Dica para as artes (Canva)

- **Logo:** PNG com fundo transparente fica melhor sobre o header preto.
- **Banner:** mantenha o texto importante mais ao centro; em telas pequenas as
  bordas podem cortar um pouco.
