import type { LessonSeed } from "./types";

// Leçon 4 — Boire et manger
export const lesson4: LessonSeed = {
  slug: "boire-et-manger",
  title: "Boire et manger",
  mission: "Exprimer une envie, accepter et refuser",
  level: "A1",
  order: 4,
  hanzi: [
    {
      character: "吃",
      pinyin: "chī",
      meaning: "manger",
      hskLevel: 1,
      radical: "口",
      components: ["口", "乞"],
      etymology:
        "口 (la bouche) porte le sens, 乞 (qǐ, mendier) donnait la prononciation ancienne. Manger passe par la bouche.",
      family: ["吃饭", "好吃"],
      commonErrors: ["Prononcer chī avec la langue trop en avant — c'est une rétroflexe ch-"],
    },
    {
      character: "喝",
      pinyin: "hē",
      meaning: "boire",
      hskLevel: 1,
      radical: "口",
      components: ["口", "曷"],
      etymology:
        "口 (bouche) + 曷 (phonétique hé). Même radical que 吃 : tout ce qui se fait avec la bouche porte 口.",
      family: ["喝水", "喝茶"],
      commonErrors: ["Confusion visuelle avec 渴 (kě, avoir soif) qui porte le radical de l'eau"],
    },
    {
      character: "茶",
      pinyin: "chá",
      meaning: "thé",
      hskLevel: 1,
      radical: "艹",
      components: ["艹", "人", "木"],
      etymology:
        "艹 (l'herbe) au-dessus, un arbre (木) en dessous : la plante du thé. Un mot chinois devenu mondial — « tea » et « chai » viennent tous deux de 茶.",
      family: ["喝茶", "茶杯"],
      commonErrors: [],
    },
    {
      character: "水",
      pinyin: "shuǐ",
      meaning: "eau",
      hskLevel: 1,
      radical: "水",
      components: ["水"],
      etymology:
        "Pictogramme d'un courant d'eau : le filet central et les éclaboussures latérales. Devient 氵 comme radical (vous l'avez vu dans 没).",
      family: ["喝水", "水果"],
      commonErrors: ["3e ton complet : shuǐ descend puis remonte"],
    },
    {
      character: "饭",
      pinyin: "fàn",
      meaning: "riz cuit, repas",
      hskLevel: 1,
      radical: "饣",
      components: ["饣", "反"],
      etymology:
        "饣 (radical de la nourriture) + 反 (fǎn, phonétique). Le riz cuit est LE repas par excellence : 吃饭 signifie « manger » au sens large.",
      family: ["吃饭", "米饭"],
      commonErrors: [],
    },
    {
      character: "想",
      pinyin: "xiǎng",
      meaning: "avoir envie de, penser",
      hskLevel: 1,
      radical: "心",
      components: ["相", "心"],
      etymology:
        "相 (xiāng, phonétique) au-dessus de 心 (le cœur) : ce que le cœur se figure — penser, désirer. Les verbes du sentiment portent souvent 心.",
      family: [],
      commonErrors: ["想 (envie, souhait doux) n'est pas 要 (volonté ferme)"],
    },
    {
      character: "要",
      pinyin: "yào",
      meaning: "vouloir, demander",
      hskLevel: 1,
      radical: "西",
      components: ["西", "女"],
      etymology:
        "L'interprétation traditionnelle y voit une taille de femme ceinte des deux mains — l'exigence, ce qu'on réclame. Devenu le verbe de la volonté ferme.",
      family: [],
      commonErrors: [
        "要 au restaurant = je commande ; 想 = j'aimerais bien. Confondre les deux rend le ton trop abrupt ou trop vague",
      ],
    },
    {
      character: "也",
      pinyin: "yě",
      meaning: "aussi",
      hskLevel: 1,
      radical: "乙",
      components: ["也"],
      etymology:
        "Pictogramme ancien au sens discuté, emprunté très tôt pour l'adverbe « aussi ». Vous le connaissez déjà comme composant phonétique de 他 (tā).",
      family: [],
      commonErrors: [
        "Placer 也 en fin de phrase comme le « aussi » français : il se place TOUJOURS avant le verbe",
      ],
    },
    {
      character: "不",
      pinyin: "bù",
      meaning: "ne... pas",
      hskLevel: 1,
      radical: "一",
      components: ["不"],
      etymology:
        "L'interprétation traditionnelle y voit un oiseau qui s'élève vers le ciel sans pouvoir être rattrapé — le refus, la négation. Nie tous les verbes... sauf 有.",
      family: ["不是", "不好"],
      commonErrors: [
        "Employer 不 avec 有 (c'est 没有)",
        "Oublier le sandhi : 不 devient bú devant un 4e ton (不要 bú yào)",
      ],
    },
  ],
  vocabulary: [
    {
      word: "吃",
      pinyin: "chī",
      meaning: "manger",
      exampleZh: "你想吃什么？",
      examplePinyin: "Nǐ xiǎng chī shénme?",
      exampleFr: "Qu'as-tu envie de manger ?",
    },
    {
      word: "喝",
      pinyin: "hē",
      meaning: "boire",
      exampleZh: "我想喝茶。",
      examplePinyin: "Wǒ xiǎng hē chá.",
      exampleFr: "J'ai envie de boire du thé.",
    },
    {
      word: "茶",
      pinyin: "chá",
      meaning: "thé",
      exampleZh: "他喝茶。",
      examplePinyin: "Tā hē chá.",
      exampleFr: "Il boit du thé.",
    },
    {
      word: "水",
      pinyin: "shuǐ",
      meaning: "eau",
      exampleZh: "我要水。",
      examplePinyin: "Wǒ yào shuǐ.",
      exampleFr: "Je veux de l'eau.",
    },
    {
      word: "饭",
      pinyin: "fàn",
      meaning: "riz cuit, repas",
      exampleZh: "我们吃饭吧。",
      examplePinyin: "Wǒmen chīfàn ba.",
      exampleFr: "Mangeons !",
    },
    {
      word: "吃饭",
      pinyin: "chīfàn",
      meaning: "manger, prendre un repas",
      exampleZh: "你想吃饭吗？",
      examplePinyin: "Nǐ xiǎng chīfàn ma?",
      exampleFr: "Veux-tu manger ?",
    },
    {
      word: "想",
      pinyin: "xiǎng",
      meaning: "avoir envie de",
      exampleZh: "我想喝水。",
      examplePinyin: "Wǒ xiǎng hē shuǐ.",
      exampleFr: "J'ai envie de boire de l'eau.",
    },
    {
      word: "要",
      pinyin: "yào",
      meaning: "vouloir (ferme)",
      exampleZh: "我要一个茶。",
      examplePinyin: "Wǒ yào yí ge chá.",
      exampleFr: "Je prends un thé. (commande)",
    },
    {
      word: "也",
      pinyin: "yě",
      meaning: "aussi",
      exampleZh: "我也想喝茶。",
      examplePinyin: "Wǒ yě xiǎng hē chá.",
      exampleFr: "Moi aussi, j'ai envie de boire du thé.",
    },
    {
      word: "不",
      pinyin: "bù",
      meaning: "ne... pas",
      exampleZh: "我不喝茶。",
      examplePinyin: "Wǒ bù hē chá.",
      exampleFr: "Je ne bois pas de thé.",
    },
  ],
  content: {
    mission: {
      scenario:
        "Votre ami vous invite chez lui. Il vous propose à boire et à manger : il faut exprimer votre envie, accepter, refuser poliment — et remarquer que lui aussi a soif.",
      goals: [
        "Exprimer une envie (想) et une demande ferme (要)",
        "Refuser avec 不 (et se souvenir que 有 fait exception)",
        "Dire « aussi » à la chinoise : 也 avant le verbe",
      ],
    },
    discovery: {
      instructions:
        "Lisez sans les traductions. Observez : où se place 也 par rapport au verbe ? Quelle différence de ton entre 想 et 要 ?",
      dialogue: [
        {
          speaker: "A",
          chinese: "你想喝什么？茶吗？",
          pinyin: "Nǐ xiǎng hē shénme? Chá ma?",
          translation: "Qu'as-tu envie de boire ? Du thé ?",
        },
        {
          speaker: "B",
          chinese: "我不喝茶，我要水。你呢？",
          pinyin: "Wǒ bù hē chá, wǒ yào shuǐ. Nǐ ne?",
          translation: "Je ne bois pas de thé, je veux de l'eau. Et toi ?",
        },
        {
          speaker: "A",
          chinese: "我想喝茶。你想吃饭吗？",
          pinyin: "Wǒ xiǎng hē chá. Nǐ xiǎng chīfàn ma?",
          translation: "Moi, j'ai envie d'un thé. Tu veux manger ?",
        },
        {
          speaker: "B",
          chinese: "想！我也想吃饭。",
          pinyin: "Xiǎng! Wǒ yě xiǎng chīfàn.",
          translation: "Oui ! Moi aussi je veux manger.",
        },
      ],
    },
    deconstruction: {
      hanzi: ["吃", "喝", "茶", "水", "饭", "想", "要", "也", "不"],
      grammar: [
        {
          point: "La négation 不 (et le contraste avec 没有)",
          explanation:
            "不 nie tous les verbes : 不是 (ne pas être), 不喝 (ne pas boire), 不想 (ne pas vouloir). L'unique exception est 有, qui se nie avec 没. Deux négations, une règle simple : 没 pour 有, 不 pour tout le reste.",
          examples: [
            {
              chinese: "我不喝茶。我没有茶。",
              pinyin: "Wǒ bù hē chá. Wǒ méiyǒu chá.",
              translation: "Je ne bois pas de thé. Je n'ai pas de thé.",
            },
          ],
        },
        {
          point: "想 ou 要 : le degré de volonté",
          explanation:
            "想 + verbe = « j'ai envie de » (souhait doux). 要 + nom/verbe = « je veux, je prends » (volonté ferme, commande). Au restaurant, 我要... est la formule naturelle ; entre amis, 我想... est plus doux.",
          examples: [
            {
              chinese: "我想喝茶。我要一个茶。",
              pinyin: "Wǒ xiǎng hē chá. Wǒ yào yí ge chá.",
              translation: "J'ai envie d'un thé. / Je prends un thé.",
            },
          ],
        },
        {
          point: "也 se place avant le verbe, toujours",
          explanation:
            "Le français dit « moi aussi » en fin de phrase ; le chinois place 也 entre le sujet et le verbe : 我也想吃饭 (littéralement « je aussi veux manger »). 我想吃饭也 est incorrect — interférence classique.",
          examples: [
            {
              chinese: "我也想喝水。",
              pinyin: "Wǒ yě xiǎng hē shuǐ.",
              translation: "Moi aussi, je veux boire de l'eau.",
            },
          ],
        },
        {
          point: "Répondre oui/non sans « oui » ni « non »",
          explanation:
            "Le chinois n'a pas de mot universel pour « oui » : on répond en reprenant le verbe. 你想吃饭吗？ → 想 (oui) / 不想 (non). Vous l'avez déjà vu avec 是 dans la leçon 1.",
          examples: [
            {
              chinese: "你喝茶吗？— 喝。/ 不喝。",
              pinyin: "Nǐ hē chá ma? — Hē. / Bù hē.",
              translation: "Bois-tu du thé ? — Oui. / Non.",
            },
          ],
        },
      ],
      pronunciation: [
        "不 change de ton : bù normalement, mais bú devant un 4e ton (不要 bú yào, 不是 bú shì) — même mécanisme que 一.",
        "吃 chī et 茶 chá : deux rétroflexes ch-, langue recourbée vers l'arrière — très différent du « tch » français.",
        "水 shuǐ : 3e ton complet en fin de phrase (descend puis remonte), à ne pas écraser.",
      ],
    },
    connection: {
      text: "Le radical 口 (bouche) unit 吃, 喝, 叫, 吗, 呢 : tout ce qui se fait ou se dit avec la bouche. Le radical 心 (cœur) dans 想 ouvre la famille des verbes du sentiment. Et vous retrouvez 也 — le composant phonétique de 他 (leçon 2) devient un mot à part entière : le graphe boucle.",
      links: [
        { from: "口", relation: "RADICAL_DE", to: "吃" },
        { from: "口", relation: "RADICAL_DE", to: "喝" },
        { from: "心", relation: "RADICAL_DE", to: "想" },
        { from: "也", relation: "DONNE_LE_SON", to: "他" },
        { from: "吃", relation: "COMPOSE", to: "吃饭" },
        { from: "饭", relation: "COMPOSE", to: "吃饭" },
        { from: "不", relation: "CONTRASTE_AVEC", to: "没" },
      ],
    },
    production: {
      prompts: [
        {
          instruction:
            "Proposez à boire à quelqu'un, puis répondez à sa place : il refuse le thé et demande de l'eau.",
          hint: "想 pour proposer, 不 + verbe pour refuser, 要 pour la demande ferme.",
          example: {
            chinese: "你想喝茶吗？— 不喝，我要水。",
            pinyin: "Nǐ xiǎng hē chá ma? — Bù hē, wǒ yào shuǐ.",
            translation: "Veux-tu du thé ? — Non, je veux de l'eau.",
          },
        },
        {
          instruction:
            "Dites que vous aussi avez envie de manger (attention à la place de 也).",
          hint: "Sujet + 也 + verbe — jamais 也 en fin de phrase.",
          example: {
            chinese: "我也想吃饭。",
            pinyin: "Wǒ yě xiǎng chīfàn.",
            translation: "Moi aussi, j'ai envie de manger.",
          },
        },
      ],
    },
    consolidation: {
      summary:
        "Vous exprimez l'envie (想), la volonté (要), le refus (不) et l'addition (也 — avant le verbe !). Le système des deux négations est complet : 不 partout, 没 pour 有.",
      reviewWords: ["吃", "喝", "茶", "水", "饭", "吃饭", "想", "要", "也", "不"],
      reviewHanzi: ["吃", "喝", "茶", "水", "饭", "想", "要", "也", "不"],
    },
  },
};
