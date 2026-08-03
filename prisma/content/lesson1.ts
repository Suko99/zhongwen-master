import type { LessonSeed } from "./types";

// Leçon 1 — Se présenter
// Étymologies formulées avec prudence (PRD §6, garde-fous) :
// "interprétation traditionnelle" plutôt qu'affirmation catégorique.
export const lesson1: LessonSeed = {
  slug: "se-presenter",
  title: "Se présenter",
  mission: "Saluer quelqu'un et échanger vos noms",
  level: "A1",
  order: 1,
  hanzi: [
    {
      character: "你",
      pinyin: "nǐ",
      meaning: "tu, toi",
      hskLevel: 1,
      radical: "亻",
      components: ["亻", "尔"],
      etymology:
        "Caractère phono-sémantique : 亻 (la personne) porte le sens, 尔 donne la prononciation. Littéralement « la personne en face de toi ».",
      family: ["你好", "你们"],
      commonErrors: ["Confusion avec 您 (forme polie, à découvrir plus tard)"],
    },
    {
      character: "好",
      pinyin: "hǎo",
      meaning: "bon, bien",
      hskLevel: 1,
      radical: "女",
      components: ["女", "子"],
      etymology:
        "Association de 女 (femme) et 子 (enfant) : l'interprétation traditionnelle veut qu'une mère avec son enfant évoque ce qui est bon et harmonieux.",
      family: ["你好", "好的", "好吃"],
      commonErrors: ["Prononcer hào (4e ton) au lieu de hǎo (3e ton) dans 你好"],
    },
    {
      character: "我",
      pinyin: "wǒ",
      meaning: "je, moi",
      hskLevel: 1,
      radical: "戈",
      components: ["手", "戈"],
      etymology:
        "À l'origine, le pictogramme d'une arme à dents (proche de la hallebarde 戈). Le caractère a été emprunté phonétiquement pour dire « je » — le sens d'origine a disparu.",
      family: ["我们", "我的"],
      commonErrors: ["Oublier le crochet final dans l'écriture"],
    },
    {
      character: "叫",
      pinyin: "jiào",
      meaning: "appeler, s'appeler",
      hskLevel: 1,
      radical: "口",
      components: ["口", "丩"],
      etymology:
        "Phono-sémantique : 口 (la bouche) porte le sens — appeler se fait avec la bouche — et 丩 donnait la prononciation ancienne.",
      family: ["叫做"],
      commonErrors: [
        "Utiliser 是 au lieu de 叫 pour donner son nom (« 我是叫... » est incorrect)",
      ],
    },
    {
      character: "什",
      pinyin: "shén",
      meaning: "quoi (dans 什么)",
      hskLevel: 1,
      radical: "亻",
      components: ["亻", "十"],
      etymology:
        "亻 (personne) + 十 (dix). Sens ancien lié au dénombrement ; aujourd'hui presque exclusivement utilisé dans le mot 什么 (quoi).",
      family: ["什么"],
      commonErrors: ["Le lire shí (comme dans 什锦) au lieu de shén dans 什么"],
    },
    {
      character: "么",
      pinyin: "me",
      meaning: "particule (dans 什么)",
      hskLevel: 1,
      radical: "丿",
      components: ["丿", "厶"],
      etymology:
        "Forme simplifiée de 麼. Particule atone sans sens propre, qui forme des mots interrogatifs : 什么 (quoi), 怎么 (comment).",
      family: ["什么", "怎么"],
      commonErrors: ["Le prononcer avec un ton plein alors qu'il est atone (ton neutre)"],
    },
    {
      character: "名",
      pinyin: "míng",
      meaning: "nom",
      hskLevel: 1,
      radical: "口",
      components: ["夕", "口"],
      etymology:
        "夕 (le soir) + 口 (la bouche) : l'interprétation traditionnelle veut que dans l'obscurité du soir, on ne se reconnaît pas — il faut dire son nom à voix haute.",
      family: ["名字", "有名"],
      commonErrors: ["Confusion visuelle avec 各"],
    },
    {
      character: "字",
      pinyin: "zì",
      meaning: "caractère, prénom",
      hskLevel: 1,
      radical: "宀",
      components: ["宀", "子"],
      etymology:
        "子 (enfant) sous 宀 (le toit) : un enfant né et élevé sous le toit familial. Le sens s'est étendu aux caractères écrits — engendrés par combinaison, comme les enfants.",
      family: ["名字", "汉字"],
      commonErrors: ["Confusion avec 子 seul (zǐ, 3e ton)"],
    },
    {
      character: "是",
      pinyin: "shì",
      meaning: "être",
      hskLevel: 1,
      radical: "日",
      components: ["日", "正"],
      etymology:
        "日 (le soleil) au-dessus d'une forme de 正 (droit, correct). Sens ancien : « ce qui est droit, exact » — devenu la copule « être », qui affirme que quelque chose est bien le cas.",
      family: ["是的", "不是"],
      commonErrors: [
        "Utiliser 是 devant un adjectif (« 我是高 » est incorrect : on dit 我很高)",
      ],
    },
    {
      character: "学",
      pinyin: "xué",
      meaning: "apprendre, étudier",
      hskLevel: 1,
      radical: "子",
      components: ["⺍", "冖", "子"],
      etymology:
        "Forme simplifiée de 學 : en haut, des mains qui transmettent ; en bas, 子 l'enfant qui reçoit. L'interprétation traditionnelle y voit l'instruction transmise à l'enfant sous un toit.",
      family: ["学生", "学校", "学习", "科学"],
      commonErrors: ["Confusion avec 觉 (jué/jiào), très proche visuellement"],
    },
    {
      character: "生",
      pinyin: "shēng",
      meaning: "naître, vivre ; cru",
      hskLevel: 1,
      radical: "生",
      components: ["生"],
      etymology:
        "Pictogramme d'une jeune pousse qui sort de terre : la naissance, la vie, ce qui pousse. Dans 学生, désigne la personne (« celui qui étudie »).",
      family: ["学生", "先生", "生日"],
      commonErrors: ["Oublier que 生 est au 1er ton (shēng), souvent prononcé trop bas"],
    },
    {
      character: "吗",
      pinyin: "ma",
      meaning: "particule interrogative",
      hskLevel: 1,
      radical: "口",
      components: ["口", "马"],
      etymology:
        "Phono-sémantique : 口 (bouche) indique une particule orale, 马 (mǎ, cheval) donne le son. Transforme une affirmation en question oui/non, sans inversion.",
      family: [],
      commonErrors: [
        "Utiliser 吗 avec un mot interrogatif (« 你叫什么名字吗 ? » est incorrect)",
      ],
    },
    {
      character: "呢",
      pinyin: "ne",
      meaning: "particule (« et... ? »)",
      hskLevel: 1,
      radical: "口",
      components: ["口", "尼"],
      etymology:
        "Phono-sémantique : 口 (bouche) pour la particule orale, 尼 (ní) pour le son. Renvoie la question à l'interlocuteur : 你呢 ? — « et toi ? »",
      family: [],
      commonErrors: ["Confondre 呢 (renvoi de question) et 吗 (question oui/non)"],
    },
  ],
  vocabulary: [
    {
      word: "你好",
      pinyin: "nǐ hǎo",
      meaning: "bonjour",
      exampleZh: "你好！",
      examplePinyin: "Nǐ hǎo!",
      exampleFr: "Bonjour !",
    },
    {
      word: "你",
      pinyin: "nǐ",
      meaning: "tu, toi",
      exampleZh: "你是学生吗？",
      examplePinyin: "Nǐ shì xuésheng ma?",
      exampleFr: "Es-tu étudiant(e) ?",
    },
    {
      word: "我",
      pinyin: "wǒ",
      meaning: "je, moi",
      exampleZh: "我叫王明。",
      examplePinyin: "Wǒ jiào Wáng Míng.",
      exampleFr: "Je m'appelle Wang Ming.",
    },
    {
      word: "叫",
      pinyin: "jiào",
      meaning: "s'appeler, appeler",
      exampleZh: "我叫李华。",
      examplePinyin: "Wǒ jiào Lǐ Huá.",
      exampleFr: "Je m'appelle Li Hua.",
    },
    {
      word: "什么",
      pinyin: "shénme",
      meaning: "quoi, quel",
      exampleZh: "这是什么？",
      examplePinyin: "Zhè shì shénme?",
      exampleFr: "Qu'est-ce que c'est ?",
    },
    {
      word: "名字",
      pinyin: "míngzi",
      meaning: "nom, prénom",
      exampleZh: "你叫什么名字？",
      examplePinyin: "Nǐ jiào shénme míngzi?",
      exampleFr: "Comment t'appelles-tu ?",
    },
    {
      word: "是",
      pinyin: "shì",
      meaning: "être",
      exampleZh: "我是学生。",
      examplePinyin: "Wǒ shì xuésheng.",
      exampleFr: "Je suis étudiant(e).",
    },
    {
      word: "学生",
      pinyin: "xuésheng",
      meaning: "étudiant(e), élève",
      exampleZh: "他是学生。",
      examplePinyin: "Tā shì xuésheng.",
      exampleFr: "Il est étudiant.",
    },
    {
      word: "吗",
      pinyin: "ma",
      meaning: "particule interrogative (oui/non)",
      exampleZh: "你是学生吗？",
      examplePinyin: "Nǐ shì xuésheng ma?",
      exampleFr: "Es-tu étudiant(e) ?",
    },
    {
      word: "呢",
      pinyin: "ne",
      meaning: "particule « et... ? »",
      exampleZh: "我叫王明，你呢？",
      examplePinyin: "Wǒ jiào Wáng Míng, nǐ ne?",
      exampleFr: "Je m'appelle Wang Ming, et toi ?",
    },
  ],
  content: {
    mission: {
      scenario:
        "Vous rencontrez quelqu'un pour la première fois à Pékin. Vous devez le saluer, demander son nom, donner le vôtre et dire ce que vous faites.",
      goals: [
        "Saluer quelqu'un (你好)",
        "Demander et donner un nom (你叫什么名字？ / 我叫...)",
        "Poser une question oui/non avec 吗",
        "Renvoyer une question avec 呢",
      ],
    },
    discovery: {
      instructions:
        "Lisez d'abord le dialogue sans regarder les traductions. Observez : quels caractères reviennent plusieurs fois ? Où se placent les particules en fin de phrase ?",
      dialogue: [
        {
          speaker: "A",
          chinese: "你好！",
          pinyin: "Nǐ hǎo!",
          translation: "Bonjour !",
        },
        {
          speaker: "B",
          chinese: "你好！你叫什么名字？",
          pinyin: "Nǐ hǎo! Nǐ jiào shénme míngzi?",
          translation: "Bonjour ! Comment t'appelles-tu ?",
        },
        {
          speaker: "A",
          chinese: "我叫王明。你呢？",
          pinyin: "Wǒ jiào Wáng Míng. Nǐ ne?",
          translation: "Je m'appelle Wang Ming. Et toi ?",
        },
        {
          speaker: "B",
          chinese: "我叫李华。你是学生吗？",
          pinyin: "Wǒ jiào Lǐ Huá. Nǐ shì xuésheng ma?",
          translation: "Je m'appelle Li Hua. Es-tu étudiant ?",
        },
        {
          speaker: "A",
          chinese: "是，我是学生。",
          pinyin: "Shì, wǒ shì xuésheng.",
          translation: "Oui, je suis étudiant.",
        },
      ],
    },
    deconstruction: {
      hanzi: ["你", "好", "我", "叫", "什", "么", "名", "字", "是", "学", "生", "吗", "呢"],
      grammar: [
        {
          point: "L'ordre Sujet-Verbe-Objet",
          explanation:
            "Comme en français, le chinois suit l'ordre Sujet-Verbe-Objet : 我 (S) 叫 (V) 王明 (O). Aucune conjugaison : 叫 ne change jamais de forme, quel que soit le sujet ou le temps.",
          examples: [
            {
              chinese: "我叫王明。",
              pinyin: "Wǒ jiào Wáng Míng.",
              translation: "Je m'appelle Wang Ming.",
            },
          ],
        },
        {
          point: "La question avec 吗",
          explanation:
            "Pour transformer une affirmation en question oui/non, on ajoute simplement 吗 en fin de phrase. Pas d'inversion, pas de « est-ce que » : 你是学生 (tu es étudiant) → 你是学生吗？ (es-tu étudiant ?).",
          examples: [
            {
              chinese: "你是学生吗？",
              pinyin: "Nǐ shì xuésheng ma?",
              translation: "Es-tu étudiant(e) ?",
            },
          ],
        },
        {
          point: "La question ouverte avec 什么",
          explanation:
            "什么 (quoi) reste À LA PLACE de la réponse attendue, contrairement au français qui déplace le mot interrogatif en tête. 你叫什么名字 = littéralement « tu t'appelles QUEL nom ». Jamais de 吗 avec 什么 : les deux types de question s'excluent.",
          examples: [
            {
              chinese: "你叫什么名字？",
              pinyin: "Nǐ jiào shénme míngzi?",
              translation: "Comment t'appelles-tu ?",
            },
          ],
        },
        {
          point: "Le renvoi avec 呢",
          explanation:
            "呢 renvoie la question qu'on vient de vous poser : 你呢？ = « et toi ? ». Économie maximale : inutile de répéter toute la question.",
          examples: [
            {
              chinese: "我叫王明。你呢？",
              pinyin: "Wǒ jiào Wáng Míng. Nǐ ne?",
              translation: "Je m'appelle Wang Ming. Et toi ?",
            },
          ],
        },
      ],
      pronunciation: [
        "你好 : deux 3es tons qui se suivent → le premier devient 2e ton. On dit ní hǎo, pas nǐ hǎo (règle du sandhi tonal).",
        "吗, 呢, 么 sont atones (ton neutre) : brefs et légers, jamais accentués.",
        "叫 (jiào, 4e ton) : ton descendant, net et bref, comme un ordre en français.",
      ],
    },
    connection: {
      text: "学 (apprendre) + 生 (celui qui vit/naît) = 学生, « celui qui apprend ». Retenez la logique de composition : elle débloque 学校 (école = lieu d'étude) et 学习 (étudier). De même, 名 (nom) + 字 (caractère) = 名字. Chaque mot nouveau appartient à une famille — c'est le début de votre graphe.",
      links: [
        { from: "学", relation: "COMPOSE", to: "学生" },
        { from: "生", relation: "COMPOSE", to: "学生" },
        { from: "名", relation: "COMPOSE", to: "名字" },
        { from: "字", relation: "COMPOSE", to: "名字" },
        { from: "什", relation: "COMPOSE", to: "什么" },
        { from: "么", relation: "COMPOSE", to: "什么" },
        { from: "吗", relation: "CONTRASTE_AVEC", to: "呢" },
      ],
    },
    production: {
      prompts: [
        {
          instruction:
            "Présentez-vous : dites bonjour et donnez votre nom (utilisez 你好 et 我叫...).",
          hint: "Structure : 你好！我叫 + votre nom。",
          example: {
            chinese: "你好！我叫马克。",
            pinyin: "Nǐ hǎo! Wǒ jiào Mǎkè.",
            translation: "Bonjour ! Je m'appelle Marc.",
          },
        },
        {
          instruction:
            "Demandez le nom de votre interlocuteur, puis demandez s'il est étudiant.",
          hint: "什么 pour la question ouverte, 吗 pour la question oui/non — jamais les deux ensemble.",
          example: {
            chinese: "你叫什么名字？你是学生吗？",
            pinyin: "Nǐ jiào shénme míngzi? Nǐ shì xuésheng ma?",
            translation: "Comment t'appelles-tu ? Es-tu étudiant(e) ?",
          },
        },
      ],
    },
    consolidation: {
      summary:
        "Vous savez saluer, vous présenter, poser une question ouverte (什么) et une question oui/non (吗). Ces 10 mots et 13 caractères entrent maintenant dans votre moteur de révision : ils reviendront au moment optimal calculé par FSRS.",
      reviewWords: ["你好", "你", "我", "叫", "什么", "名字", "是", "学生", "吗", "呢"],
      reviewHanzi: ["你", "好", "我", "叫", "什", "么", "名", "字", "是", "学", "生", "吗", "呢"],
    },
  },
};
