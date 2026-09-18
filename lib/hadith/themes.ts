import type { FeatherIconName } from "@/lib/app-icons";

export type HadithThemeId =
  | "faith"
  | "prayer"
  | "character"
  | "knowledge"
  | "family"
  | "charity";

export type HadithThemePreviewLocale = "fr" | "en" | "ar";

export type HadithThemeRef = {
  collection: string;
  hadithNumber: string;
  preview: { fr: string; en: string; ar: string };
};

export type HadithTheme = {
  id: HadithThemeId;
  titleKey: string;
  subtitleKey: string;
  icon: FeatherIconName;
  refs: HadithThemeRef[];
};

export const HADITH_THEMES: HadithTheme[] = [
  {
    id: "faith",
    titleKey: "screens.hadithThemeFaith",
    subtitleKey: "screens.hadithThemeFaithShort",
    icon: "heart",
    refs: [
      {
        collection: "bukhari",
        hadithNumber: "1",
        preview: {
          fr: "« Les actes ne valent que par les intentions, et chaque homme n'a que ce qu'il a eu l'intention de faire. »",
          en: "« Actions are but by intention, and every person shall have only that which he intended. »",
          ar: "« إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى. »",
        },
      },
      {
        collection: "muslim",
        hadithNumber: "35",
        preview: {
          fr: "« La foi comporte plus de soixante-dix branches. Le plus élevé est l'attestation qu'il n'y a de divinité qu'Allah. »",
          en: "« Faith has over seventy branches. The highest is declaring that there is no god but Allah. »",
          ar: "« الإيمان بضع وسبعون شعبة، أعلاها قول لا إله إلا الله. »",
        },
      },
      {
        collection: "muslim",
        hadithNumber: "45",
        preview: {
          fr: "« Aucun de vous ne croit vraiment tant qu'il n'aime pour son frère ce qu'il aime pour lui-même. »",
          en: "« None of you truly believes until he loves for his brother what he loves for himself. »",
          ar: "« لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه. »",
        },
      },
      {
        collection: "muslim",
        hadithNumber: "47",
        preview: {
          fr: "« Celui qui croit en Allah et au Jour dernier, qu'il dise du bien ou qu'il se taise. »",
          en: "« Whoever believes in Allah and the Last Day should speak good or remain silent. »",
          ar: "« من كان يؤمن بالله واليوم الآخر فليقل خيرا أو ليصمت. »",
        },
      },
    ],
  },
  {
    id: "prayer",
    titleKey: "screens.hadithThemePrayer",
    subtitleKey: "screens.hadithThemePrayerShort",
    icon: "sun",
    refs: [
      {
        collection: "muslim",
        hadithNumber: "82",
        preview: {
          fr: "« La prière est la colonne de la religion. Quiconque l'élève a établi la religion, et quiconque la détruit a détruit la religion. »",
          en: "« Prayer is the pillar of religion. Whoever upholds it upholds religion, and whoever abandons it abandons religion. »",
          ar: "« الصلاة عمود الدين، من أقامها أقام الدين، ومن هدمها هدم الدين. »",
        },
      },
      {
        collection: "bukhari",
        hadithNumber: "528",
        preview: {
          fr: "« La prière est la première chose pour laquelle le serviteur sera interrogé le Jour de la Résurrection. »",
          en: "« The first deed for which a servant will be questioned on the Day of Resurrection is prayer. »",
          ar: "« أول ما يحاسب به العبد يوم القيامة الصلاة. »",
        },
      },
      {
        collection: "abudawud",
        hadithNumber: "425",
        preview: {
          fr: "« La prière en congrégation vaut vingt-cinq degrés de plus que la prière à la maison ou au marché. »",
          en: "« Congregational prayer is twenty-five degrees better than prayer at home or in the marketplace. »",
          ar: "« صلاة الجماعة أفضل من صلاة الرجل في بيته وفي سوقه بخمس وعشرين درجة. »",
        },
      },
      {
        collection: "tirmidhi",
        hadithNumber: "170",
        preview: {
          fr: "« Celui qui prie le Fajr est sous la protection d'Allah. »",
          en: "« Whoever prays Fajr is under the protection of Allah. »",
          ar: "« من صلى الفجر فهو في ذمة الله. »",
        },
      },
    ],
  },
  {
    id: "character",
    titleKey: "screens.hadithThemeCharacter",
    subtitleKey: "screens.hadithThemeCharacterShort",
    icon: "shield",
    refs: [
      {
        collection: "muslim",
        hadithNumber: "41",
        preview: {
          fr: "« Le musulman est celui dont les musulmans sont à l'abri de sa langue et de sa main. »",
          en: "« The Muslim is the one from whose tongue and hand the Muslims are safe. »",
          ar: "« المسلم من سلم المسلمون من لسانه ويده. »",
        },
      },
      {
        collection: "muslim",
        hadithNumber: "2594",
        preview: {
          fr: "« La douceur n'est jamais présente dans une chose sans l'embellir, et n'est jamais absente d'une chose sans l'enlaidir. »",
          en: "« Gentleness is never present in anything without beautifying it, and never absent from anything without disfiguring it. »",
          ar: "« إن الرفق لا يكون في شيء إلا زانه، ولا ينزع من شيء إلا شانه. »",
        },
      },
      {
        collection: "bukhari",
        hadithNumber: "10",
        preview: {
          fr: "« La religion est la sincérité. » Nous avons dit : « Envers qui ? » Il dit : « Envers Allah, Son Livre, Son Messager, les dirigeants des musulmans et leurs communautés. »",
          en: "« Religion is sincerity. » We asked: « Toward whom? » He said: « Toward Allah, His Book, His Messenger, the leaders of the Muslims, and their common people. »",
          ar: "« الدين النصيحة. » قلنا: « لمن؟ » قال: « لله ولكتابه ولرسوله ولأئمة المسلمين وعامتهم. »",
        },
      },
      {
        collection: "tirmidhi",
        hadithNumber: "1980",
        preview: {
          fr: "« Les croyants les plus parfaits dans leur foi sont ceux qui ont le meilleur caractère. »",
          en: "« The most perfect believers in faith are those with the best character. »",
          ar: "« أكمل المؤمنين إيمانا أحسنهم خلقا. »",
        },
      },
    ],
  },
  {
    id: "knowledge",
    titleKey: "screens.hadithThemeKnowledge",
    subtitleKey: "screens.hadithThemeKnowledgeShort",
    icon: "book-open",
    refs: [
      {
        collection: "muslim",
        hadithNumber: "2699",
        preview: {
          fr: "« Quiconque emprunte un chemin à la recherche de la science, Allah lui facilitera un chemin vers le Paradis. »",
          en: "« Whoever follows a path in pursuit of knowledge, Allah will make easy for him a path to Paradise. »",
          ar: "« من سلك طريقا يلتمس فيه علما، سهل الله له به طريقا إلى الجنة. »",
        },
      },
      {
        collection: "bukhari",
        hadithNumber: "5027",
        preview: {
          fr: "« Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne. »",
          en: "« The best among you are those who learn the Qur'an and teach it. »",
          ar: "« خيركم من تعلم القرآن وعلمه. »",
        },
      },
      {
        collection: "ibnmajah",
        hadithNumber: "224",
        preview: {
          fr: "« La recherche du savoir est une obligation pour tout musulman. »",
          en: "« Seeking knowledge is an obligation upon every Muslim. »",
          ar: "« طلب العلم فريضة على كل مسلم. »",
        },
      },
      {
        collection: "tirmidhi",
        hadithNumber: "2682",
        preview: {
          fr: "« L'ange déploie ses ailes pour le chercheur de science, content de ce qu'il fait. »",
          en: "« The angel spreads its wings for the seeker of knowledge, pleased with what he is doing. »",
          ar: "« إن الملائكة لتضع أجنحتها لطالب العلم رضا بما يصنع. »",
        },
      },
    ],
  },
  {
    id: "family",
    titleKey: "screens.hadithThemeFamily",
    subtitleKey: "screens.hadithThemeFamilyShort",
    icon: "users",
    refs: [
      {
        collection: "muslim",
        hadithNumber: "45",
        preview: {
          fr: "« Aucun de vous ne croit vraiment tant qu'il n'aime pour son frère ce qu'il aime pour lui-même. »",
          en: "« None of you truly believes until he loves for his brother what he loves for himself. »",
          ar: "« لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه. »",
        },
      },
      {
        collection: "tirmidhi",
        hadithNumber: "1162",
        preview: {
          fr: "« Le Paradis est aux pieds des mères. »",
          en: "« Paradise lies at the feet of mothers. »",
          ar: "« الجنة تحت أقدام الأمهات. »",
        },
      },
      {
        collection: "abudawud",
        hadithNumber: "5120",
        preview: {
          fr: "« Le meilleur d'entre vous est celui qui est le meilleur envers sa famille. »",
          en: "« The best of you is the one who is best to his family. »",
          ar: "« خيركم خيركم لأهله. »",
        },
      },
      {
        collection: "bukhari",
        hadithNumber: "5971",
        preview: {
          fr: "« Celui qui n'est pas reconnaissant envers les gens n'est pas reconnaissant envers Allah. »",
          en: "« He who is not grateful to people is not grateful to Allah. »",
          ar: "« من لا يشكر الناس لا يشكر الله. »",
        },
      },
    ],
  },
  {
    id: "charity",
    titleKey: "screens.hadithThemeCharity",
    subtitleKey: "screens.hadithThemeCharityShort",
    icon: "gift",
    refs: [
      {
        collection: "muslim",
        hadithNumber: "2588",
        preview: {
          fr: "« L'aumône ne diminue pas la richesse. »",
          en: "« Charity does not decrease wealth. »",
          ar: "« ما نقصت صدقة من مال. »",
        },
      },
      {
        collection: "bukhari",
        hadithNumber: "1416",
        preview: {
          fr: "« L'aumône est une preuve. »",
          en: "« Charity is proof. »",
          ar: "« الصدقة برهان. »",
        },
      },
      {
        collection: "tirmidhi",
        hadithNumber: "664",
        preview: {
          fr: "« Protégez-vous du Feu ne serait-ce qu'avec une demi-datte en aumône. »",
          en: "« Protect yourselves from the Fire, even with half a date given in charity. »",
          ar: "« اتقوا النار ولو بشق تمرة. »",
        },
      },
      {
        collection: "muslim",
        hadithNumber: "1009",
        preview: {
          fr: "« Chaque joint de la personne doit faire une aumône chaque jour. »",
          en: "« Every joint of a person must perform charity each day. »",
          ar: "« على كل سلامى من الناس عليه صدقة كل يوم. »",
        },
      },
    ],
  },
];

export function getThemePreview(
  ref: HadithThemeRef,
  locale: HadithThemePreviewLocale
): string {
  return ref.preview[locale];
}

export function getHadithThemes(): HadithTheme[] {
  return HADITH_THEMES;
}

export function getHadithThemeById(id: string): HadithTheme | undefined {
  return HADITH_THEMES.find((theme) => theme.id === id);
}
