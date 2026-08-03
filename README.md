# 中文 Zhongwen Master

> *Don't learn Chinese. Learn to think in Chinese.*

Application d'apprentissage du mandarin pour un seul utilisateur, fondée sur un
**réseau de connaissances interconnectées** (le Graphe Cognitif) plutôt que sur
des leçons linéaires. L'IA n'y est pas un chatbot mais un ensemble de rôles
pédagogiques (Professeur, Correcteur, Générateur) pilotés par un seul LLM.

Implémentation de référence du [PRD v2](../zhongwen-master-prd-v2.md).

## Stack

| Couche | Choix | Note |
|---|---|---|
| Frontend + backend | **Next.js 16** (App Router, Server Actions) | monolithe modulaire |
| Langage | **TypeScript** | |
| Base de données | **SQLite via Prisma** | migration PostgreSQL triviale (voir PRD §8) |
| Répétition espacée | **ts-fsrs** | implémentation officielle de FSRS |
| LLM | **Mistral AI** | un modèle, plusieurs system prompts |
| Audio | **Web Speech API** | synthèse vocale du navigateur, gratuite (Phase 5 : Piper/Whisper) |

> Déviation assumée du PRD (qui prévoyait FastAPI + PostgreSQL) : tout-TypeScript
> + SQLite pour un MVP sans dépendance système. Python ne redevient nécessaire
> qu'à la Phase 5 (scoring tonal).

## Démarrage

```bash
npm install
npx prisma db push      # crée la base SQLite + le client
npm run db:seed         # charge le contenu (leçons, hanzi, vocabulaire)
npm run dev             # http://localhost:3000
```

### Activer l'IA (Professeur, Correcteur, Générateur)

```bash
cp .env.local.example .env.local
```

Puis renseignez votre clé dans `.env.local` :

```
MISTRAL_API_KEY=votre_clé   # https://console.mistral.ai → API Keys
# MISTRAL_MODEL=mistral-large-latest   # optionnel (défaut : mistral-small-latest)
```

Relancez `npm run dev`. Sans clé, les écrans IA affichent un message explicatif
au lieu de planter.

## Fonctionnalités

- **Dashboard** — une seule priorité du jour (réviser ou continuer le parcours),
  objectif du jour en XP, série 🔥 (gamification légère, sans mécanique punitive).
- **Parcours de leçons** en 6 étapes (Mission → Découverte → Déconstruction →
  Connexion → Production → Consolidation), avec observation avant traduction et
  Hanzi cliquables partout.
- **Révision espacée** FSRS : chaque rating replanifie la carte et archive
  l'historique (chaque erreur est une donnée).
- **Fiches Hanzi** : composition, étymologie prudente, famille de mots, maîtrise
  à 4 dimensions (reconnaissance / compréhension / production / automatisation).
- **Professeur IA** (`/professeur`) : réponses structurées ancrées sur le
  vocabulaire déjà acquis.
- **Correcteur IA** (étape Production) : score, correction, erreurs typées
  (ciblage des interférences françaises).
- **Graphe Cognitif** (`/graphe`) : constellation des connaissances, nœuds
  colorés selon la maîtrise, cliquables.
- **Audio** : bouton 🔊 sur les dialogues, cartes de révision et fiches (voix
  zh-CN du système).

## Contenu et Générateur de leçons

Le curriculum complet **A1 → B2** (56 leçons) est planifié dans
[`prisma/content/curriculum.ts`](prisma/content/curriculum.ts), aligné sur la
progression du PRD §2.

- Leçons 1–5 : **rédigées à la main** (`prisma/content/lessonN.ts`).
- Leçons 6+ : **générées par le rôle Générateur** puis relues, stockées en JSON
  dans `prisma/content/generated/`.

```bash
# Générer la prochaine leçon manquante (ou un ordre précis)
npx tsx scripts/generate-lesson.ts        # prochaine
npx tsx scripts/generate-lesson.ts 12     # leçon 12

# Générer un intervalle complet en une passe
npx tsx scripts/generate-all.ts 7 56
```

Le générateur injecte tout le vocabulaire déjà introduit comme **contrainte
fermée**, valide automatiquement la sortie (caractères hors vocabulaire, doublons,
cohérence des tableaux de révision) et **s'auto-corrige** en renvoyant ses propres
avertissements au modèle (jusqu'à 2 passes). Les leçons générées restent à relire
avant d'être considérées comme définitives.

Après génération : `npm run db:seed` recharge tout (rédigées + générées).

## Scripts utilitaires

| Commande | Effet |
|---|---|
| `npm run db:seed` | (re)charge tout le contenu en base |
| `npx tsx scripts/check-db.ts` | inspecte l'état FSRS et l'historique |
| `npx tsx scripts/reset-progress.ts` | remet la progression à zéro (garde le contenu) |
| `npx tsx scripts/generate-lesson.ts [n]` | génère une leçon |
| `npx tsx scripts/generate-all.ts [a] [b]` | génère un intervalle de leçons |

## État par rapport au PRD

| Phase | État |
|---|---|
| 1 — Fondation pédagogique | ✅ 5 leçons manuelles + curriculum A1→B2 + générateur |
| 2 — MVP technique | ✅ 6 tables, FSRS, dashboard, parcours jouable |
| 3 — Professeur IA texte | ✅ Professeur + Correcteur (Mistral) |
| 4 — Graphe cognitif | ✅ visualisation constellation (données issues des leçons) |
| 5 — Audio | 🟡 v0 via Web Speech API (TTS) ; scoring tonal à venir |
| 6 — Immersion | ⬜ Smart Reader, etc. |

## Architecture

```
src/
  app/
    page.tsx              Dashboard
    lesson/[slug]/        Lecteur de leçon (6 étapes) + Correcteur IA
    review/               Session de révision FSRS
    hanzi/[char]/         Fiche Hanzi
    professeur/           Professeur IA
    graphe/               Graphe Cognitif
    actions.ts            Server Actions (leçon, révision)
    ai-actions.ts         Server Actions IA (enveloppe erreurs)
  lib/
    db.ts  user.ts        Prisma + utilisateur unique
    srs.ts                FSRS (createEmptyCard, next, scoring)
    ai.ts                 Client Mistral + prompts des rôles
    gamification.ts       XP / série / objectif (calculés, non stockés)
    graph.ts              Extraction du graphe depuis les leçons
    types.ts              Types du contenu de leçon
  components/
    HanziText, SpeakButton, StreakBadge
prisma/
  schema.prisma           6 tables
  seed.ts                 seed hybride (rédigées + générées)
  content/                curriculum + leçons + leçons générées
scripts/                  génération, inspection, reset
```
