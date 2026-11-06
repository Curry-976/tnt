# Déploiement sur Netlify

Le site est hébergé sur **Netlify** (offre gratuite, usage commercial
autorisé). Netlify reconstruit et met en ligne le site **automatiquement à
chaque modification de la branche `main` sur GitHub** : il n'y a plus de
serveur à mettre à jour à la main.

La configuration de build est dans `netlify.toml`, à la racine du dépôt.
Netlify y lit que le site est dans `web/` et installe tout seul son
adaptateur Next.js.

Ce qui ne change pas : la base de données (Neon), le catalogue (Sanity), les
emails (boîte OVH en SMTP), SumUp, Brevo, AfterShip. Ce sont des services
externes, le site s'y connecte de la même façon.

## 1. Créer le site sur Netlify

1. Crée un compte sur https://app.netlify.com/signup en choisissant
   **« Sign up with GitHub »**.
2. **Add new project** → **Import an existing project** → **GitHub** →
   autorise Netlify puis choisis le dépôt `Curry-976/tnt`.
3. Netlify lit `netlify.toml` et pré-remplit les réglages (base `web`,
   commande `npm run build`). Ne change rien.
4. **Avant de cliquer sur Deploy**, ajoute les variables d'environnement
   (étape 2). Sinon le premier build échouera ou le site sera incomplet.

## 2. Variables d'environnement

Dans **Project configuration → Environment variables**, ajoute les mêmes
variables que dans `.env.local` (la liste et leur rôle sont dans
`.env.example`). Le plus simple : **Add a variable → Import from a .env
file**, puis colle le contenu de ton `.env.local`.

À vérifier en particulier :

- `NEXT_PUBLIC_SITE_URL=https://tnt-jersey.fr` et `AUTH_URL=https://tnt-jersey.fr`
  (sans `/` à la fin).
- `SUMUP_API_KEY` et `SUMUP_MERCHANT_CODE` : tes vraies valeurs.
- `DATABASE_URL`, `AUTH_SECRET`, `SMTP_*`, `NEXT_PUBLIC_SANITY_*`,
  `ADMIN_EMAILS`, et les variables optionnelles que tu utilises
  (Google/Apple, Brevo, AfterShip, Turnstile, Google Analytics).

Les variables `NEXT_PUBLIC_*` sont intégrées au moment du build : après en
avoir modifié une, relance un déploiement (**Deploys → Trigger deploy →
Deploy project**).

## 3. Premier déploiement et test

Lance le déploiement. Netlify donne une adresse du type
`https://<nom>.netlify.app`. Vérifie que les pages s'affichent.

Le paiement, la connexion Google et les liens dans les emails pointent vers
`NEXT_PUBLIC_SITE_URL` (`tnt-jersey.fr`), donc ils ne fonctionneront
vraiment qu'après l'étape 4.

## 4. Brancher le nom de domaine

1. Dans Netlify : **Domain management → Add a domain** → `tnt-jersey.fr`.
   Ajoute aussi `www.tnt-jersey.fr`. Netlify recommande de faire de `www` le
   domaine principal quand le DNS reste chez OVH.
2. Dans l'espace client OVH : **Noms de domaine → tnt-jersey.fr → Zone DNS** :
   - modifie l'enregistrement **A** de `tnt-jersey.fr` (celui qui pointe
     vers l'IP du VPS, `51.210.102.96`) pour qu'il pointe vers
     **`75.2.60.5`** (le répartiteur de charge de Netlify) ;
   - **supprime** l'enregistrement **AAAA** de `tnt-jersey.fr` s'il existe
     (adresse IPv6 du VPS) ;
   - pour `www`, mets un enregistrement **CNAME** vers
     **`<nom>.netlify.app.`** (l'adresse donnée par Netlify, avec le point
     final) et supprime l'ancien enregistrement A/AAAA de `www` s'il y en a un ;
   - **ne touche pas** aux enregistrements **MX**, **SPF/TXT** et
     **autoconfig** : ce sont ceux de ta boîte email OVH.
3. La propagation DNS prend de quelques minutes à 48 h. Netlify active
   ensuite le HTTPS (certificat Let's Encrypt) tout seul, dans
   **Domain management → HTTPS**.

## 5. Services à mettre à jour

- **Sanity** (https://www.sanity.io/manage → ton projet → API → CORS
  origins) : `https://tnt-jersey.fr` est déjà autorisé. Ajoute
  `https://www.tnt-jersey.fr` si `www` devient le domaine principal, et
  `https://<nom>.netlify.app` pour pouvoir utiliser `/studio` avant le
  branchement du domaine. Coche **Allow credentials** pour chacun.
- **Connexion Google** : si `www` devient le domaine principal, ajoute
  `https://www.tnt-jersey.fr/api/auth/callback/google` dans les URI de
  redirection autorisées de ton client OAuth, et mets `www` dans
  `NEXT_PUBLIC_SITE_URL` et `AUTH_URL`.
- **SumUp** : rien à faire. L'adresse de notification
  (`/api/webhooks/sumup`) est envoyée avec chaque paiement.

## 6. Arrêter le VPS

Une fois le site en ligne sur Netlify **et** une commande test réussie
(paiement, email de confirmation, commande visible dans `/admin/commandes`) :

1. Sauvegarde `.env.local` du VPS sur ton ordinateur (il contient tes clés).
2. Résilie le VPS dans l'espace client OVH.

Les commandes et les comptes clients sont dans Neon, pas sur le VPS : rien
n'est perdu en le résiliant.

## Mises à jour ultérieures

Il suffit que la modification arrive sur la branche `main` de GitHub (par
exemple en fusionnant une pull request) : Netlify redéploie tout seul en
deux à trois minutes. L'historique est dans **Deploys**. En cas de problème,
un clic sur un ancien déploiement puis **Publish deploy** remet la version
précédente en ligne.

## Base de données

Après une modification de `lib/db/schema.ts`, applique-la à Neon depuis ton
ordinateur, avec `DATABASE_URL` dans `web/.env.local` :

```bash
cd web
npm ci
npm run db:push
```

## Limites de l'offre gratuite

L'offre gratuite inclut un quota mensuel de « crédits » (trafic,
déploiements, exécutions de fonctions), largement suffisant pour une petite
boutique. Si le quota est dépassé, Netlify **met le site en pause** jusqu'au
mois suivant : surveille la consommation dans **Billing → Usage** les
premiers mois.
