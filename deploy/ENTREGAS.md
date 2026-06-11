# Entregas (SuperFrete) - calculo de frete

> Status: **FUNDACAO/TRAVAS prontas, DESLIGADO por padrao.** Calculadora na
> pagina do produto, so Correios (PAC/SEDEX/Mini Envios), comecando em
> **sandbox** (teste).

Travas de seguranca (ja no codigo):
1. **Token** do SuperFrete so no servidor (`SUPERFRETE_TOKEN`).
2. **Peso/dimensoes** vem do banco (produto), nunca do cliente.
3. **CEP de origem** vem do servidor (`CEP_ORIGEM`), nunca do cliente.
4. **Flag** `FRETE_ATIVO` (desligado por padrao) + **sandbox** primeiro.
5. So pede/retorna as opcoes dos **Correios**.

## Passo 1 - Criar a conta no SuperFrete (gratis)

1. Acesse **superfrete.com** e crie a conta da loja.
2. Confirme o e-mail e complete o cadastro (endereco de origem etc.).
3. O SuperFrete tem ambiente de **sandbox** (teste, sem valer dinheiro):
   `https://sandbox.superfrete.com`. Use-o para validar antes de producao.

## Passo 2 - Gerar o token

No painel do SuperFrete:
1. Va em **Integracoes / Token de API** (ou "Gerenciar tokens").
2. Gere um token para **uso em sandbox** (teste). Esse e o `SUPERFRETE_TOKEN`.
3. Copie o token (texto longo) e guarde com cuidado - e secreto, nunca colar
   no site nem no repositorio.

> Depois, ao ir para producao, voce gera um token de **producao** e troca.

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
SUPERFRETE_AMBIENTE=sandbox
SUPERFRETE_TOKEN=...             # token de TESTE (sandbox)
CEP_ORIGEM=18000000              # CEP de onde saem os envios (so digitos)
FRETE_MANUSEIO_DIAS=1            # dias somados ao prazo dos Correios
FRETE_MAX_QTD=20                 # trava anti-abuso
# SUPERFRETE_UA=Lojinha da Miih (contato@lojinhadamiih.com.br)
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

1. Gere o token de **producao** no painel do SuperFrete.
2. No `.env`: `SUPERFRETE_AMBIENTE=producao` e `SUPERFRETE_TOKEN=<producao>`.
3. Recrie o container. Confira um calculo real.

## Checklist de seguranca

- [ ] `SUPERFRETE_TOKEN` so no `.env` do servidor (nunca no repo/site).
- [ ] `CEP_ORIGEM` definido no servidor.
- [ ] Peso/dimensoes preenchidos nos produtos (ou padrao aceitavel).
- [ ] Testado no sandbox antes de producao.
- [ ] `FRETE_ATIVO=true` so quando for usar.

---

## Por que SuperFrete (e nao Melhor Envio)?

Ambos sao agregadores e oferecem os mesmos Correios. Escolhemos o SuperFrete
por ter reputacao melhor entre lojas pequenas/Instagram. O codigo foi feito
para ser facil de trocar: toda a integracao fica no hook `lm_frete.pb.js` (a
calculadora no site nao muda). Se um dia quiser trocar de fornecedor de novo,
mexe-se so nesse arquivo.
