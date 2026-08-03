import type { LessonSeed } from "./types";

// Leçon 2 — Les nombres et l'âge
export const lesson2: LessonSeed = {
  slug: "les-nombres-et-l-age",
  title: "Les nombres et l'âge",
  mission: "Compter jusqu'à 99 et parler de l'âge",
  level: "A1",
  order: 2,
  hanzi: [
    {
      character: "一",
      pinyin: "yī",
      meaning: "un",
      hskLevel: 1,
      radical: "一",
      components: ["一"],
      etymology:
        "Un trait horizontal : le nombre un, représenté par une seule marque. Les trois premiers nombres sont de purs idéogrammes de comptage.",
      family: ["一个", "第一"],
      commonErrors: [
        "Oublier le sandhi tonal : 一 devient 2e ton devant un 4e ton (一个 yí ge) et 4e ton devant les autres tons",
      ],
    },
    {
      character: "二",
      pinyin: "èr",
      meaning: "deux",
      hskLevel: 1,
      radical: "二",
      components: ["二"],
      etymology: "Deux traits horizontaux : le nombre deux, marque de comptage.",
      family: ["二十", "第二"],
      commonErrors: ["Utiliser 二 devant un classificateur au lieu de 两 (à découvrir plus tard)"],
    },
    {
      character: "三",
      pinyin: "sān",
      meaning: "trois",
      hskLevel: 1,
      radical: "一",
      components: ["三"],
      etymology: "Trois traits horizontaux : le nombre trois, marque de comptage.",
      family: ["三十"],
      commonErrors: ["Prononcer sān avec un ton descendant au lieu du 1er ton plat"],
    },
    {
      character: "四",
      pinyin: "sì",
      meaning: "quatre",
      hskLevel: 1,
      radical: "囗",
      components: ["囗", "儿"],
      etymology:
        "À l'origine quatre traits, remplacés très tôt par ce caractère emprunté pour sa prononciation. La forme actuelle (une enceinte) n'a plus de lien pictural avec le nombre.",
      family: ["四十"],
      commonErrors: ["Confondre 四 sì (4e ton, initiale s-) et 十 shí (2e ton, initiale sh-)"],
    },
    {
      character: "五",
      pinyin: "wǔ",
      meaning: "cinq",
      hskLevel: 1,
      radical: "二",
      components: ["五"],
      etymology:
        "Emprunt phonétique ancien ; l'interprétation traditionnelle y voit un croisement entre deux traits, le ciel et la terre.",
      family: ["五十"],
      commonErrors: [],
    },
    {
      character: "六",
      pinyin: "liù",
      meaning: "six",
      hskLevel: 1,
      radical: "八",
      components: ["亠", "八"],
      etymology:
        "Emprunt phonétique : la forme d'origine représentait probablement une hutte, réutilisée pour noter le nombre six.",
      family: ["六十"],
      commonErrors: [],
    },
    {
      character: "七",
      pinyin: "qī",
      meaning: "sept",
      hskLevel: 1,
      radical: "一",
      components: ["七"],
      etymology:
        "À l'origine, ce signe notait l'idée de « couper » (devenue 切) ; il a été emprunté pour le nombre sept.",
      family: ["七十"],
      commonErrors: ["Confusion visuelle avec 匕"],
    },
    {
      character: "八",
      pinyin: "bā",
      meaning: "huit",
      hskLevel: 1,
      radical: "八",
      components: ["八"],
      etymology:
        "Deux traits qui se séparent : le sens ancien était « diviser ». Emprunté pour le nombre huit, considéré comme porte-bonheur (proche de 发, prospérer).",
      family: ["八十"],
      commonErrors: ["Confusion visuelle avec 人 (les traits de 八 ne se touchent pas)"],
    },
    {
      character: "九",
      pinyin: "jiǔ",
      meaning: "neuf (9)",
      hskLevel: 1,
      radical: "丿",
      components: ["九"],
      etymology:
        "L'interprétation traditionnelle y voit un bras plié au coude ; emprunté phonétiquement pour le nombre neuf, symbole d'éternité (homophone de 久, longtemps).",
      family: ["九十"],
      commonErrors: ["Confusion visuelle avec 几 (jǐ, combien)"],
    },
    {
      character: "十",
      pinyin: "shí",
      meaning: "dix",
      hskLevel: 1,
      radical: "十",
      components: ["十"],
      etymology:
        "Une croix complète : la verticale rencontre l'horizontale — la totalité d'un cycle de comptage. Base de tous les nombres jusqu'à 99.",
      family: ["十一", "二十"],
      commonErrors: ["Confondre 十 shí (2e ton, sh-) et 四 sì (4e ton, s-) — le piège classique"],
    },
    {
      character: "几",
      pinyin: "jǐ",
      meaning: "combien (petit nombre)",
      hskLevel: 1,
      radical: "几",
      components: ["几"],
      etymology:
        "À l'origine, le pictogramme d'une petite table basse. La forme sert aujourd'hui de simplification de 幾 : « combien » quand on attend un petit nombre (< 10).",
      family: ["几岁", "几个"],
      commonErrors: [
        "Utiliser 几 pour un grand nombre (on demande 多大 pour l'âge d'un adulte)",
        "Confusion visuelle avec 九",
      ],
    },
    {
      character: "多",
      pinyin: "duō",
      meaning: "beaucoup, combien",
      hskLevel: 1,
      radical: "夕",
      components: ["夕", "夕"],
      etymology:
        "Deux 夕 (soir) empilés : l'interprétation traditionnelle y voit l'accumulation des jours qui passent — d'où « beaucoup ».",
      family: ["多大", "多少"],
      commonErrors: [],
    },
    {
      character: "大",
      pinyin: "dà",
      meaning: "grand",
      hskLevel: 1,
      radical: "大",
      components: ["大"],
      etymology:
        "Pictogramme d'une personne debout, bras et jambes écartés pour paraître la plus grande possible.",
      family: ["多大", "大学"],
      commonErrors: ["Confusion visuelle avec 太 (tài) et 天 (tiān)"],
    },
    {
      character: "岁",
      pinyin: "suì",
      meaning: "an (d'âge)",
      hskLevel: 1,
      radical: "山",
      components: ["山", "夕"],
      etymology:
        "Forme simplifiée de 歲, qui désignait la planète Jupiter et son cycle — devenu la mesure des années d'âge.",
      family: ["几岁"],
      commonErrors: ["Oublier 岁 après le nombre (我二十 est incomplet : on dit 我二十岁)"],
    },
    {
      character: "今",
      pinyin: "jīn",
      meaning: "maintenant, présent",
      hskLevel: 1,
      radical: "人",
      components: ["人", "𠆢"],
      etymology:
        "L'interprétation traditionnelle y voit un rassemblement sous un couvercle : l'instant saisi, le présent.",
      family: ["今年", "今天"],
      commonErrors: ["Confusion visuelle avec 令"],
    },
    {
      character: "年",
      pinyin: "nián",
      meaning: "année",
      hskLevel: 1,
      radical: "干",
      components: ["年"],
      etymology:
        "La forme ancienne représentait une personne portant la récolte sur son dos : un cycle de moisson = une année.",
      family: ["今年", "明年", "新年"],
      commonErrors: [],
    },
    {
      character: "他",
      pinyin: "tā",
      meaning: "il, lui",
      hskLevel: 1,
      radical: "亻",
      components: ["亻", "也"],
      etymology:
        "Phono-sémantique : 亻 (personne) + 也 (phonétique). Désigne une troisième personne — « l'autre ».",
      family: ["他们"],
      commonErrors: ["她 (elle) se prononce exactement pareil : tā — seul l'écrit les distingue"],
    },
  ],
  vocabulary: [
    {
      word: "一",
      pinyin: "yī",
      meaning: "un",
      exampleZh: "我有一个弟弟。",
      examplePinyin: "Wǒ yǒu yí ge dìdi.",
      exampleFr: "J'ai un petit frère.",
    },
    {
      word: "二",
      pinyin: "èr",
      meaning: "deux",
      exampleZh: "十二",
      examplePinyin: "shí'èr",
      exampleFr: "douze",
    },
    {
      word: "三",
      pinyin: "sān",
      meaning: "trois",
      exampleZh: "三十",
      examplePinyin: "sānshí",
      exampleFr: "trente",
    },
    {
      word: "四",
      pinyin: "sì",
      meaning: "quatre",
      exampleZh: "十四",
      examplePinyin: "shísì",
      exampleFr: "quatorze",
    },
    {
      word: "五",
      pinyin: "wǔ",
      meaning: "cinq",
      exampleZh: "五十五",
      examplePinyin: "wǔshíwǔ",
      exampleFr: "cinquante-cinq",
    },
    {
      word: "六",
      pinyin: "liù",
      meaning: "six",
      exampleZh: "十六",
      examplePinyin: "shíliù",
      exampleFr: "seize",
    },
    {
      word: "七",
      pinyin: "qī",
      meaning: "sept",
      exampleZh: "七十",
      examplePinyin: "qīshí",
      exampleFr: "soixante-dix",
    },
    {
      word: "八",
      pinyin: "bā",
      meaning: "huit",
      exampleZh: "十八",
      examplePinyin: "shíbā",
      exampleFr: "dix-huit",
    },
    {
      word: "九",
      pinyin: "jiǔ",
      meaning: "neuf (9)",
      exampleZh: "九十九",
      examplePinyin: "jiǔshíjiǔ",
      exampleFr: "quatre-vingt-dix-neuf",
    },
    {
      word: "十",
      pinyin: "shí",
      meaning: "dix",
      exampleZh: "二十一",
      examplePinyin: "èrshíyī",
      exampleFr: "vingt-et-un",
    },
    {
      word: "几",
      pinyin: "jǐ",
      meaning: "combien (< 10)",
      exampleZh: "他几岁？",
      examplePinyin: "Tā jǐ suì?",
      exampleFr: "Quel âge a-t-il ? (enfant)",
    },
    {
      word: "多大",
      pinyin: "duō dà",
      meaning: "quel âge",
      exampleZh: "你今年多大？",
      examplePinyin: "Nǐ jīnnián duō dà?",
      exampleFr: "Quel âge as-tu cette année ?",
    },
    {
      word: "岁",
      pinyin: "suì",
      meaning: "an (d'âge)",
      exampleZh: "我二十岁。",
      examplePinyin: "Wǒ èrshí suì.",
      exampleFr: "J'ai vingt ans.",
    },
    {
      word: "今年",
      pinyin: "jīnnián",
      meaning: "cette année",
      exampleZh: "今年我十九岁。",
      examplePinyin: "Jīnnián wǒ shíjiǔ suì.",
      exampleFr: "Cette année, j'ai dix-neuf ans.",
    },
    {
      word: "他",
      pinyin: "tā",
      meaning: "il, lui",
      exampleZh: "他是学生。",
      examplePinyin: "Tā shì xuésheng.",
      exampleFr: "Il est étudiant.",
    },
  ],
  content: {
    mission: {
      scenario:
        "Toujours à Pékin, la conversation continue : votre nouvel ami veut savoir votre âge, et vous demande celui de son petit voisin. Il vous faut les nombres.",
      goals: [
        "Compter de 1 à 99 avec seulement 10 caractères",
        "Demander l'âge d'un adulte (你多大？) et d'un enfant (他几岁？)",
        "Donner votre âge sans verbe : 我二十岁",
      ],
    },
    discovery: {
      instructions:
        "Lisez le dialogue sans les traductions. Observez : comment 二 et 十 se combinent-ils ? Trouvez-vous un verbe dans les phrases d'âge ?",
      dialogue: [
        {
          speaker: "A",
          chinese: "你今年多大？",
          pinyin: "Nǐ jīnnián duō dà?",
          translation: "Quel âge as-tu cette année ?",
        },
        {
          speaker: "B",
          chinese: "我今年二十岁。你呢？",
          pinyin: "Wǒ jīnnián èrshí suì. Nǐ ne?",
          translation: "J'ai vingt ans cette année. Et toi ?",
        },
        {
          speaker: "A",
          chinese: "我十九岁。",
          pinyin: "Wǒ shíjiǔ suì.",
          translation: "J'ai dix-neuf ans.",
        },
        {
          speaker: "B",
          chinese: "他几岁？",
          pinyin: "Tā jǐ suì?",
          translation: "Et lui, quel âge a-t-il ? (un enfant)",
        },
        {
          speaker: "A",
          chinese: "他八岁。",
          pinyin: "Tā bā suì.",
          translation: "Il a huit ans.",
        },
      ],
    },
    deconstruction: {
      hanzi: [
        "一", "二", "三", "四", "五", "六", "七", "八", "九", "十",
        "几", "多", "大", "岁", "今", "年", "他",
      ],
      grammar: [
        {
          point: "Les nombres de 11 à 99 : pure logique positionnelle",
          explanation:
            "11 = 十一 (dix-un), 20 = 二十 (deux-dix), 21 = 二十一 (deux-dix-un). Aucune exception, aucun « soixante-quinze » : 75 = 七十五 (sept-dix-cinq). Dix caractères suffisent pour tout compter jusqu'à 99.",
          examples: [
            {
              chinese: "九十九",
              pinyin: "jiǔshíjiǔ",
              translation: "99 (neuf-dix-neuf)",
            },
          ],
        },
        {
          point: "L'âge sans verbe",
          explanation:
            "Pour l'âge, pas de 是 ni d'équivalent de « avoir » : sujet + nombre + 岁, directement. 我二十岁 = « moi vingt ans ». Dire 我是二十岁 est une interférence du français.",
          examples: [
            {
              chinese: "我二十岁。",
              pinyin: "Wǒ èrshí suì.",
              translation: "J'ai vingt ans.",
            },
          ],
        },
        {
          point: "几 ou 多大 ?",
          explanation:
            "几岁 s'emploie quand on attend un petit nombre — typiquement l'âge d'un enfant. 多大 (littéralement « combien grand ») est la question d'âge générale, polie pour un adulte. Comme 什么, ces mots restent à la place de la réponse : pas de 吗.",
          examples: [
            {
              chinese: "你多大？他几岁？",
              pinyin: "Nǐ duō dà? Tā jǐ suì?",
              translation: "Quel âge as-tu ? Quel âge a-t-il (l'enfant) ?",
            },
          ],
        },
      ],
      pronunciation: [
        "四 sì (s- comme « si », 4e ton) contre 十 shí (sh- rétroflexe, 2e ton montant) : LE contraste à maîtriser — 四十 (40) et 十四 (14) ne diffèrent que par l'ordre.",
        "一 change de ton : yī isolé, yí devant un 4e ton (一岁 yí suì), yì devant les autres tons.",
        "九 jiǔ et 几 jǐ : même initiale j-, tons différents (3e ton tous les deux mais voyelles distinctes iu / i).",
      ],
    },
    connection: {
      text: "多 + 大 = 多大 : « combien-grand », la question de l'âge. 今 + 年 = 今年, « l'année du présent ». Et 他 partage son composant 也 avec un caractère que vous verrez bientôt — le graphe se densifie. Notez aussi que 几 et 九 se ressemblent dangereusement : le graphe enregistre ce risque de confusion.",
      links: [
        { from: "多", relation: "COMPOSE", to: "多大" },
        { from: "大", relation: "COMPOSE", to: "多大" },
        { from: "今", relation: "COMPOSE", to: "今年" },
        { from: "年", relation: "COMPOSE", to: "今年" },
        { from: "几", relation: "SE_CONFOND_AVEC", to: "九" },
        { from: "四", relation: "SE_CONFOND_AVEC", to: "十" },
      ],
    },
    production: {
      prompts: [
        {
          instruction: "Écrivez ces nombres en caractères : 15, 42, 78.",
          hint: "Dizaine + 十 + unité. 42 = quatre-dix-deux.",
          example: {
            chinese: "十五、四十二、七十八",
            pinyin: "shíwǔ, sìshí'èr, qīshíbā",
            translation: "15, 42, 78",
          },
        },
        {
          instruction:
            "Demandez l'âge de votre interlocuteur (adulte), puis donnez le vôtre.",
          hint: "多大 pour demander, nombre + 岁 pour répondre — sans verbe !",
          example: {
            chinese: "你今年多大？我今年三十岁。",
            pinyin: "Nǐ jīnnián duō dà? Wǒ jīnnián sānshí suì.",
            translation: "Quel âge as-tu cette année ? J'ai trente ans.",
          },
        },
      ],
    },
    consolidation: {
      summary:
        "Avec 10 caractères, vous comptez jusqu'à 99 ; avec 岁, 几 et 多大, vous parlez d'âge. Retenez surtout : pas de verbe pour l'âge, et 四/十 est le piège de prononciation numéro un du mandarin.",
      reviewWords: [
        "一", "二", "三", "四", "五", "六", "七", "八", "九", "十",
        "几", "多大", "岁", "今年", "他",
      ],
      reviewHanzi: [
        "一", "二", "三", "四", "五", "六", "七", "八", "九", "十",
        "几", "多", "大", "岁", "今", "年", "他",
      ],
    },
  },
};
