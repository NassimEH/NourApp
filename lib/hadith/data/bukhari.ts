/**
 * Données locales : Sahih Al-Bukhari, Livre 1 - Livre de la Révélation.
 * Source : https://bibliotheque-islamique.fr/hadith/sahih-al-boukhari-01-livre-de-la-revelation/
 */

import type {
  HadithCollection,
  HadithBook,
  HadithChapter,
  HadithRecord,
} from "../types";

const COLLECTION_NAME = "bukhari";
const BOOK_NUMBER = "1";
const CHAPTER_ID = "1";
const BOOK_TITLE_FR = "01 – Livre de la Révélation";
const CHAPTER_TITLE_FR = "Livre de la Révélation";

/** Collection unique (Sahih Al-Bukhari) */
export const LOCAL_COLLECTIONS: HadithCollection[] = [
  {
    name: COLLECTION_NAME,
    hasBooks: true,
    hasChapters: true,
    collection: [
      {
        lang: "en",
        title: "Sahih Al-Bukhari",
        totalHadith: 7,
        totalAvailableHadith: 7,
      },
      {
        lang: "fr",
        title: "Sahih Al-Bukhari",
        totalHadith: 7,
        totalAvailableHadith: 7,
      },
    ],
  },
];

/** Livre 1 – Livre de la Révélation (affiché comme 01 – Livre de la Révélation) */
export const LOCAL_BOOKS: HadithBook[] = [
  {
    bookNumber: BOOK_NUMBER,
    book: [
      { lang: "en", name: "01 – Book of Revelation", numberOfHadith: 7 },
      { lang: "fr", name: BOOK_TITLE_FR, numberOfHadith: 7 },
    ],
  },
];

/** Chapitre 01 du livre 1 (numéroté 01, titre en français) */
export const LOCAL_CHAPTERS: HadithChapter[] = [
  {
    bookNumber: BOOK_NUMBER,
    chapterId: CHAPTER_ID,
    chapter: [
      { lang: "en", chapterNumber: "01", chapterTitle: "Book of Revelation" },
      { lang: "fr", chapterNumber: "01", chapterTitle: CHAPTER_TITLE_FR },
    ],
  },
];

/** Hadiths du chapitre 1 (Livre de la Révélation) */
const HADITHS: HadithRecord[] = [
  {
    collection: COLLECTION_NAME,
    bookNumber: BOOK_NUMBER,
    chapterId: CHAPTER_ID,
    hadithNumber: "1",
    source: "Rapporté par Al-Boukhary dans son Sahih n°1",
    hadith: [
      {
        lang: "ar",
        body: "عن عمر بن الخطاب رضي الله عنه على المنبر قال سمعت رسول الله صلى الله عليه وسلم يقول : إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى، فمن كانت هجرته إلى دنيا يصيبها، أو إلى امرأة ينكحها، فهجرته إلى ما هاجر إليه.‏",
        chapterTitle: CHAPTER_TITLE_FR,
      },
      {
        lang: "fr",
        body: "D'après 'Omar ibn El Khattab du haut du minbar: « J'ai entendu l'Envoyé d'Allah (ﷺ) dire : « Les actions ne valent que par les intentions. Il ne sera donc tenu compte à chaque homme que de ses intentions. Pour celui qui aura émigré en vue de biens terrestres, ou afin de trouver une femme à épouser, l'émigration ne comptera que pour le but qui aura déterminé son voyage.»",
        chapterTitle: CHAPTER_TITLE_FR,
      },
    ],
  },
  {
    collection: COLLECTION_NAME,
    bookNumber: BOOK_NUMBER,
    chapterId: CHAPTER_ID,
    hadithNumber: "2",
    source: "Rapporté par Al-Boukhary dans son Sahih n°2",
    hadith: [
      {
        lang: "ar",
        body: "عن عائشة أم المؤمنين رضى الله عنها أن الحارث بن هشام رضى الله عنه سأل رسول الله صلى الله عليه وسلم فقال يا رسول الله كيف يأتيك الوحى فقال رسول الله صلى الله عليه وسلم ‏ « ‏ أحيانا يأتيني مثل صلصلة الجرس وهو أشده على فيفصم عني وقد وعيت عنه ما قال، وأحيانا يتمثل لي الملك رجلا فيكلمني فأعي ما يقول ‏ »‏‏.‏ قالت عائشة رضى الله عنها ولقد رأيته ينزل عليه الوحى في اليوم الشديد البرد، فيفصم عنه وإن جبينه ليتفصد عرقا‏.‏‏‏.",
        chapterTitle: CHAPTER_TITLE_FR,
      },
      {
        lang: "fr",
        body: "D'après 'Aïcha, la mère des Croyants, El-Harits-ben-Hichâm avait interrogé le Messager (ﷺ) : « Ô Messager d'Allah (ﷺ), comment te vient la Révélation ? », celui-ci répondit : « A certains moments, elle m'arrive pareille au tintement d'une clochette, et c'est pour moi la plus pénible. Puis la Révélation s'interrompt, et alors seulement je saisis ce que l'ange m'a transmis. D'autres fois, l'ange se montre à moi sous une forme humaine, il me parle et je retiens ce qu'il m'a dit.» 'Aïcha ajoute: « Certains jours que le froid était très vif, je vis le Prophète recevoir la Révélation ; au moment où elle cessait, le front du Prophète ruisselait de sueur.»",
        chapterTitle: CHAPTER_TITLE_FR,
      },
    ],
  },
  {
    collection: COLLECTION_NAME,
    bookNumber: BOOK_NUMBER,
    chapterId: CHAPTER_ID,
    hadithNumber: "3",
    source: "Rapporté par Al-Boukhary dans son Sahih n°3",
    hadith: [
      {
        lang: "ar",
        body: "عن عائشة أم المؤمنين، أنها قالت أول ما بدئ به رسول الله صلى الله عليه وسلم من الوحى الرؤيا الصالحة في النوم، فكان لا يرى رؤيا إلا جاءت مثل فلق الصبح، ثم حبب إليه الخلاء، وكان يخلو بغار حراء فيتحنث فيه وهو التعبد الليالي ذوات العدد قبل أن ينزع إلى أهله، ويتزود لذلك، ثم يرجع إلى خديجة، فيتزود لمثلها، حتى جاءه الحق وهو في غار حراء، فجاءه الملك فقال اقرأ‏.‏ قال ‏ »‏ ما أنا بقارئ ‏ »‏‏.‏ قال ‏ »‏ فأخذني فغطني حتى بلغ مني الجهد، ثم أرسلني فقال اقرأ‏.‏ قلت ما أنا بقارئ‏.‏ فأخذني فغطني الثانية حتى بلغ مني الجهد، ثم أرسلني فقال اقرأ‏.‏ فقلت ما أنا بقارئ‏.‏ فأخذني فغطني الثالثة، ثم أرسلني فقال ‏{‏اقرأ باسم ربك الذي خلق * خلق الإنسان من علق * اقرأ وربك الأكرم‏}‏ ‏ »‏‏.‏",
        chapterTitle: CHAPTER_TITLE_FR,
      },
      {
        lang: "fr",
        body: "D'après 'Aïcha (رضى الله عنهما), la mère des Croyants, a dit : « La Révélation débuta chez le Prophète (ﷺ) par de pieuses visions qu'il avait pendant son sommeil. Pas une seule de ces visions ne lui apparut sinon avec une clarté semblable à celle de l'aurore. Plus tard, il se prit à aimer la retraite. Il se retira alors dans la caverne de Hirâ, où il se livra au tahannouts. Ensuite il revenait vers Khadîja et prenait les provisions nécessaires pour une nouvelle retraite. Cela dura jusqu'à ce que la Vérité lui fut enfin apportée dans cette caverne de Hirâ. L'ange vint alors le trouver et lui dit : Lis. — Je ne sais pas lire. Il se saisit de moi, dit il (Muhammad (ﷺ)) et me serra péniblement contre lui puis il me relâcha et dit: Lis. — Je ne sais pas lire. Il se saisit de moi pour la troisième fois, dit il (Muhammad (ﷺ)) et me serra péniblement contre lui puis il me relâcha et dit: « Lis : au nom de ton Seigneur qui a créé. — Il a créé l'homme de sang coagulé. — Lis : et ton Seigneur est le très généreux » [Sourate 96, Al 'Alaq 1 – 3]. En possession de ces versets, le cœur tout palpitant, le Prophète (ﷺ) rentra chez Khadîdja... »",
        chapterTitle: CHAPTER_TITLE_FR,
      },
    ],
  },
  {
    collection: COLLECTION_NAME,
    bookNumber: BOOK_NUMBER,
    chapterId: CHAPTER_ID,
    hadithNumber: "4",
    source: "Rapporté par Al-Boukhary dans son Sahih n°4",
    hadith: [
      {
        lang: "ar",
        body: "عن جابر بن عبد الله الأنصاري، قال وهو يحدث عن فترة الوحى، فقال في حديثه ‏ »‏ بينا أنا أمشي، إذ سمعت صوتا، من السماء، فرفعت بصري فإذا الملك الذي جاءني بحراء جالس على كرسي بين السماء والأرض، فرعبت منه، فرجعت فقلت زملوني‏.‏ فأنزل الله تعالى ‏{‏يا أيها المدثر * قم فأنذر‏}‏ إلى قوله ‏{‏والرجز فاهجر‏}‏ فحمي الوحى وتتابع ‏ »‏‏.‏",
        chapterTitle: CHAPTER_TITLE_FR,
      },
      {
        lang: "fr",
        body: "Jabir ibn Abdallah Al-Ansari (tout en parlant de la période d'interruption dans la révélation) rapporte la tradition suivante : « Tandis que je marchais, dit le Prophète (ﷺ), j'entendis une voix qui venait du ciel. Levant alors les yeux, j'aperçus l'ange qui était venu me trouver à Hirâ ; il était assis sur un trône entre le ciel et la terre. Effrayé à cette vue, je rentrai chez moi en criant : « Enveloppez-moi ! enveloppez-moi ! » Alors Allah me révéla ces versets : « Ô toi qui es enveloppé, lève-toi et menace du châtiment » (sourate Al Mudathir, versets 1 et 2), et continua jusqu'à ces mots : « Et l'idolâtrie, fuis-là » (sourate Al Mudathir, verset 5). Après cela la Révélation reprit avec ardeur et continua sans interruption. »",
        chapterTitle: CHAPTER_TITLE_FR,
      },
    ],
  },
  {
    collection: COLLECTION_NAME,
    bookNumber: BOOK_NUMBER,
    chapterId: CHAPTER_ID,
    hadithNumber: "5",
    source: "Rapporté par Al-Boukhary dans son Sahih n°5",
    hadith: [
      {
        lang: "ar",
        body: "عن سعيد بن جبير، عن ابن عباس، في قوله تعالى ‏{‏لا تحرك به لسانك لتعجل به‏}‏ قال كان رسول الله صلى الله عليه وسلم يعالج من التنزيل شدة، وكان مما يحرك شفتيه فقال ابن عباس فأنا أحركهما لكم كما كان رسول الله صلى الله عليه وسلم يحركهما‏.‏ وقال سعيد أنا أحركهما كما رأيت ابن عباس يحركهما‏.‏ فحرك شفتيه فأنزل الله تعالى ‏{‏لا تحرك به لسانك لتعجل به* إن علينا جمعه وقرآنه‏}‏ قال جمعه له في صدرك، وتقرأه ‏{‏فإذا قرأناه فاتبع قرآنه‏}‏ قال فاستمع له وأنصت ‏{‏ثم إن علينا بيانه‏}‏ ثم إن علينا أن تقرأه‏.‏ فكان رسول الله صلى الله عليه وسلم بعد ذلك إذا أتاه جبريل استمع، فإذا انطلق جبريل قرأه النبي صلى الله عليه وسلم كما قرأه‏.",
        chapterTitle: CHAPTER_TITLE_FR,
      },
      {
        lang: "fr",
        body: "D'après Sa'îd ibn Jubair, voici comment Ibn 'Abbâs commentait le verset du Coran : « N'agite pas ta langue afin de hâter ainsi la Révélation » (sourate 75, verset 16). « L'Envoyé d'Allah (ﷺ) essayait de calmer la souffrance que lui inspirait la Révélation, et c'est dans ce but qu'il remuait les lèvres. » Ce disant, Ibn-'Abbas remuait les lèvres et ajoutait : « Regarde, je les remue de la même façon que le faisait l'Envoyé d'Allah (ﷺ). » [...] Ce fut dans ces circonstances qu'Allah fit descendre ce verset : « N'agite pas ta langue afin de hâter ainsi la Révélation. — C'est à nous qu'incombe l'assemblage de ces textes et leur récitation » (sourate 75, verset 16 et 17). Après cette Révélation, chaque fois que Gabriel venait trouver l'Envoyé d'Allah (ﷺ), celui-ci l'écoutait, puis dès que Gabriel était parti, il récitait le Coran exactement comme l'ange l'avait récité.",
        chapterTitle: CHAPTER_TITLE_FR,
      },
    ],
  },
  {
    collection: COLLECTION_NAME,
    bookNumber: BOOK_NUMBER,
    chapterId: CHAPTER_ID,
    hadithNumber: "6",
    source: "Rapporté par Al-Boukhary dans son Sahih n°6",
    hadith: [
      {
        lang: "ar",
        body: "عن ابن عباس، قال كان رسول الله صلى الله عليه وسلم أجود الناس، وكان أجود ما يكون في رمضان حين يلقاه جبريل، وكان يلقاه في كل ليلة من رمضان فيدارسه القرآن، فلرسول الله صلى الله عليه وسلم أجود بالخير من الريح المرسلة‏ »‏‏.‏",
        chapterTitle: CHAPTER_TITLE_FR,
      },
      {
        lang: "fr",
        body: "D'après Ibn 'Abbâs : nul n'était généreux à l'égal de l'Envoyé d'Allah (ﷺ), et cette générosité se manifestait surtout durant le mois de Ramadân, à la suite de ses entrevues avec Gabriel qui venait chaque nuit lui enseigner le Coran. À ce moment-là l'Envoyé d'Allah (ﷺ) était plus généreux que le vent envoyé par Allah (c'est-à-dire les vents qui amènent la pluie).",
        chapterTitle: CHAPTER_TITLE_FR,
      },
    ],
  },
  {
    collection: COLLECTION_NAME,
    bookNumber: BOOK_NUMBER,
    chapterId: CHAPTER_ID,
    hadithNumber: "7",
    source: "Rapporté par Al-Boukhary dans son Sahih n°7",
    hadith: [
      {
        lang: "ar",
        body: "عن عبد الله بن عباس، أخبره أن أبا سفيان بن حرب أخبره أن هرقل أرسل إليه في ركب من قريش وكانوا تجارا بالشأم في المدة التي كان رسول الله صلى الله عليه وسلم ماد فيها أبا سفيان وكفار قريش... فقال للترجمان قل له سألتك عن نسبه، فذكرت أنه فيكم ذو نسب، فكذلك الرسل تبعث في نسب قومها... وإن كان ما تقول حقا فسيملك موضع قدمى هاتين...",
        chapterTitle: CHAPTER_TITLE_FR,
      },
      {
        lang: "fr",
        body: "D'après 'Abdallah ibn 'Abbas que Abou-Sofyân-ben-Harb a raconté qu'il fut mandé par Héraclius à l'époque où il se trouvait en Syrie à la tête d'une caravane de marchands qoraïchites. Héraclius l'interrogea sur le Prophète (ﷺ). Abou-Sofyân dit : « Par Allah ! si je n'avais eu honte de voir relever mes mensonges par mes compagnons, j'aurais hardiment menti sur son compte. » Parmi les réponses : il ordonne d'adorer Allah seul, de ne Lui associer aucun être, de prier, d'être de bonne foi, d'avoir des mœurs pures. Héraclius dit à son interprète : « Si donc ce que tu dis est vrai, cet homme conquerra cet endroit même que foulent mes deux pieds. Je savais d'ailleurs que cet homme allait bientôt paraître... »",
        chapterTitle: CHAPTER_TITLE_FR,
      },
    ],
  },
];

export function getLocalCollections(): HadithCollection[] {
  return LOCAL_COLLECTIONS;
}

export function getLocalBooks(collectionName: string): HadithBook[] {
  if (collectionName.toLowerCase() !== COLLECTION_NAME) return [];
  return LOCAL_BOOKS;
}

export function getLocalChapters(
  collectionName: string,
  bookNumber: string
): HadithChapter[] {
  if (
    collectionName.toLowerCase() !== COLLECTION_NAME ||
    bookNumber !== BOOK_NUMBER
  )
    return [];
  return LOCAL_CHAPTERS;
}

export function getLocalHadithsByChapter(
  collectionName: string,
  bookNumber: string,
  chapterId: string
): HadithRecord[] {
  if (
    collectionName.toLowerCase() !== COLLECTION_NAME ||
    bookNumber !== BOOK_NUMBER ||
    chapterId !== CHAPTER_ID
  )
    return [];
  return HADITHS;
}

export function getLocalHadithDetail(
  collectionName: string,
  hadithNumber: string
): HadithRecord | null {
  if (collectionName.toLowerCase() !== COLLECTION_NAME) return null;
  return HADITHS.find((h) => h.hadithNumber === hadithNumber) ?? null;
}
