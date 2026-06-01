#!/usr/bin/env bash
#
# Configura o nginx no VPS (Ubuntu/Debian) para servir a Lojinha da Miih.
# Rode UMA VEZ no VPS, como root:
#
#   bash setup-vps.sh
#
# O que faz:
#   - instala nginx (e certbot, para HTTPS depois)
#   - cria a pasta do site (/var/www/lmstore)
#   - escreve a configuracao do site e a ativa
#   - recarrega o nginx (servindo em HTTP)
#
# Depois disto: aponte o DNS, rode o primeiro deploy e ative o HTTPS com:
#   certbot --nginx -d lmstore.veraxlegalops.com.br
#
# Observacao: este script assume um VPS Ubuntu/Debian "puro" (sem painel tipo
# CyberPanel/hPanel). Se voce usa um painel de controle, os passos sao outros,
# avise que eu te oriento.

set -euo pipefail

DOMAIN="lmstore.veraxlegalops.com.br"
WEBROOT="/var/www/lmstore"

if [ "$(id -u)" -ne 0 ]; then
  echo "Rode como root (use: sudo bash setup-vps.sh)"; exit 1
fi

echo ">> Instalando nginx e certbot..."
apt-get update
apt-get install -y nginx certbot python3-certbot-nginx rsync

echo ">> Criando a pasta do site em $WEBROOT..."
mkdir -p "$WEBROOT"
# Pagina temporaria ate o primeiro deploy.
if [ ! -f "$WEBROOT/index.html" ]; then
  echo "<h1>Lojinha da Miih</h1><p>Site em configuracao.</p>" > "$WEBROOT/index.html"
fi
chown -R www-data:www-data "$WEBROOT"

echo ">> Escrevendo a configuracao do nginx..."
cat > /etc/nginx/sites-available/lmstore.conf <<NGINX
server {
    listen 80;
    listen [::]:80;

    server_name $DOMAIN;

    root $WEBROOT;
    index index.html;

    location / {
        try_files \$uri \$uri/ \$uri.html =404;
    }

    location /_astro/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/css application/javascript image/svg+xml application/xml;
}
NGINX

echo ">> Ativando o site..."
ln -sf /etc/nginx/sites-available/lmstore.conf /etc/nginx/sites-enabled/lmstore.conf
# Remove o site padrao do nginx, se existir, para nao conflitar.
rm -f /etc/nginx/sites-enabled/default

echo ">> Testando e recarregando o nginx..."
nginx -t
systemctl reload nginx

echo ""
echo "Pronto! O nginx esta servindo $WEBROOT em HTTP para $DOMAIN."
echo "Proximos passos:"
echo "  1) Aponte o DNS de $DOMAIN para o IP deste VPS (registro A)."
echo "  2) Cadastre os secrets no GitHub e ligue DEPLOY_ENABLED=true."
echo "  3) Apos o primeiro deploy e o DNS propagar, ative o HTTPS:"
echo "     certbot --nginx -d $DOMAIN"
