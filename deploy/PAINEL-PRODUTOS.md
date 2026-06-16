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
