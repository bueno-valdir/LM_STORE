# Checkout (Stripe) + Frete (Melhor Envio)

> Status: **ESTRUTURA pronta, DESLIGADO por padrao** (`checkout.ativo = false`).
> Nada de dinheiro real ate testar no sandbox. Este doc e o passo a passo.

Arquitetura: o site (navegador) tem **carrinho** (localStorage) e chama o nosso
**servidor** (PocketBase hooks) para calcular frete e criar o pagamento. As
chaves secretas ficam SO no servidor. Travas em `pb_hooks/lm_checkout.pb.js`:

1. Preco recalculado no servidor pelo banco (nunca confia no navegador).
2. Pedido/total gravados pelo servidor (colecao `pedidos` trancada).
3. Chaves secretas so em variavel de ambiente.
4. Pagamento so vira "pago" via webhook do Stripe (com verificacao de assinatura).
5. So funciona com `CHECKOUT_ATIVO=true` (sandbox primeiro).

## Passo 1 - Colecoes no painel

### `pedidos`
| Campo | Tipo | Observacao |
|---|---|---|
| `itens` | JSON | itens validados pelo servidor |
| `total` | Number | total (produtos + frete) |
| `frete` | JSON | { nome, preco } |
| `status` | Select | `pendente`, `pago`, `cancelado`, `expirado` |
| `cliente_nome` | Plain text | opcional |
| `cliente_contato` | Plain text | opcional |
| `stripe_session_id` | Plain text | id da sessao do Stripe |
| `stripe_payment_intent` | Plain text | id do pagamento confirmado |

**API rules:** List/View/Create/Update/Delete **TODOS travados**. Quem grava e o
hook (roda como admin); o cliente nunca cria/altera pedido.

### Campos de frete na colecao `produtos` (opcionais)
Adicione na colecao `produtos` (se nao tiver, usa o padrao de `src/config/site.ts`):
| Campo | Tipo | Ex. |
|---|---|---|
| `peso` | Number | 0.3 (kg) |
| `altura` | Number | 10 (cm) |
| `largura` | Number | 15 (cm) |
| `comprimento` | Number | 20 (cm) |

## Passo 2 - Hook no servidor
Copie `pb_hooks/lm_checkout.pb.js` (deste repo) para
`/docker/lmstore-pocketbase/pb_hooks/lm_checkout.pb.js` no VPS. O compose ja
monta `/pb_hooks`. Recrie o container: `docker compose up -d --force-recreate`.

## Passo 3 - Variaveis de ambiente (so no servidor)
No `.env` em `/docker/lmstore-pocketbase/.env` (NAO vai pro repo):
```
CHECKOUT_ATIVO=false
CHECKOUT_AMBIENTE=sandbox
CHECKOUT_MAX_QTD=20
SITE_PUBLIC_URL=https://lojinhadamiih.com.br
CEP_ORIGEM=18000000
CONTATO_EMAIL=contato.lojinhadamiih@gmail.com
# Stripe (TESTE primeiro: sk_test_... / whsec_...)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
# Melhor Envio (token de sandbox)
MELHOR_ENVIO_TOKEN=
```

## Passo 4 - Webhook no Stripe
No painel do Stripe (modo teste): Developers > Webhooks > Add endpoint:
- URL: `https://painel.lmstore.veraxlegalops.com.br/lm/stripe-webhook`
- Evento: `checkout.session.completed`
- Copie o **Signing secret** (`whsec_...`) para `STRIPE_WEBHOOK_SECRET`.

## Passo 5 - Testar no SANDBOX
1. `CHECKOUT_ATIVO=true`, ambiente `sandbox`, credenciais de teste.
2. No site, ligar `checkout.ativo = true` em `src/config/site.ts`.
3. Adicionar produto ao carrinho, calcular frete (CEP de teste), finalizar.
4. Usar cartao de teste do Stripe (ex.: 4242 4242 4242 4242) e testar Pix de teste.
5. Conferir: o pedido vira `pago` so depois do webhook. Tentar burlar preco/qtd
   pelo navegador: tem que ser ignorado (servidor recalcula).

## Passo 6 - Producao
1. Trocar credenciais por producao (Stripe live + Melhor Envio producao, conta da loja).
2. `CHECKOUT_AMBIENTE=producao`, `CHECKOUT_ATIVO=true`.
3. `checkout.ativo = true` no site, publicar.
4. Webhook de producao no Stripe (mesma URL, chave live).
5. Compra real de valor baixo pra validar ponta a ponta.

## Pendencias de UI (fazer ao ligar, amanha)
- Botao **"Adicionar ao carrinho"** na pagina do produto (`/produto`).
- **Contador do carrinho** no header (ouve o evento `carrinho:mudou`).
- Paginas `/pedido-confirmado` (sucesso) e ajustes visuais do carrinho.
- Implementar a **verificacao de assinatura** do webhook (TODO no hook).

## Checklist de seguranca
- [ ] `pedidos` com TODAS as regras travadas.
- [ ] `STRIPE_SECRET_KEY` e `MELHOR_ENVIO_TOKEN` so no `.env` do servidor.
- [ ] Webhook do Stripe com assinatura verificada.
- [ ] Preco/total recalculados no servidor.
- [ ] Testado no sandbox (aprovado, recusado, tentativa de burlar preco).
- [ ] 2FA na conta Stripe e no painel.
