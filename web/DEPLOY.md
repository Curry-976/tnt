# Déploiement sur le VPS

Ce guide suppose un VPS Debian/Ubuntu classique, avec accès root ou sudo.
Adapte les chemins (`/var/www/torrow-web`) et le nom de domaine à ta config.

## 1. Prérequis sur le VPS

```bash
# Node.js 22 LTS (adapter si le VPS a déjà une version récente)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs nginx certbot python3-certbot-nginx git
```

## 2. Récupérer le code

```bash
sudo mkdir -p /var/www/torrow-web
sudo chown $USER:$USER /var/www/torrow-web
git clone <url-du-repo> /var/www/torrow-web
cd /var/www/torrow-web/web
```

## 3. Variables d'environnement

```bash
cp .env.example .env.local
nano .env.local   # remplir DATABASE_URL, AUTH_SECRET, STRIPE_*, NEXT_PUBLIC_SITE_URL
```

`NEXT_PUBLIC_SITE_URL` doit être l'URL publique finale (ex.
`https://torrownamtorrow.com`) — Stripe s'en sert pour les redirections
après paiement.

## 4. Base de données (une fois DATABASE_URL renseigné)

```bash
npm ci
npm run db:push    # crée les tables dans Neon
npm run db:seed    # insère le catalogue des 6 maillots
```

## 5. Build

```bash
npm run build
```

Avec `output: "standalone"` (déjà configuré dans `next.config.ts`), le
build produit un serveur autonome dans `.next/standalone/`. Les assets
statiques ne sont pas copiés automatiquement dedans, il faut les ajouter :

```bash
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
cp .env.local .next/standalone/
```

Le dossier `.next/standalone/` est alors tout ce qu'il faut pour lancer le
site : `node server.js` dedans écoute sur le port `3000` par défaut.

## 6. Lancer le service (systemd)

Un unit file prêt à l'emploi est fourni dans `deploy/torrow-web.service` —
il suppose que le build final vit dans `/var/www/torrow-web` (adapte-le
si tu gardes le build dans `.next/standalone/` à un autre endroit ; le
plus simple est de faire de `.next/standalone/` le `WorkingDirectory`).

```bash
sudo cp deploy/torrow-web.service /etc/systemd/system/torrow-web.service
sudo nano /etc/systemd/system/torrow-web.service   # vérifier les chemins
sudo systemctl daemon-reload
sudo systemctl enable --now torrow-web
sudo systemctl status torrow-web
```

## 7. Reverse proxy + HTTPS

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/torrow-web
sudo nano /etc/nginx/sites-available/torrow-web   # remplacer le domaine
sudo ln -s /etc/nginx/sites-available/torrow-web /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d torrownamtorrow.com -d www.torrownamtorrow.com
```

## 8. Webhook Stripe

Dans le dashboard Stripe (mode Live une fois prêt), crée un endpoint
webhook pointant vers `https://<ton-domaine>/api/webhooks/stripe`, événement
`checkout.session.completed`. Copie le secret de signature dans
`STRIPE_WEBHOOK_SECRET` sur le VPS, puis redémarre le service :

```bash
sudo systemctl restart torrow-web
```

## Mises à jour ultérieures

```bash
cd /var/www/torrow-web && git pull
cd web && npm ci && npm run build
cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
sudo systemctl restart torrow-web
```
