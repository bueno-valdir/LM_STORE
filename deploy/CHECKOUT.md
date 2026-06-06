# Checkout (Mercado Pago) - fundacao segura

> Status: **FUNDACAO/TRAVAS prontas, DESLIGADO por padrao.** Nada de dinheiro
> real ate testar no sandbox. Este documento e o passo a passo de ativacao.

As travas de seguranca ja estao no codigo:

1. **Preco recalculado no servidor** a partir do banco (`pb_hooks/lm_checkout.pb.js`).
   O navegador so manda `id` e `quantidade`; quem define o preco e o servidor.
2. **Pedidos gravados pelo servidor**; a colecao `pedidos` fica trancada para o publico.
3. **Chave secreta** (`MP_ACCESS_TOKEN`) so em variavel de ambiente no servidor.
4. **Confirmacao de pagamento** so via **webhook** + consulta na API do Mercado Pago.
5. **Flag liga/desliga** (`CHECKOUT_ATIVO`) + **sandbox** primeiro.

## Passo 1 - Criar a colecao `pedidos` no painel

No PocketBase (`painel...\_/`), crie a colecao **`pedidos`** (tipo Base) com os campos:

| Campo | Tipo | Observacao |
|---|---|---|
| `itens` | JSON | itens validados pelo servidor |
| `total` | Number | total calculado pelo servidor |
| `status` | Select | opcoes: `pendente`, `pago`, `cancelado`, `expirado` (max 1) |
| `cliente_nome` | Plain text | opcional |
| `cliente_contato` | Plain text | opcional |
| `mp_preference_id` | Plain text | id da preferencia do Mercado Pago |
| `mp_payment_id` | Plain text | id do pagamento confirmado |

**API rules (MUITO importante):** deixe **List, View, Create, Update e Delete
TODOS travados** (cadeado fechado / null). Quem grava os pedidos e o hook do
servidor (que roda como admin), entao o cliente nunca cria/altera pedido nem total.

## Passo 2 - Subir o hook do servidor

No VPS, coloque o arquivo `pb_hooks/lm_checkout.pb.js` (deste repositorio) em:

```
/docker/lmstore-pocketbase/pb_hooks/lm_checkout.pb.js
```

O `docker-compose` do PocketBase ja monta `/pb_hooks` (ver
`deploy/pocketbase-docker-compose.yml`). O PocketBase carrega os hooks ao subir.

## Passo 3 - Definir os segredos (somente no servidor)

Crie o arquivo `/docker/lmstore-pocketbase/.env` (NAO vai para o repositorio):

```
CHECKOUT_ATIVO=false
CHECKOUT_AMBIENTE=sandbox
CHECKOUT_MAX_QTD=20
MP_ACCESS_TOKEN=APP_USR-...   # credencial de TESTE do Mercado Pago
MP_WEBHOOK_SECRET=...         # segredo do webhook (painel do Mercado Pago)
SITE_PUBLIC_URL=https://lmstore.veraxlegalops.com.br
```

> A `MP_ACCESS_TOKEN` e SECRETA. Comece com a credencial de **TESTE** (sandbox).
> Recriar o container para aplicar: `docker compose up -d --force-recreate`.

## Passo 4 - Testar no SANDBOX (sem dinheiro real)

1. No `.env`, mantenha `CHECKOUT_AMBIENTE=sandbox` e use as credenciais de TESTE.
2. Coloque `CHECKOUT_ATIVO=true` apenas para testar.
3. Use os **cartoes de teste** do Mercado Pago para simular aprovado/recusado.
4. Confira: o pedido aparece em `pedidos` como `pendente` e vira `pago` apos o
   webhook. O total tem que bater com o preco do painel (teste tentar burlar o
   preco pelo navegador: tem que ser ignorado).

## Passo 5 - Ir para producao (so quando estiver redondo)

1. Troque para as credenciais de **producao** do Mercado Pago no `.env`.
2. `CHECKOUT_AMBIENTE=producao` e `CHECKOUT_ATIVO=true`.
3. No site, ligar `checkout.ativo = true` em `src/config/site.ts` e publicar.
4. Faca uma compra real de valor baixo para validar ponta a ponta.

## Checklist de seguranca (revisar antes do go-live)

- [ ] Colecao `pedidos` com TODAS as regras travadas.
- [ ] `MP_ACCESS_TOKEN` so no `.env` do servidor (nunca no repositorio/site).
- [ ] Webhook verificando assinatura (ver TODO no hook) e consultando a API.
- [ ] Preco/total sempre recalculados no servidor.
- [ ] Testado no sandbox (aprovado, recusado, e tentativa de burlar preco).
- [ ] HTTPS ativo (ja esta).
- [ ] 2FA ativo na conta do Mercado Pago e no painel.
