// Extraction du ton (1-4, ou 5 = neutre) à partir d'une syllabe pinyin
// avec diacritique, ex. "hǎo" → 3, "ma" → 5 (neutre, pas de marque).
// Volontairement limité à UNE syllabe : au-delà (mots de plusieurs
// caractères), la segmentation audio devient trop incertaine pour un
// scoring maison fiable (voir Labo vocal, PRD §7 — limite assumée).

const TONE_MARKS: Record<string, number> = {
  ā: 1, á: 2, ǎ: 3, à: 4,
  ē: 1, é: 2, ě: 3, è: 4,
  ī: 1, í: 2, ǐ: 3, ì: 4,
  ō: 1, ó: 2, ǒ: 3, ò: 4,
  ū: 1, ú: 2, ǔ: 3, ù: 4,
  ǖ: 1, ǘ: 2, ǚ: 3, ǜ: 4,
  ń: 2, ň: 3, ǹ: 4, // syllabes rares en 'n' seul (interjections)
};

export type Tone = 1 | 2 | 3 | 4 | 5;

export function toneOfSyllable(pinyin: string): Tone {
  const firstSyllable = pinyin.trim().split(/\s+/)[0].toLowerCase();
  for (const ch of firstSyllable) {
    if (ch in TONE_MARKS) return TONE_MARKS[ch] as Tone;
  }
  return 5; // aucune marque trouvée : ton neutre
}

export const TONE_LABELS: Record<Tone, string> = {
  1: "1er ton (plat, haut)",
  2: "2e ton (montant)",
  3: "3e ton (descendant-montant)",
  4: "4e ton (descendant, net)",
  5: "ton neutre (bref, léger)",
};

export const TONE_SHAPE_DESCRIPTION: Record<Tone, string> = {
  1: "une ligne haute et stable, sans monter ni descendre",
  2: "une montée nette du grave vers l'aigu",
  3: "une descente suivie d'une remontée (comme un creux)",
  4: "une chute nette de l'aigu vers le grave",
  5: "un son bref et léger, sans contour marqué",
};
