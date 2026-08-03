import type { LessonSeed } from "./types";

// Leçon 5 — Où ? Pays et nationalités
export const lesson5: LessonSeed = {
  slug: "pays-et-nationalites",
  title: "Où ? Pays et nationalités",
  mission: "Dire d'où l'on vient et où l'on se trouve",
  level: "A1",
  order: 5,
  hanzi: [
    {
      character: "在",
      pinyin: "zài",
      meaning: "être à, se trouver",
      hskLevel: 1,
      radical: "土",
      components: ["才", "土"],
      etymology:
        "土 (la terre) + 才 (phonétique) : l'interprétation traditionnelle y voit une pousse présente dans le sol — exister quelque part. Le verbe de localisation.",
      family: ["现在"],
      commonErrors: [
        "Ajouter 是 : « 我是在家 » est incorrect pour dire « je suis à la maison » — 在 est déjà le verbe",
      ],
    },
    {
      character: "哪",
      pinyin: "nǎ",
      meaning: "quel, où (interrogatif)",
      hskLevel: 1,
      radical: "口",
      components: ["口", "那"],
      etymology:
        "口 (radical des particules orales) + 那 (nà, phonétique) : la version interrogative de 那. Le ton fait tout : nǎ demande, nà désigne.",
      family: ["哪儿", "哪国"],
      commonErrors: ["Confondre 哪 nǎ (3e ton, question) et 那 nà (4e ton, « ce...là »)"],
    },
    {
      character: "儿",
      pinyin: "ér",
      meaning: "enfant ; suffixe -r",
      hskLevel: 1,
      radical: "儿",
      components: ["儿"],
      etymology:
        "Forme simplifiée de 兒 : un enfant, dont la forme ancienne montrait la fontanelle ouverte. Sert aussi de suffixe rétroflexe typique du nord de la Chine (哪儿, 这儿).",
      family: ["哪儿", "这儿", "儿子"],
      commonErrors: ["En suffixe, 儿 ne se prononce pas ér : il colore la syllabe précédente en -r"],
    },
    {
      character: "这",
      pinyin: "zhè",
      meaning: "ce, ceci (proche)",
      hskLevel: 1,
      radical: "辶",
      components: ["辶", "文"],
      etymology:
        "Forme simplifiée de 這 : 辶 (la marche) + composant phonétique. Ce vers quoi on peut marcher : le proche.",
      family: ["这儿", "这个"],
      commonErrors: [],
    },
    {
      character: "那",
      pinyin: "nà",
      meaning: "ce, cela (lointain)",
      hskLevel: 1,
      radical: "阝",
      components: ["那", "阝"],
      etymology:
        "À l'origine le nom d'un lieu lointain de l'ouest ; devenu le démonstratif du lointain, par opposition à 这.",
      family: ["那儿", "那个"],
      commonErrors: ["C'est la base de 哪 : ajouter 口 transforme « là » en « où ? »"],
    },
    {
      character: "中",
      pinyin: "zhōng",
      meaning: "milieu, centre",
      hskLevel: 1,
      radical: "丨",
      components: ["口", "丨"],
      etymology:
        "Un trait vertical qui traverse un cadre en son centre — l'interprétation traditionnelle y voit un étendard planté au milieu du camp. 中国 : le « Pays du Milieu ».",
      family: ["中国", "中文"],
      commonErrors: [],
    },
    {
      character: "国",
      pinyin: "guó",
      meaning: "pays, royaume",
      hskLevel: 1,
      radical: "囗",
      components: ["囗", "玉"],
      etymology:
        "Forme simplifiée de 國 : le jade 玉 (symbole du souverain) dans une enceinte 囗 — le royaume dans ses murailles.",
      family: ["中国", "法国", "国家"],
      commonErrors: ["Confusion visuelle avec 四 et 回 (même enceinte 囗, intérieurs différents)"],
    },
    {
      character: "法",
      pinyin: "fǎ",
      meaning: "loi, méthode ; France (phonétique)",
      hskLevel: 2,
      radical: "氵",
      components: ["氵", "去"],
      etymology:
        "氵 (eau) + 去 (aller) : l'interprétation traditionnelle y voit la loi qui doit couler, égale, comme l'eau. Dans 法国, purement phonétique : fǎ pour « France ».",
      family: ["法国", "法语"],
      commonErrors: [],
    },
    {
      character: "人",
      pinyin: "rén",
      meaning: "personne, être humain",
      hskLevel: 1,
      radical: "人",
      components: ["人"],
      etymology:
        "Pictogramme d'une silhouette humaine qui marche, vue de profil. Devient 亻 comme radical — vous le connaissez depuis 你 et 他.",
      family: ["中国人", "法国人", "人口"],
      commonErrors: ["Confusion visuelle avec 八 (les traits de 人 se touchent au sommet)"],
    },
  ],
  vocabulary: [
    {
      word: "在",
      pinyin: "zài",
      meaning: "être à, se trouver à",
      exampleZh: "我在家。",
      examplePinyin: "Wǒ zài jiā.",
      exampleFr: "Je suis à la maison.",
    },
    {
      word: "哪儿",
      pinyin: "nǎr",
      meaning: "où ?",
      exampleZh: "你在哪儿？",
      examplePinyin: "Nǐ zài nǎr?",
      exampleFr: "Où es-tu ?",
    },
    {
      word: "这儿",
      pinyin: "zhèr",
      meaning: "ici",
      exampleZh: "我在这儿。",
      examplePinyin: "Wǒ zài zhèr.",
      exampleFr: "Je suis ici.",
    },
    {
      word: "那儿",
      pinyin: "nàr",
      meaning: "là-bas",
      exampleZh: "他在那儿。",
      examplePinyin: "Tā zài nàr.",
      exampleFr: "Il est là-bas.",
    },
    {
      word: "中国",
      pinyin: "Zhōngguó",
      meaning: "Chine",
      exampleZh: "他在中国。",
      examplePinyin: "Tā zài Zhōngguó.",
      exampleFr: "Il est en Chine.",
    },
    {
      word: "法国",
      pinyin: "Fǎguó",
      meaning: "France",
      exampleZh: "我家在法国。",
      examplePinyin: "Wǒ jiā zài Fǎguó.",
      exampleFr: "Ma maison est en France.",
    },
    {
      word: "人",
      pinyin: "rén",
      meaning: "personne",
      exampleZh: "我家有四口人。",
      examplePinyin: "Wǒ jiā yǒu sì kǒu rén.",
      exampleFr: "Nous sommes quatre dans ma famille.",
    },
    {
      word: "中国人",
      pinyin: "Zhōngguó rén",
      meaning: "Chinois(e) (personne)",
      exampleZh: "他是中国人。",
      examplePinyin: "Tā shì Zhōngguó rén.",
      exampleFr: "Il est chinois.",
    },
    {
      word: "法国人",
      pinyin: "Fǎguó rén",
      meaning: "Français(e) (personne)",
      exampleZh: "我是法国人。",
      examplePinyin: "Wǒ shì Fǎguó rén.",
      exampleFr: "Je suis français(e).",
    },
  ],
  content: {
    mission: {
      scenario:
        "On vous demande d'où vous venez — moment inévitable de toute rencontre. Vous devez dire votre nationalité, demander celle de l'autre, et situer les gens et les lieux.",
      goals: [
        "Dire sa nationalité : pays + 人",
        "Localiser avec 在 (sans 是 !)",
        "Demander « où » avec 哪儿, « quel pays » avec 哪国",
        "Opposer 这 (proche) et 那 (lointain)",
      ],
    },
    discovery: {
      instructions:
        "Lisez sans les traductions. Observez : comment construit-on « français » à partir de « France » ? Y a-t-il un 是 dans les phrases avec 在 ?",
      dialogue: [
        {
          speaker: "A",
          chinese: "你是哪国人？",
          pinyin: "Nǐ shì nǎ guó rén?",
          translation: "De quel pays viens-tu ?",
        },
        {
          speaker: "B",
          chinese: "我是法国人。你呢？",
          pinyin: "Wǒ shì Fǎguó rén. Nǐ ne?",
          translation: "Je suis français. Et toi ?",
        },
        {
          speaker: "A",
          chinese: "我是中国人。你家在哪儿？",
          pinyin: "Wǒ shì Zhōngguó rén. Nǐ jiā zài nǎr?",
          translation: "Je suis chinois. Où habite ta famille ?",
        },
        {
          speaker: "B",
          chinese: "我家在法国。我爸爸妈妈在那儿。",
          pinyin: "Wǒ jiā zài Fǎguó. Wǒ bàba māma zài nàr.",
          translation: "Ma famille est en France. Mes parents sont là-bas.",
        },
        {
          speaker: "A",
          chinese: "你哥哥也在法国吗？",
          pinyin: "Nǐ gēge yě zài Fǎguó ma?",
          translation: "Ton grand frère est aussi en France ?",
        },
        {
          speaker: "B",
          chinese: "不，他在这儿，他也是学生。",
          pinyin: "Bù, tā zài zhèr, tā yě shì xuésheng.",
          translation: "Non, il est ici, il est aussi étudiant.",
        },
      ],
    },
    deconstruction: {
      hanzi: ["在", "哪", "儿", "这", "那", "中", "国", "法", "人"],
      grammar: [
        {
          point: "在 : le verbe de localisation",
          explanation:
            "在 signifie « être à / se trouver à » et il est le verbe à lui tout seul : 我在家 (je suis à la maison). Ne jamais ajouter 是 — « 我是在家 » est l'interférence française type (« je SUIS à la maison »).",
          examples: [
            {
              chinese: "我家在法国。",
              pinyin: "Wǒ jiā zài Fǎguó.",
              translation: "Ma famille est en France.",
            },
          ],
        },
        {
          point: "La nationalité : pays + 人, sans exception",
          explanation:
            "中国 + 人 = 中国人 (Chinois). 法国 + 人 = 法国人 (Français). Aucun suffixe, aucun accord, aucune exception : la composition remplace la morphologie. Pour demander : 哪国人 (quel-pays-personne).",
          examples: [
            {
              chinese: "你是哪国人？我是法国人。",
              pinyin: "Nǐ shì nǎ guó rén? Wǒ shì Fǎguó rén.",
              translation: "De quel pays es-tu ? Je suis français.",
            },
          ],
        },
        {
          point: "这 / 那 / 哪 : le trio démonstratif",
          explanation:
            "这 (proche), 那 (lointain), 哪 (lequel ?) : trois caractères, un système complet. Avec le suffixe 儿, ils deviennent des lieux : 这儿 (ici), 那儿 (là-bas), 哪儿 (où ?). Remarquez : 哪 n'est que 那 + 口 — la question est une variation orale du démonstratif.",
          examples: [
            {
              chinese: "你在哪儿？我在这儿。",
              pinyin: "Nǐ zài nǎr? Wǒ zài zhèr.",
              translation: "Où es-tu ? Je suis ici.",
            },
          ],
        },
      ],
      pronunciation: [
        "哪 nǎ (3e ton) contre 那 nà (4e ton) : la question monte-descend, la réponse tombe. Le ton est grammatical ici.",
        "Le suffixe 儿 se fond dans la syllabe : 哪儿 = nǎr (une seule syllabe rétroflexe), pas nǎ-ér.",
        "中 zhōng : rétroflexe zh- + 1er ton plat et long — pensez au « Pays du Milieu » qui s'étale.",
      ],
    },
    connection: {
      text: "国 est un caractère-usine : 中国, 法国, et plus tard 美国 (États-Unis), 英国 (Angleterre) — apprenez un pays, gagnez une nationalité avec 人. Vous connaissez maintenant les trois grands verbes d'état du programme A1 : 是 (identité), 有 (possession), 在 (localisation) — chacun avec sa règle propre.",
      links: [
        { from: "中", relation: "COMPOSE", to: "中国" },
        { from: "国", relation: "COMPOSE", to: "中国" },
        { from: "法", relation: "COMPOSE", to: "法国" },
        { from: "中国", relation: "COMPOSE", to: "中国人" },
        { from: "法国", relation: "COMPOSE", to: "法国人" },
        { from: "那", relation: "DONNE_LE_SON", to: "哪" },
        { from: "是", relation: "CONTRASTE_AVEC", to: "在" },
      ],
    },
    production: {
      prompts: [
        {
          instruction:
            "Présentez votre nationalité et dites où se trouve votre famille.",
          hint: "是 + nationalité (identité), 在 + lieu (localisation) — deux verbes différents.",
          example: {
            chinese: "我是法国人，我家在法国。",
            pinyin: "Wǒ shì Fǎguó rén, wǒ jiā zài Fǎguó.",
            translation: "Je suis français, ma famille est en France.",
          },
        },
        {
          instruction:
            "Demandez à quelqu'un de quel pays il vient et où il se trouve en ce moment.",
          hint: "哪国人 pour la nationalité, 在哪儿 pour le lieu — sans 吗.",
          example: {
            chinese: "你是哪国人？你在哪儿？",
            pinyin: "Nǐ shì nǎ guó rén? Nǐ zài nǎr?",
            translation: "De quel pays es-tu ? Où es-tu ?",
          },
        },
      ],
    },
    consolidation: {
      summary:
        "Le triangle 是/有/在 est complet : identité, possession, localisation. La composition pays + 人 illustre le principe central du chinois : pas de morphologie, de la combinaison. Vous avez maintenant 63 caractères actifs — le socle A1 est posé.",
      reviewWords: [
        "在", "哪儿", "这儿", "那儿", "中国", "法国", "人", "中国人", "法国人",
      ],
      reviewHanzi: ["在", "哪", "儿", "这", "那", "中", "国", "法", "人"],
    },
  },
};
