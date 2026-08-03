// Migration ponctuelle : renumérote les fichiers generated/*.json existants
// après l'insertion de 4 nouvelles leçons dans curriculum.ts (2026-07-28).
// Usage : npx tsx scripts/renumber-generated.ts
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from "fs";
import { join } from "path";
import type { LessonSeed } from "../prisma/content/types";

const DIR = join(__dirname, "..", "prisma", "content", "generated");

// slug -> nouvel ordre (dérivé manuellement de l'ancien vs nouveau curriculum.ts)
const REMAP: Record<string, number> = {
  "comparer-avec-bi": 20,
  "l-experience-avec-guo": 21,
  "chez-le-medecin": 22,
  "vetements-et-couleurs": 23,
  "demander-son-chemin": 24,
  "prendre-le-train": 25,
  "au-telephone": 26,
  "en-train-de": 27,
  "inviter-et-refuser": 28,
  "la-duree": 29,
  "donner-et-offrir": 30,
  "decrire-quelqu-un": 31,
  "le-nouvel-an-chinois": 33,
  "bilan-a2": 35,
  "la-construction-ba": 36,
  "le-passif-bei": 37,
  "bien-que-mais": 38,
  "parce-que-donc": 39,
  "premiers-chengyu": 40,
  "donner-son-avis": 41,
  "raconter-une-histoire": 42,
  "si-jamais": 43,
  "capable-ou-pas": 44,
  "entretien-d-embauche": 45,
  "lire-les-titres": 46,
  "de-plus-en-plus": 47,
  "la-vie-numerique": 48,
  "bilan-b1": 50,
  "registres-de-langue": 51,
  "d-une-part-d-autre-part": 52,
  "conceder-et-refuter": 53,
  "chengyu-avances": 54,
  "lire-un-article": 55,
  "economie-et-societe": 56,
  "nuances-de-synonymes": 57,
  "humour-et-jeux-de-mots": 58,
  "ecrire-un-texte-argumente": 59,
  "bilan-b2": 60,
};

function main() {
  // PASSE 1 — tout charger EN MÉMOIRE et repérer les anciens chemins, avant
  // la moindre écriture. Indispensable : les nouveaux noms de fichiers
  // (lessonNEW.json) peuvent coïncider avec l'ancien nom d'une AUTRE leçon
  // pas encore traitée — écrire trop tôt écraserait son contenu source.
  const files = readdirSync(DIR).filter((f) => f.endsWith(".json"));
  const bySlug = new Map<string, { path: string; seed: LessonSeed }>();
  for (const f of files) {
    const path = join(DIR, f);
    const seed = JSON.parse(readFileSync(path, "utf-8")) as LessonSeed;
    bySlug.set(seed.slug, { path, seed });
  }

  const toWrite: { newPath: string; oldPath: string; seed: LessonSeed }[] = [];
  let skipped = 0;
  for (const [slug, newOrder] of Object.entries(REMAP)) {
    const found = bySlug.get(slug);
    if (!found) {
      console.log(`  ⚠ introuvable (pas encore généré ?) : ${slug}`);
      skipped++;
      continue;
    }
    const seed = { ...found.seed, order: newOrder };
    toWrite.push({
      newPath: join(DIR, `lesson${newOrder}.json`),
      oldPath: found.path,
      seed,
    });
  }

  // PASSE 2 — tout est en mémoire, on peut maintenant écrire sans risque.
  for (const { newPath, oldPath, seed } of toWrite) {
    writeFileSync(newPath, JSON.stringify(seed, null, 2), "utf-8");
    console.log(`  ${seed.slug} : → order ${seed.order} (${oldPath === newPath ? "même fichier" : `${oldPath} → ${newPath}`})`);
  }
  // Suppression des anciens fichiers devenus orphelins (nom différent du nouveau).
  const keepPaths = new Set(toWrite.map((w) => w.newPath));
  for (const { oldPath } of toWrite) {
    if (!keepPaths.has(oldPath)) unlinkSync(oldPath);
  }

  console.log(`\nTerminé : ${toWrite.length} renumérotés, ${skipped} introuvables.`);
}

main();
