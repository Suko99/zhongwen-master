import type { LessonSeed } from "./types";

// Leçon 3 — Ma famille
export const lesson3: LessonSeed = {
  slug: "ma-famille",
  title: "Ma famille",
  mission: "Décrire sa famille et demander qui est qui",
  level: "A1",
  order: 3,
  hanzi: [
    {
      character: "家",
      pinyin: "jiā",
      meaning: "famille, foyer, maison",
      hskLevel: 1,
      radical: "宀",
      components: ["宀", "豕"],
      etymology:
        "Un cochon (豕) sous un toit (宀) : dans la Chine ancienne, le cochon domestique définissait le foyer prospère. Le lieu où vit la famille.",
      family: ["大家", "家人"],
      commonErrors: ["家 est à la fois « famille » et « maison » — le contexte décide"],
    },
    {
      character: "有",
      pinyin: "yǒu",
      meaning: "avoir, il y a",
      hskLevel: 1,
      radical: "月",
      components: ["𠂇", "月"],
      etymology:
        "L'interprétation traditionnelle y voit une main (𠂇) tenant de la viande (月) : posséder ce qui nourrit.",
      family: ["没有", "有名"],
      commonErrors: ["Nier 有 avec 不 : on dit 没有, jamais 不有 — seule exception du chinois"],
    },
    {
      character: "没",
      pinyin: "méi",
      meaning: "ne pas (avoir)",
      hskLevel: 1,
      radical: "氵",
      components: ["氵", "殳"],
      etymology:
        "氵 (eau) + 殳 : le sens ancien était « sombrer, disparaître sous l'eau ». Ce qui a sombré n'est plus là — d'où la négation de l'existence.",
      family: ["没有"],
      commonErrors: ["Employer 没 pour nier un verbe d'état (on dit 不是, pas 没是)"],
    },
    {
      character: "个",
      pinyin: "gè",
      meaning: "classificateur général",
      hskLevel: 1,
      radical: "人",
      components: ["人", "丨"],
      etymology:
        "Forme simplifiée de 個 ; la forme ancienne représentait une tige de bambou, unité de comptage par excellence. Devenu le classificateur passe-partout.",
      family: ["一个", "几个"],
      commonErrors: [
        "Oublier le classificateur : 一弟弟 est incorrect, on dit 一个弟弟",
      ],
    },
    {
      character: "的",
      pinyin: "de",
      meaning: "particule de possession",
      hskLevel: 1,
      radical: "白",
      components: ["白", "勺"],
      etymology:
        "白 (blanc) + 勺 (cuillère) : le sens d'origine (« éclatant, la cible ») a disparu à l'usage — c'est aujourd'hui le caractère le plus fréquent du chinois, pure particule grammaticale.",
      family: ["我的", "你的"],
      commonErrors: [
        "L'omettre ou le sur-employer : avec la famille proche, on peut dire 我妈妈 sans 的",
      ],
    },
    {
      character: "口",
      pinyin: "kǒu",
      meaning: "bouche ; classificateur du foyer",
      hskLevel: 1,
      radical: "口",
      components: ["口"],
      etymology:
        "Pictogramme d'une bouche ouverte. Pour compter les membres d'un foyer, on compte les bouches à nourrir : 四口人 = quatre personnes.",
      family: ["人口"],
      commonErrors: ["口 (foyer) ne s'emploie que pour la famille ; ailleurs on compte avec 个"],
    },
    {
      character: "爸",
      pinyin: "bà",
      meaning: "papa",
      hskLevel: 1,
      radical: "父",
      components: ["父", "巴"],
      etymology:
        "父 (père, deux mains tenant un outil — l'autorité) + 巴 (phonétique ba). Doublé en 爸爸 dans la langue parlée.",
      family: ["爸爸"],
      commonErrors: [],
    },
    {
      character: "妈",
      pinyin: "mā",
      meaning: "maman",
      hskLevel: 1,
      radical: "女",
      components: ["女", "马"],
      etymology:
        "女 (femme) + 马 (mǎ, phonétique). Même logique que 吗 : le composant 马 donne le son ma — seul le radical change le sens.",
      family: ["妈妈"],
      commonErrors: ["妈 mā (1er ton), 马 mǎ (3e), 吗 ma (neutre) : trois tons, trois sens"],
    },
    {
      character: "哥",
      pinyin: "gē",
      meaning: "grand frère",
      hskLevel: 1,
      radical: "口",
      components: ["可", "可"],
      etymology:
        "Deux 可 empilés ; à l'origine une variante de 歌 (chanter). Emprunté pour « grand frère », doublé en 哥哥 à l'oral.",
      family: ["哥哥"],
      commonErrors: [],
    },
    {
      character: "姐",
      pinyin: "jiě",
      meaning: "grande sœur",
      hskLevel: 1,
      radical: "女",
      components: ["女", "且"],
      etymology: "女 (femme) + 且 (phonétique). Doublé en 姐姐 dans la langue parlée.",
      family: ["姐姐", "小姐"],
      commonErrors: ["Confusion avec 妹 (petite sœur) — l'aînesse compte en chinois"],
    },
    {
      character: "弟",
      pinyin: "dì",
      meaning: "petit frère",
      hskLevel: 1,
      radical: "弓",
      components: ["弟"],
      etymology:
        "L'interprétation traditionnelle y voit une corde enroulée en ordre autour d'un pieu : l'ordre de succession — le cadet vient après.",
      family: ["弟弟"],
      commonErrors: [],
    },
    {
      character: "妹",
      pinyin: "mèi",
      meaning: "petite sœur",
      hskLevel: 1,
      radical: "女",
      components: ["女", "未"],
      etymology:
        "女 (femme) + 未 (phonétique wèi, « pas encore ») : celle qui n'est pas encore l'aînée — moyen mnémotechnique efficace, même si c'est d'abord un composant phonétique.",
      family: ["妹妹"],
      commonErrors: ["Confusion avec 姐 (grande sœur)"],
    },
    {
      character: "和",
      pinyin: "hé",
      meaning: "et ; harmonie",
      hskLevel: 1,
      radical: "口",
      components: ["禾", "口"],
      etymology:
        "禾 (céréale) + 口 (bouche) : l'interprétation traditionnelle y voit le grain qui nourrit chaque bouche — l'harmonie. De là, la conjonction « et ».",
      family: [],
      commonErrors: [
        "和 ne relie QUE des noms : jamais deux phrases comme le « et » français",
      ],
    },
    {
      character: "谁",
      pinyin: "shéi",
      meaning: "qui",
      hskLevel: 1,
      radical: "讠",
      components: ["讠", "隹"],
      etymology:
        "讠 (parole) + 隹 (oiseau à queue courte, phonétique) : le mot de parole qui demande l'identité.",
      family: [],
      commonErrors: ["Comme 什么 : 谁 reste à la place de la réponse, jamais de 吗 avec"],
    },
  ],
  vocabulary: [
    {
      word: "家",
      pinyin: "jiā",
      meaning: "famille, foyer, maison",
      exampleZh: "我家有四口人。",
      examplePinyin: "Wǒ jiā yǒu sì kǒu rén.",
      exampleFr: "Ma famille compte quatre personnes.",
    },
    {
      word: "有",
      pinyin: "yǒu",
      meaning: "avoir, il y a",
      exampleZh: "我有一个哥哥。",
      examplePinyin: "Wǒ yǒu yí ge gēge.",
      exampleFr: "J'ai un grand frère.",
    },
    {
      word: "没有",
      pinyin: "méiyǒu",
      meaning: "ne pas avoir",
      exampleZh: "我没有弟弟。",
      examplePinyin: "Wǒ méiyǒu dìdi.",
      exampleFr: "Je n'ai pas de petit frère.",
    },
    {
      word: "个",
      pinyin: "gè",
      meaning: "classificateur général",
      exampleZh: "三个妹妹",
      examplePinyin: "sān ge mèimei",
      exampleFr: "trois petites sœurs",
    },
    {
      word: "的",
      pinyin: "de",
      meaning: "particule de possession",
      exampleZh: "我的名字",
      examplePinyin: "wǒ de míngzi",
      exampleFr: "mon nom",
    },
    {
      word: "口",
      pinyin: "kǒu",
      meaning: "classificateur (membres du foyer)",
      exampleZh: "你家有几口人？",
      examplePinyin: "Nǐ jiā yǒu jǐ kǒu rén?",
      exampleFr: "Combien de personnes y a-t-il dans ta famille ?",
    },
    {
      word: "爸爸",
      pinyin: "bàba",
      meaning: "papa",
      exampleZh: "我爸爸是老师。",
      examplePinyin: "Wǒ bàba shì lǎoshī.",
      exampleFr: "Mon papa est professeur.",
    },
    {
      word: "妈妈",
      pinyin: "māma",
      meaning: "maman",
      exampleZh: "我妈妈叫李华。",
      examplePinyin: "Wǒ māma jiào Lǐ Huá.",
      exampleFr: "Ma maman s'appelle Li Hua.",
    },
    {
      word: "哥哥",
      pinyin: "gēge",
      meaning: "grand frère",
      exampleZh: "你有哥哥吗？",
      examplePinyin: "Nǐ yǒu gēge ma?",
      exampleFr: "As-tu un grand frère ?",
    },
    {
      word: "姐姐",
      pinyin: "jiějie",
      meaning: "grande sœur",
      exampleZh: "我姐姐二十岁。",
      examplePinyin: "Wǒ jiějie èrshí suì.",
      exampleFr: "Ma grande sœur a vingt ans.",
    },
    {
      word: "弟弟",
      pinyin: "dìdi",
      meaning: "petit frère",
      exampleZh: "我弟弟八岁。",
      examplePinyin: "Wǒ dìdi bā suì.",
      exampleFr: "Mon petit frère a huit ans.",
    },
    {
      word: "妹妹",
      pinyin: "mèimei",
      meaning: "petite sœur",
      exampleZh: "他妹妹是学生。",
      examplePinyin: "Tā mèimei shì xuésheng.",
      exampleFr: "Sa petite sœur est étudiante.",
    },
    {
      word: "和",
      pinyin: "hé",
      meaning: "et (entre noms)",
      exampleZh: "爸爸和妈妈",
      examplePinyin: "bàba hé māma",
      exampleFr: "papa et maman",
    },
    {
      word: "谁",
      pinyin: "shéi",
      meaning: "qui",
      exampleZh: "他是谁？",
      examplePinyin: "Tā shì shéi?",
      exampleFr: "Qui est-il ?",
    },
  ],
  content: {
    mission: {
      scenario:
        "Votre ami vous montre une photo de famille. Vous voulez savoir qui est qui, et lui décrire votre propre famille : combien de personnes, frères et sœurs.",
      goals: [
        "Compter les membres du foyer (几口人)",
        "Dire ce qu'on a et ce qu'on n'a pas (有 / 没有)",
        "Utiliser le classificateur 个 et le possessif 的",
        "Demander « qui » avec 谁",
      ],
    },
    discovery: {
      instructions:
        "Lisez sans les traductions. Observez : quel petit mot apparaît entre le nombre et la personne ? Comment dit-on « ne pas avoir » ?",
      dialogue: [
        {
          speaker: "A",
          chinese: "你家有几口人？",
          pinyin: "Nǐ jiā yǒu jǐ kǒu rén?",
          translation: "Combien êtes-vous dans ta famille ?",
        },
        {
          speaker: "B",
          chinese: "我家有四口人：爸爸、妈妈、姐姐和我。",
          pinyin: "Wǒ jiā yǒu sì kǒu rén: bàba, māma, jiějie hé wǒ.",
          translation: "Nous sommes quatre : papa, maman, ma grande sœur et moi.",
        },
        {
          speaker: "A",
          chinese: "他是谁？",
          pinyin: "Tā shì shéi?",
          translation: "Et lui, qui est-ce ? (sur la photo)",
        },
        {
          speaker: "B",
          chinese: "他是我爸爸。你有哥哥吗？",
          pinyin: "Tā shì wǒ bàba. Nǐ yǒu gēge ma?",
          translation: "C'est mon papa. Toi, as-tu un grand frère ?",
        },
        {
          speaker: "A",
          chinese: "没有，我有一个弟弟和一个妹妹。",
          pinyin: "Méiyǒu, wǒ yǒu yí ge dìdi hé yí ge mèimei.",
          translation: "Non, j'ai un petit frère et une petite sœur.",
        },
      ],
    },
    deconstruction: {
      hanzi: ["家", "有", "没", "个", "的", "口", "爸", "妈", "哥", "姐", "弟", "妹", "和", "谁"],
      grammar: [
        {
          point: "有 et sa négation spéciale 没有",
          explanation:
            "有 (avoir) est le seul verbe du chinois qui ne se nie pas avec 不 : on dit 没有, jamais 不有. C'est une exception absolue — autant l'apprendre comme un bloc.",
          examples: [
            {
              chinese: "我有姐姐，没有哥哥。",
              pinyin: "Wǒ yǒu jiějie, méiyǒu gēge.",
              translation: "J'ai une grande sœur, pas de grand frère.",
            },
          ],
        },
        {
          point: "Le classificateur 个",
          explanation:
            "En chinois, on ne compte jamais un nom directement : il faut un classificateur entre le nombre et le nom. 个 est le passe-partout : 一个弟弟 (un petit frère). Pour les membres du foyer, on utilise 口 (bouche) : 四口人.",
          examples: [
            {
              chinese: "我家有五口人。我有三个妹妹。",
              pinyin: "Wǒ jiā yǒu wǔ kǒu rén. Wǒ yǒu sān ge mèimei.",
              translation: "Nous sommes cinq. J'ai trois petites sœurs.",
            },
          ],
        },
        {
          point: "Le possessif 的 — et quand l'omettre",
          explanation:
            "的 marque la possession : 我的名字 (mon nom). Mais avec les relations proches (famille, 家), on l'omet souvent : 我妈妈 plutôt que 我的妈妈. Plus la relation est intime, moins on a besoin de 的.",
          examples: [
            {
              chinese: "我妈妈叫李华。",
              pinyin: "Wǒ māma jiào Lǐ Huá.",
              translation: "Ma maman s'appelle Li Hua.",
            },
          ],
        },
        {
          point: "和 ne relie que des noms",
          explanation:
            "和 traduit « et » entre des noms : 爸爸和妈妈. Mais JAMAIS entre deux phrases — c'est l'interférence française classique. « Je mange et je bois » ne se dit pas avec 和.",
          examples: [
            {
              chinese: "姐姐和我",
              pinyin: "jiějie hé wǒ",
              translation: "ma grande sœur et moi",
            },
          ],
        },
      ],
      pronunciation: [
        "Les noms de famille doublés perdent leur ton sur la 2e syllabe : māma, bàba, gēge, jiějie, dìdi, mèimei — la répétition est atone.",
        "谁 se prononce shéi dans la langue courante (la lecture shuí existe mais est livresque).",
        "妈 mā / 马 mǎ / 吗 ma : le composant 马 donne le son, le radical donne le sens — trio parfait pour sentir la logique phono-sémantique.",
      ],
    },
    connection: {
      text: "Regardez 妈 et 吗 : même composant phonétique 马 (ma), radicaux différents — 女 pour la femme, 口 pour la particule orale. Cette logique phono-sémantique couvre 80% des caractères chinois : trouvez le radical (sens) et le composant (son), et les caractères cessent d'être arbitraires. De même, 爸 contient 巴 (ba) et 姐 contient 且.",
      links: [
        { from: "马", relation: "DONNE_LE_SON", to: "妈" },
        { from: "马", relation: "DONNE_LE_SON", to: "吗" },
        { from: "女", relation: "RADICAL_DE", to: "妈" },
        { from: "女", relation: "RADICAL_DE", to: "姐" },
        { from: "女", relation: "RADICAL_DE", to: "妹" },
        { from: "没", relation: "NIE", to: "有" },
        { from: "口", relation: "COMPTE", to: "家" },
      ],
    },
    production: {
      prompts: [
        {
          instruction:
            "Décrivez votre famille : combien de personnes, et qui la compose (utilisez 口, 、 et 和).",
          hint: "我家有 X 口人：... 和我。",
          example: {
            chinese: "我家有三口人：妈妈、爸爸和我。",
            pinyin: "Wǒ jiā yǒu sān kǒu rén: māma, bàba hé wǒ.",
            translation: "Nous sommes trois : maman, papa et moi.",
          },
        },
        {
          instruction:
            "Dites ce que vous avez et n'avez pas comme frères et sœurs (有 / 没有 + 个).",
          hint: "N'oubliez pas le classificateur 个 après le nombre.",
          example: {
            chinese: "我有一个哥哥，没有妹妹。",
            pinyin: "Wǒ yǒu yí ge gēge, méiyǒu mèimei.",
            translation: "J'ai un grand frère, pas de petite sœur.",
          },
        },
      ],
    },
    consolidation: {
      summary:
        "Vous décrivez maintenant votre famille : 有/没有 (avec sa négation spéciale), le classificateur obligatoire 个, le possessif 的 et la conjonction 和 limitée aux noms. La logique phono-sémantique (妈/吗) est votre nouvelle clé de lecture.",
      reviewWords: [
        "家", "有", "没有", "个", "的", "口",
        "爸爸", "妈妈", "哥哥", "姐姐", "弟弟", "妹妹", "和", "谁",
      ],
      reviewHanzi: [
        "家", "有", "没", "个", "的", "口",
        "爸", "妈", "哥", "姐", "弟", "妹", "和", "谁",
      ],
    },
  },
};
