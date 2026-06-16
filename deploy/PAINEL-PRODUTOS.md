# Painel de produtos (coleção `produtos`)

Guia da coleção que alimenta o catálogo do site. Cobre dois ajustes importantes:

1. **Várias imagens por produto** (correção de emergência).
2. **Categorias/subcategorias** (lista pronta para colar no campo `categoria`).

O site já está preparado para os dois — falta só configurar o campo no painel.
Tudo aqui é feito no painel logado (PocketBase, em `/_/`), **sem mexer no código
nem reiniciar nada**. As mudanças valem na hora (é só atualizar a página do site).

---

## 1) Várias imagens por produto (URGENTE)

Hoje o campo de imagem aceita **1 foto**. O site já mostra uma galeria com
miniaturas quando o produto tem mais de uma foto — basta liberar o campo:

1. Entre no painel: `https://painel.lmstore.veraxlegalops.com.br/_/`
2. Menu **Collections** → coleção **`produtos`** → botão de **editar** (engrenagem/lápis).
3. Encontre o campo **`imagens`** (tipo **File**) e clique para editar.
4. Em **Max files** (ou "Máx. de arquivos"), troque de `1` para **`10`**
   (pode ser outro número; 10 é uma folga confortável).
5. Confirme que **Max file size** comporta as fotos (ex.: 5 MB) e que os
   **Mime types** aceitam imagens (`image/jpeg`, `image/png`, `image/webp`).
6. **Save changes**.

Pronto. Ao editar um produto, dá para enviar várias fotos. A **primeira** vira a
capa; as demais aparecem como miniaturas clicáveis na página do produto.

> Observação: se o campo `imagens` tiver sido criado como **single** (1 arquivo
> fixo), o PocketBase pode não deixar mudar para múltiplo direto. Nesse caso,
> crie um novo campo File chamado `imagens` com Max files = 10 e remova o antigo
> (faça com a loja ainda em desenvolvimento, para não perder fotos já enviadas).

---

## 1.1) Campo `tom` (tons numerados: 0 a 10)

Alguns produtos (ex.: base) vendem em tons numerados (Tom 1, Tom 2, ...). O
campo **`tom`** controla isso com um numero de **0 a 10**:

- **0** → o produto **não tem tom** (o seletor de tom fica escondido na página).
- **1** → aparece só o **Tom 1**.
- **2** → aparecem os tons **1 e 2**.
- **N** → aparecem os tons **1 até N** (até 10).

Na página do produto, o cliente escolhe o tom num seletor, e a mensagem do
WhatsApp já vai com o tom escolhido (ex.: "..., tom 3").

Como configurar no painel:

1. Em **Collections** → **`produtos`** → editar a coleção.
2. O campo **`tom`** deve ser do tipo **Number** (numérico).
3. Em **Min**, coloque `0`; em **Max**, coloque `10` (e marque "No decimals",
   se houver, para aceitar só inteiros).
4. **Save changes.**

> Se hoje o `tom` for tipo **Plain text**, troque para **Number** (na fase de
> desenvolvimento, sem produtos reais, é seguro). Ao cadastrar, basta digitar o
> número de tons (ou `0`/vazio para esconder).

## 1.2) Campos de peso e tamanho (para o frete)

Para o cálculo de frete (quando ligarmos o envio), cada produto precisa de peso
e dimensões da embalagem. Crie estes campos (tipo **Number**) na coleção
`produtos` — pode deixar vazios por enquanto:

| Campo | Tipo | Unidade | Observação |
|---|---|---|---|
| `peso_g` | Number | gramas | peso do produto com embalagem |
| `altura_cm` | Number | cm | altura da embalagem |
| `largura_cm` | Number | cm | largura da embalagem |
| `comprimento_cm` | Number | cm | comprimento da embalagem |

Esses campos **não aparecem** para o cliente no site — servem só para o frete.

## 2) Categorias e subcategorias

O catálogo agora usa **categoria → subcategoria** (ex.: Rosto → Base). No painel,
o produto guarda apenas o **slug da subcategoria** (a folha) no campo `categoria`.
O site descobre sozinho a categoria-mãe (Rosto, Olhos, ...).

Campo **`categoria`** = **Select** (seleção única). Cole exatamente estes valores
na lista de opções (slugs sem acento; o nome bonito aparece no site automaticamente):

```
base
blush
bronzer-contorno
corretivo
fixador-bruma
iluminador
paleta-pele
po-facial
primer
cilios-posticos
delineador
glitter-pigmento
lapis-de-olho
mascara-de-cilios
sombras
batom
esfoliante-labial
gloss-labial
lapis-de-boca
lip-balm-oil
lip-tint
lapis-sobrancelha
sombra-sobrancelha
gel-sobrancelha
acessorios-skincare
limpeza-facial
esfoliante-facial
hidratante-facial
demaquilante
sabonete
serum-tratamentos
kit-pinceis
pincel-facial
pincel-olhos
esponjas
diversos
maquiagem-infantil
```

Mapa de qual subcategoria pertence a qual categoria (para conferência):

| Categoria      | Subcategorias |
|----------------|---------------|
| **Rosto**       | base, blush, bronzer-contorno, corretivo, fixador-bruma, iluminador, paleta-pele, po-facial, primer |
| **Olhos**       | cilios-posticos, delineador, glitter-pigmento, lapis-de-olho, mascara-de-cilios, sombras |
| **Lábios**      | batom, esfoliante-labial, gloss-labial, lapis-de-boca, lip-balm-oil, lip-tint |
| **Sobrancelhas**| lapis-sobrancelha, sombra-sobrancelha, gel-sobrancelha |
| **Skincare**    | acessorios-skincare, limpeza-facial, esfoliante-facial, hidratante-facial, demaquilante, sabonete, serum-tratamentos |
| **Pincéis**     | kit-pinceis, pincel-facial, pincel-olhos, esponjas |
| **Acessórios**  | diversos, maquiagem-infantil |

> **Importante:** os slugs acima precisam bater com os de
> `src/config/categorias.ts` (a fonte da verdade do site). Se um dia for
> adicionar/renomear categoria, mude **nos dois lugares** (código + opções do
> select no painel). A lista pronta também sai de `slugsSubcategorias()`.

### "Marcas" no menu

A aba **Marcas** do menu é montada sozinha a partir do campo **`marca`** dos
produtos cadastrados — não precisa configurar nada. Para os nomes ficarem
agrupados certinho, escreva a marca sempre do mesmo jeito (ex.: sempre "Ruby
Rose", evitando variações como "ruby rose" ou "RubyRose").
