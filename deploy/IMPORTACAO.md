# Importação de produtos em massa (planilha + fotos por link)

Cadastra muitos produtos de uma vez a partir de uma **planilha**, baixando e
anexando as **fotos por link** (URLs públicas). Não muda nenhuma configuração do
painel — só cria os produtos respeitando o schema atual.

## Antes de começar (uma vez)

1. **Crie os campos** da coleção `produtos` no painel, se ainda não existirem
   (ver `deploy/PAINEL-PRODUTOS.md`): `categoria` (select), `tom` (number),
   `estoque` (number), `estoque_tons` (JSON), `peso_g`, `altura_cm`,
   `largura_cm`, `comprimento_cm` (number), e `imagens` com **Max files = 10**.
2. Tenha o **Node 18+** instalado na máquina onde for rodar (o seu PC ou o VPS).
3. Tenha o **login de admin** do painel em mãos (e-mail e senha).

## Passo a passo

### 1) Preencha a planilha
Use o modelo **`scripts/modelo-produtos.csv`** (abra no Google Sheets ou Excel).
Cada linha é um produto. Colunas:

| Coluna | O que é | Exemplo |
|---|---|---|
| `nome` | nome do produto | Base Líquida Matte |
| `marca` | marca (escreva sempre igual) | Payot |
| `categoria` | **slug** da subcategoria | base |
| `preco` | preço normal | 49.90 |
| `preco_promocional` | preço em promoção (ou vazio) | 39.90 |
| `tom` | nº de tons (0 = sem tom; N = tons 1..N) | 3 |
| `volume` | volume/peso visível | 30ml |
| `descricao` | descrição (pode ter vírgulas se entre "aspas") | "Base matte..." |
| `peso_g` | peso p/ frete (gramas) | 120 |
| `altura_cm` `largura_cm` `comprimento_cm` | dimensões p/ frete (cm) | 12 / 4 / 4 |
| `estoque` | unidades (produtos SEM tom) | 8 |
| `estoque_tons` | unidades por tom, separadas por `\|` | 5\|0\|2 |
| `destaque` | aparece na home? (sim/nao) | sim |
| `promocao` | está em promoção? (sim/nao) | nao |
| `disponivel` | à venda? (sim/nao) | sim |
| `imagens` | URLs das fotos, separadas por `\|` | https://.../1.jpg\|https://.../2.jpg |

Dicas:
- **categoria**: use os slugs da lista em `deploy/PAINEL-PRODUTOS.md` (ex.: `base`,
  `batom`, `sombras`). O script avisa se digitar um slug que não existe.
- **fotos por link**: as URLs precisam ser **públicas** (abrir direto no navegador
  e mostrar a imagem). A primeira vira a capa.
- Deixe `estoque`/`estoque_tons` vazios se não quiser controlar estoque agora.

### 2) Exporte como CSV
No Google Sheets: **Arquivo → Fazer download → Valores separados por vírgula (.csv)**.

### 3) Rode o importador
No terminal, dentro da pasta do projeto:

```bash
# Teste primeiro (não grava nada, só confere a planilha):
node scripts/importar-produtos.mjs caminho/para/produtos.csv --dry-run

# Importação de verdade (informe o login de admin):
PB_URL="https://painel.lmstore.veraxlegalops.com.br" \
PB_ADMIN_EMAIL="seu-email-admin" \
PB_ADMIN_SENHA="sua-senha" \
node scripts/importar-produtos.mjs caminho/para/produtos.csv
```

O script mostra cada produto criado (com quantas fotos) e um resumo no fim.

## Observações de segurança
- A **senha de admin** é usada só na hora de rodar (via variável de ambiente).
  Não fica salva em lugar nenhum do projeto. Nunca coloque a senha dentro da
  planilha nem em arquivos versionados.
- Rodou e errou algo? Os produtos criados ficam no painel; é só apagar os
  indesejados e rodar de novo com a planilha corrigida.
- Rodar várias vezes a mesma planilha cria produtos **duplicados** (o script não
  verifica repetidos). Confira antes de repetir.
