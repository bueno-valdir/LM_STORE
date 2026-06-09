# Extras: Feed do Instagram + Videos

Duas secoes da home que aparecem **so quando configuradas** (senao ficam
escondidas, sem quebrar nada). Tudo desligado por padrao.

## 1. Feed do Instagram (Behold.so, gratis)

Mostra os ultimos posts do @lojinhadamiih_ automaticamente.

Passos:
1. Crie conta em **behold.so** (plano gratis) e conecte o Instagram da loja.
2. Crie um **feed** e copie o **ID do feed** (algo como `aBcD1234...`).
3. Cole o ID em `src/config/site.ts` no campo **`beholdFeedId`**.
4. Publique. A secao "No Instagram" aparece sozinha com os posts.

> Sem o ID, a secao fica escondida. O Behold cuida da conexao com a Meta
> (sem app/token da nossa parte e sem manutencao).

## 2. Videos (YouTube / Instagram)

Mostra videos embutidos, gerenciados pelo painel.

Crie a colecao **`videos`** no painel (tipo Base):
| Campo | Tipo | Observacao |
|---|---|---|
| `titulo` | Plain text | opcional (aparece abaixo do video) |
| `url` | Plain text | link do YouTube (watch/shorts/youtu.be) ou Instagram (reel/p) |
| `ordem` | Number | ordem de exibicao |
| `ativo` | Bool | so aparece se marcado |

**API rules:** List e View **destravados** (publico le); Create/Update/Delete **travados**.

Depois e so cadastrar registros (colar a URL do video). A secao "Videos"
aparece sozinha quando houver pelo menos um video ativo.

> Suporta YouTube (todos os formatos de link) e Instagram (reel/p/tv). O site
> monta o embed automaticamente a partir da URL.
