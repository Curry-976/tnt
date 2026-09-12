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

## 3. Catalogue produits (Sanity)

```bash
npm ci
npx sanity@latest init
```

Cette commande est interactive : elle ouvre une page de connexion (crée un
compte Sanity gratuit si besoin), puis propose de créer un projet. Choisis
« Create new project », dataset `production`. À la fin elle affiche le
`project ID` — note-le pour l'étape suivante.

Le catalogue se gère ensuite depuis `https://<ton-domaine>/studio` (formulaire
d'ajout/édition/suppression de maillots, upload de photos).

## 4. Variables d'environnement

```bash
cp .env.example .env.local
nano .env.local   # remplir NEXT_PUBLIC_SANITY_PROJECT_ID, DATABASE_URL, AUTH_SECRET, STRIPE_*, NEXT_PUBLIC_SITE_URL
```

`NEXT_PUBLIC_SITE_URL` doit être l'URL publique finale (ex.
`https://torrownamtorrow.com`) — Stripe s'en sert pour les redirections
après paiement.

## 5. Base de données (une fois DATABASE_URL renseigné)

```bash
npm run db:push    # crée les tables dans Neon
```

## 6. Build

```bash
npm run build
```

`next start` (lancé à l'étape suivante) sert directement depuis ce dossier
`web/` — pas de copie manuelle de `public/`, des assets ou de `.env.local`,
contrairement à un build `standalone`.

## 7. Lancer le service (systemd)

Un unit file prêt à l'emploi est fourni dans `deploy/torrow-web.service` —
adapte le chemin (`WorkingDirectory` doit pointer vers `web/`) et le port
si besoin.

```bash
sudo cp deploy/torrow-web.service /etc/systemd/system/torrow-web.service
sudo nano /etc/systemd/system/torrow-web.service   # vérifier les chemins
sudo systemctl daemon-reload
sudo systemctl enable --now torrow-web
sudo systemctl status torrow-web
```

## 8. Reverse proxy + HTTPS

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/torrow-web
sudo nano /etc/nginx/sites-available/torrow-web   # remplacer le domaine
sudo ln -s /etc/nginx/sites-available/torrow-web /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d torrownamtorrow.com -d www.torrownamtorrow.com
```

## 9. Webhook Stripe

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
sudo systemctl restart torrow-web
```

`npm ci` ne re-télécharge rien si `package-lock.json` n'a pas changé
depuis la dernière fois : tu peux l'omettre la plupart du temps et
lancer juste `npm run build && sudo systemctl restart torrow-web`.

Ou, plus simple, en une seule commande depuis `web/` :

```bash
bash deploy/update.sh
```
