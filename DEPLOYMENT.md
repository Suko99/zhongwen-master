# Déploiement — Vercel + Neon (Postgres)

Guide pour mettre Zhongwen Master **en ligne** sur une URL publique.
Cible : **Vercel** (hébergement Next.js) + **Neon** (Postgres gratuit), la
direction prévue par le PRD §8.

> Le dev local reste sur SQLite tant que vous n'appliquez pas l'étape 1.
> Ces étapes ne se font qu'au moment de déployer.

---

## Vue d'ensemble

| Élément | Local (actuel) | Production |
|---|---|---|
| Base | SQLite (`prisma/dev.db`) | Postgres (Neon) |
| Hébergement | `npm run dev` | Vercel |
| Secrets | `.env.local` | Variables d'env Vercel |
| Accès | localhost, ouvert | URL publique, protégée par `APP_PASSWORD` |

---

## Étape 1 — Passer le schéma en Postgres

Dans [`prisma/schema.prisma`](prisma/schema.prisma), remplacez le bloc
`datasource` :

```prisma
datasource db {
  provider = "postgresql"          // était "sqlite"
  url      = env("DATABASE_URL")   // était "file:./dev.db"
}
```

Le reste du schéma est **déjà compatible Postgres** (types standards, `cuid()`,
index — aucun autre changement). Le projet utilise `prisma db push` (pas de
fichiers de migration), donc le changement de provider est indolore.

> Pour continuer à développer en local sur Postgres aussi, mettez l'URL Neon
> (voir étape 2) dans `.env.local` sous `DATABASE_URL=...`. Sinon, gardez une
> copie du schéma en `sqlite` pour le local.

## Étape 2 — Créer la base Neon

1. Créez un compte sur [neon.tech](https://neon.tech) (gratuit).
2. Nouveau projet → copiez la **connection string** (format
   `postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require`).
3. Gardez-la : c'est votre `DATABASE_URL`.

## Étape 3 — Initialiser la base de production

Depuis votre machine, en pointant temporairement sur Neon :

```bash
# PowerShell
$env:DATABASE_URL="postgresql://…votre URL Neon…"
npx prisma db push        # crée les 6 tables dans Neon
npm run db:seed           # charge tout le contenu (leçons, hanzi, vocabulaire)
```

## Étape 4 — Pousser le code sur GitHub

```bash
git init
git add .
git commit -m "Zhongwen Master"
# créez un dépôt sur github.com puis :
git remote add origin https://github.com/VOUS/zhongwen-master.git
git push -u origin main
```

> `.env.local` et `prisma/*.db` sont déjà exclus par `.gitignore` — aucun
> secret ni base locale ne partent sur GitHub.

## Étape 5 — Déployer sur Vercel

1. Compte sur [vercel.com](https://vercel.com), **Import** du dépôt GitHub.
2. Framework détecté : Next.js (rien à configurer, `postinstall` génère le
   client Prisma automatiquement).
3. **Environment Variables** — ajoutez :

   | Variable | Valeur |
   |---|---|
   | `DATABASE_URL` | votre connection string Neon |
   | `MISTRAL_API_KEY` | votre clé Mistral |
   | `APP_PASSWORD` | un mot de passe de votre choix (protège l'accès) |
   | `MISTRAL_MODEL` | *(optionnel)* `mistral-large-latest` |

4. **Deploy**. Au bout d'une minute, vous avez une URL publique.

## Étape 6 — Vérifier

- Ouvrez l'URL : le navigateur demande un mot de passe (Basic Auth) → entrez
  `APP_PASSWORD` (utilisateur : n'importe quoi).
- Dashboard, leçons, révisions, graphe, Professeur IA doivent fonctionner.

---

## Notes

- **Sécurité** : `APP_PASSWORD` active un portail Basic Auth
  ([`src/proxy.ts`](src/proxy.ts)). Sans cette variable, l'app est **ouverte** —
  ne déployez jamais sans la définir.
- **Régénérer/mettre à jour le contenu** : relancez `npm run db:seed` avec
  `DATABASE_URL` pointant sur Neon (le seed fait des upserts, il est ré-exécutable).
- **Générer de nouvelles leçons** : les scripts `scripts/generate-*.ts`
  produisent des JSON en local ; commitez-les puis re-seedez Neon.
- **Coûts** : Neon et Vercel ont des offres gratuites largement suffisantes pour
  un seul utilisateur. Seul Mistral est facturé à l'usage (quelques centimes).
- **Migration inverse** : pour revenir en local SQLite, remettez le `datasource`
  en `provider = "sqlite"` / `url = "file:./dev.db"`.
