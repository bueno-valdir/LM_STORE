# Entregas (Melhor Envio) - calculo de frete

> Status: **FUNDACAO/TRAVAS prontas, DESLIGADO por padrao.** Calculadora na
> pagina do produto, so Correios (PAC/SEDEX), comecando em **sandbox** (teste).

Travas de seguranca (ja no codigo):
1. **Token** do Melhor Envio so no servidor (`MELHOR_ENVIO_TOKEN`).
2. **Peso/dimensoes** vem do banco (produto), nunca do cliente.
3. **CEP de origem** vem do servidor (`CEP_ORIGEM`), nunca do cliente.
4. **Flag** `FRETE_ATIVO` (desligado por padrao) + **sandbox** primeiro.
5. So devolve as opcoes dos **Correios**.

## Passo 1 - Criar a conta no Melhor Envio (gratis)

1. Acesse **melhorenvio.com.br** e crie a conta da loja (CNPJ).
2. Confirme o e-mail e complete o cadastro (endereco de origem etc.).
3. Para testar sem valer dinheiro, use o ambiente **sandbox**:
   **sandbox.melhorenvio.com.br** (faca login/cadastro tambem la; o sandbox e
   separado da producao).

## Passo 2 - Gerar o token (sandbox)

No painel do **sandbox** (sandbox.melhorenvio.com.br):
1. Va em **Configuracoes -> Tokens / Integracoes** (ou "Gerenciar tokens").
2. Crie um token com a permissao de **calculo de frete** (`shipping-calculate`).
3. Copie o token (e um texto longo). Esse e o `MELHOR_ENVIO_TOKEN`.

> Guarde com cuidado: o token e secreto. Nunca colar no site/repositorio.

## Passo 3 - Adicionar os campos no painel (produtos)

Na colecao **`produtos`** do PocketBase, crie estes campos (tipo **Number**,
todos opcionais - se vazios, o servidor usa um padrao de pacote pequeno):

| Campo | Tipo | Unidade | Padrao se vazio |
|---|---|---|---|
| `peso` | Number | kg | 0,3 |
| `altura` | Number | cm | 4 |
| `largura` | Number | cm | 11 |
| `comprimento` | Number | cm | 16 |

> Preencha pelo menos nos produtos principais para o frete sair certo.

## Passo 4 - Subir o hook no servidor

Copie `pb_hooks/lm_frete.pb.js` (deste repositorio) para o VPS:

```
/docker/lmstore-pocketbase/pb_hooks/lm_frete.pb.js
```

(O `docker-compose` do PocketBase ja monta `/pb_hooks`.) O PocketBase carrega
os hooks ao subir/recriar o container.

## Passo 5 - Definir as variaveis (somente no servidor)

No `.env` do PocketBase (`/docker/lmstore-pocketbase/.env`, NAO vai pro repo):

```
FRETE_ATIVO=false
MELHOR_ENVIO_AMBIENTE=sandbox
MELHOR_ENVIO_TOKEN=...            # token de TESTE (sandbox)
CEP_ORIGEM=18000000              # CEP de onde saem os envios (so digitos)
FRETE_MANUSEIO_DIAS=1            # dias somados ao prazo da transportadora
FRETE_MAX_QTD=20                 # trava anti-abuso
# MELHOR_ENVIO_UA=Lojinha da Miih (contato@lojinhadamiih.com.br)
```

Recriar o container para aplicar:
`docker compose up -d --force-recreate`.

## Passo 6 - Ligar e testar no SANDBOX

1. Com `FRETE_ATIVO=true` e ambiente `sandbox`, ligue a calculadora no site:
   em `src/config/site.ts`, `frete.ativo = true` (e opcional `frete.cepOrigem`).
2. Publique. Na pagina de um produto vai aparecer "Calcular frete e prazo".
3. Digite um CEP e confira as opcoes dos Correios (PAC/SEDEX) com prazo/preco.
4. Teste tentar burlar: o navegador so manda o CEP; peso/medidas saem do banco.

## Passo 7 - Producao (depois de validar)

1. Gere o token de **producao** (no painel real melhorenvio.com.br).
2. No `.env`: `MELHOR_ENVIO_AMBIENTE=producao` e `MELHOR_ENVIO_TOKEN=<producao>`.
3. Recrie o container. Confira um calculo real.

## Checklist de seguranca

- [ ] `MELHOR_ENVIO_TOKEN` so no `.env` do servidor (nunca no repo/site).
- [ ] `CEP_ORIGEM` definido no servidor.
- [ ] Peso/dimensoes preenchidos nos produtos (ou padrao aceitavel).
- [ ] Testado no sandbox antes de producao.
- [ ] `FRETE_ATIVO=true` so quando for usar.
