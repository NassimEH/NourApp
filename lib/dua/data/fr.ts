/**
 * Données locales des invocations (duas) et dhikr en français.
 * Source : Citadelle du musulman / apprendre-larabe-facilement.com
 */

import type { DuaCategory, DuaItem, DuaDetail } from "../types";

/** Catégories françaises avec slugs utilisés dans l'app */
export const LOCAL_CATEGORIES_FR: DuaCategory[] = [
  { id: "invocations-du-matin", name: "Invocations du matin", slug: "invocations-du-matin" },
  { id: "invocations-du-soir", name: "Invocations du soir", slug: "invocations-du-soir" },
  { id: "doua-apres-priere", name: "Doua après la prière", slug: "doua-apres-priere" },
  { id: "doua-avant-manger", name: "Doua avant de manger", slug: "doua-avant-manger" },
  { id: "doua-avant-dormir", name: "Doua avant de dormir", slug: "doua-avant-dormir" },
  { id: "invocations-voyage", name: "Invocations du voyage", slug: "invocations-voyage" },
  { id: "doua-apres-adhan", name: "Invocation après l'adhan", slug: "doua-apres-adhan" },
  { id: "doua-protection", name: "Doua de protection", slug: "doua-protection" },
  { id: "doua-tristesse", name: "Doua tristesse / angoisse", slug: "doua-tristesse" },
  { id: "doua-mosquee", name: "Invocations mosquée", slug: "doua-mosquee" },
  { id: "doua-quotidien", name: "Invocations quotidiennes", slug: "doua-quotidien" },
];

/** Invocations par slug de catégorie. Chaque item a un id unique dans sa catégorie (1, 2, 3...). */
const DUAS_BY_SLUG: Record<string, DuaItem[]> = {
  "invocations-du-matin": [
    {
      id: 1,
      title: "Réciter Âyatu-l-Kursî",
      translation:
        "Allah ! Point de divinité à part Lui, le Vivant, Celui qui n'a besoin de rien et dont toute chose dépend (al-Qayyûm). Ni somnolence ni sommeil ne Le saisissent. À Lui appartient tout ce qui est dans les cieux et sur la Terre. Qui peut intercéder auprès de Lui sans Sa permission ? Il connaît leur passé et leur futur. Et, de Sa science, ils n'embrassent que ce qu'Il veut. Son Kursî (Piédestal) déborde les cieux et la Terre et leur garde ne Lui coûte aucune peine. Et Il est le Très Haut, l'Immense.",
      arabic:
        "اللهُ لاَ إِلَهَ إِلاَّ هُوَ الحَيُّ القَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَ لاَ نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَ مَا فِي الأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَ مَا خَلْفَهُمْ وَ لاَ يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلاَّ بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَ الأَرْضَ وَ لاَ يَئُودُهُ حِفْظُهُمَا وَ هُوَ العَلَيُّ العَظِيمُ",
      latin: "Allâhu lâ ilâha illâ huwa-l-hayyu-l-qayyûm...",
      source: "Sourate Al-Baqarah, verset 255. Sahîh Al-Kalim At-Tayyib n° 22.",
    },
    {
      id: 2,
      title: "Les trois dernières sourates",
      translation: "Réciter les trois dernières sourates du Coran : Sourate al-Ikhlâs, al-Falaq, an-Nâs.",
      source: "Sahîh At-Tirmidhî n° 3575.",
    },
    {
      id: 3,
      title: "Sourate Al-Ikhlâs (3 fois)",
      translation:
        "Dis : Il est Allah, Unique. Allah Le Seul à être imploré pour ce que nous désirons. Il n'a jamais engendré et n'a pas été engendré non plus. Et nul n'est égal à Lui.",
      arabic: "قُلْ هُوَ اللهُ أَحَدٌ ۞ اللهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
      latin: "Qul huwa Allâhu ahad, Allâhu-s-Samad, lam yalid wa lam yûlad, wa lam yakun lahu kufuwan ahad.",
      source: "Sourate 112.",
    },
    {
      id: 4,
      title: "Sourate Al-Falaq (3 fois)",
      translation:
        "Dis : Je cherche protection auprès du Seigneur de l'aube naissante, contre le mal des êtres qu'Il a créés, contre le mal de l'obscurité quand elle s'approfondit, contre le mal de celles qui soufflent sur les nœuds, et contre le mal de l'envieux quand il envie.",
      arabic:
        "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۞ مِنْ شَرِّ مَا خَلَقَ ۞ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۞ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۞ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
      latin: "Qul a'ûdhu bi-rabbi-l-falaq...",
      source: "Sourate 113.",
    },
    {
      id: 5,
      title: "Sourate An-Nâs (3 fois)",
      translation:
        "Dis : Je cherche protection auprès du Seigneur des hommes, le Souverain des hommes, Dieu des hommes, contre le mal du mauvais conseiller furtif, qui souffle le mal dans les poitrines des hommes, qu'il soit djinn ou être humain.",
      arabic:
        "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۞ مَلِكِ النَّاسِ ۞ إِلَهِ النَّاسِ ۞ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۞ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۞ مِنَ الْجِنَّةِ وَالنَّاسِ",
      latin: "Qul a'ûdhu bi-rabbi-n-nâs...",
      source: "Sourate 114.",
    },
    {
      id: 6,
      title: "Au nom d'Allah (3 fois)",
      translation:
        "Au nom d'Allah, tel qu'en compagnie de Son Nom rien sur Terre ni au ciel ne peut nuire, Lui l'Audient, l'Omniscient.",
      arabic:
        "بِسْمِ اللهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَ لاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ العَلِيمُ",
      latin: "Bi-smi-llâhi-lladhî lâ yadurru ma'a-smihi shayun fi-l-ardi wa lâ fi-s-samâi wa huwa-s-Samî'-ul-'Alîm.",
      source: "Sahîh At-Tirmidhî n° 3388.",
    },
    {
      id: 7,
      title: "Ô Allah, c'est par Toi que nous nous retrouvons au matin",
      translation:
        "Ô Allah ! C'est par Toi que nous nous retrouvons au matin et c'est par Toi que nous nous retrouvons au soir. C'est par Toi que nous vivons et c'est par Toi que nous mourons et c'est vers Toi que se fera la Résurrection.",
      arabic:
        "اللَّهُمَّ بِكَ أَصْبَحْنَا وَ بِكَ أَمْسَيْنَا، وَ بِكَ نَحْيَا وَ بِكَ نَمُوتُ وَ إِلَيْكَ النُّشُورُ",
      latin: "Allâhumma bika asbahnâ, wa bika amsaynâ, wa bika nahyâ, wa bika namût, wa ilayka-n-nushûr.",
      source: "As-Sahîhah n° 262.",
    },
    {
      id: 8,
      title: "Nous voilà au matin et le règne appartient à Allah",
      translation:
        "Nous voilà au matin et le règne appartient à Allah. Louange à Allah, Il n'y a aucune divinité [digne d'être adorée] en dehors d'Allah, Seul, sans associé. À Lui la royauté, à Lui la louange et Il est capable de toute chose. Seigneur ! Je Te demande le bien que contient ce jour et le bien qui vient après. Et je cherche refuge auprès de Toi contre le mal que contient ce jour et le mal qui vient après. Seigneur ! Je cherche refuge auprès de Toi contre la paresse et les maux de la vieillesse. Je cherche refuge auprès de Toi contre le châtiment de l'Enfer et contre les tourments de la tombe.",
      arabic:
        "أَصْبَحْنَا وَ أَصْبَحَ المُلْكُ للهِ وَ الحَمْدُ للهِ ، لاَ إلَهَ إلاَّ اللهُ وَحدَهُ لاَشَرِيكَ لَهُ، لَهُ المُلْكُ وَ لَهُ الحَمْدُ، وَ هُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا اليَوْمِ وَ خَيْرَ مَا بَعْدَهُ، وَ أَعُوذُ بِكَ مِنْ شَرِّ هَذَا اليَوْمِ وَ شَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الكَسَلِ وَ سُوءِ الكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَ عَذَابٍ فِي القَبْرِ.",
      latin: "Asbahnâ wa asbaha-l-mulku li-llâhi wa-l-hamduli-llâh. Lâ ilâha illâ llâhu wahdahu lâ sharîka lah...",
      source: "Sahîh Muslim n° 2723.",
    },
    {
      id: 9,
      title: "Nous voilà au matin et la Royauté appartient à Allah",
      translation:
        "Nous voilà au matin et la Royauté appartient à Allah, le Seigneur de l'Univers. Ô Allah ! Je Te demande le bien de ce jour : ce qu'il contient comme conquêtes, victoires, lumière, bénédiction et guidée. Je cherche refuge auprès de Toi contre le mal qu'il contient et le mal qui vient après lui.",
      arabic:
        "أَصْبَحْنَا وَ أَصْبَحَ المُلْكُ للهِ رَبِّ العَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا اليَوْمِ، فَتْحَهُ، وَ نَصْرَهُ، وَ نُورَهُ وَبَرَكَتَهُ، و َهُدَاهُ، وَ أَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهِ وَ شَرِّ مَا بَعْدَهُ.",
      latin: "Asbahnâ wa asbaha-l-mulku li-llâhi Rabbi-l-'âlamîn. Allâhumma innî asaluka khayra hâdha-l-yawmi...",
      source: "Sahîh Al-Jâmi' n° 352.",
    },
    {
      id: 10,
      title: "Ô Allah ! Tu es mon Seigneur",
      translation:
        "Ô Allah ! Tu es mon Seigneur. Il n'y a aucune divinité [digne d'être adorée] en dehors de Toi. Tu m'as créé et je suis Ton serviteur, je me conforme autant que je peux à mon engagement et à ma promesse vis-à-vis de Toi. Je cherche refuge auprès de Toi contre le mal que j'ai commis. Je reconnais Ton bienfait à mon égard et je reconnais mon péché. Pardonne-moi donc, en effet nul autre que Toi ne pardonne les péchés.",
      arabic:
        "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَ أَنَا عَبْدُكَ، وَ أَنَا عَلَى عَهْدِكَ وَ وَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَ َأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ",
      latin: "Allâhumma anta Rabbî, lâ ilâha illâ ant. Khalaqtanî wa ana 'abduk...",
      source: "Sahîh Al-Bukhârî n° 5947.",
    },
    {
      id: 11,
      title: "Ô Allah ! Je te demande le salut",
      translation:
        "Ô Allah ! Je te demande le salut dans cette vie et dans l'au-delà. Ô Allah ! Je Te demande le pardon et le salut dans ma religion, ma vie, ma famille et mes biens. Ô Allah ! Cache mes défauts et mets-moi à l'abri de toutes mes craintes. Ô Allah ! Protège-moi par devant, par derrière, sur ma droite, sur ma gauche et au-dessus de moi. Je me mets sous la protection de Ta grandeur pour ne pas être enseveli.",
      arabic:
        "اللَّهُمَّ إِنِّي أَسْأَلُكَ العَافِيةَ فِي الدُّنْيَا وَ الآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ العَفْوَ وَ العَافِيةَ فِي دِينِي وَ دُنْيَايَ وَ أَهْلِي وَ مَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَ آمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَ مِنْ خَلْفِي وَ عَنْ يَمِينِي وَ عَنْ شِمَالِي، وَ مِنْ فَوْقِي، وَ أَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي",
      latin: "Allâhumma innî asaluka-l-'âfiyata fi-d-duniyâ wa-l-âkhirah...",
      source: "Sahîh Abû Dâwûd n°5074.",
    },
    {
      id: 12,
      title: "Ô Toi le Vivant, Celui qui n'a besoin de rien",
      translation:
        "Ô Toi le Vivant, Celui qui n'a besoin de rien et dont toute chose dépend, j'implore secours auprès de Ta miséricorde. Améliore ma situation en tout point et ne me laisse pas à mon propre sort ne serait-ce le temps d'un clin d'œil.",
      arabic:
        "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَ لاَ تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
      latin: "Yâ Hayyû yâ Qayyûmu bi-rahmatika astaghîth. Aslih lî shanî kullah, wa lâ takilnî ilâ nafsî tarfata 'ayn.",
      source: "Sahîh At-Targhîb wa-t-Tarhîb n°661.",
    },
    {
      id: 13,
      title: "Il n'y a aucune divinité en dehors d'Allah (unicité)",
      translation:
        "Il n'y a aucune divinité [digne d'être adorée] en dehors d'Allah, Seul, sans associé. À Lui la royauté, à Lui la louange et Il est capable de toute chose.",
      arabic:
        "لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَشَرِيكَ لَهُ، لَهُ المُلْكُ وَ لَهُ الحَمْدُ، وَ هُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
      latin: "Lâ ilâha illa-llâhu wahdahu lâ sharîka lah. Lahu-l-mulku wa lahu-l-hamdu, wa huwa 'alâ kulli shayin Qadîr.",
      source: "Sahîh Abû Dâwûd n°5077.",
    },
    {
      id: 14,
      title: "Ô Allah ! Préserve mon corps (3 fois)",
      translation:
        "Ô Allah ! Préserve mon corps. Ô Allah ! Préserve mon ouïe. Ô Allah ! Préserve ma vue. Il n'y a aucune divinité [digne d'être adorée] en dehors de Toi. Ô Allah ! Je cherche refuge auprès de Toi contre la mécréance et la pauvreté. Je me mets sous Ta protection contre les tourments de la tombe. Il n'y a aucune divinité [digne d'être adorée] en dehors de Toi.",
      arabic:
        "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لاَ إِلَهَ إِلاَّ أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الكُفْرِ، وَ الفَقْرِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ القَبْرِ، لاَ إِلَهَ إِلاَّ أَنْتَ",
      latin: "Allâhumma 'âfinî fî badanî. Allâhumma 'âfinî fî sam'î. Allâhumma 'âfinî fî basarî...",
      source: "Sahîh Abû Dâwûd n°5090.",
    },
    {
      id: 15,
      title: "Ô Allah ! Je Te demande un savoir utile",
      translation: "Ô Allah ! Je Te demande [de m'accorder] un savoir utile, une subsistance licite et des œuvres que Tu agrées.",
      arabic:
        "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْماً نَافِعاً، وَ رِزْقاً طَيِّباً، وَ عَمَلاً مُتَقَبَّلاً",
      latin: "Allâhumma innî asaluka 'ilman nâfi'â, wa rizqan tayyibâ, wa 'amalan mutaqabbalâ.",
      source: "Sahîh Ibn Mâjah n° 925.",
    },
    {
      id: 16,
      title: "Nous voici au matin, en conformité avec l'Islam",
      translation:
        "Nous voici au matin, en conformité avec la saine disposition qu'est l'Islam, avec la parole du monothéisme, avec la religion de notre Prophète Mohammed et sur la voie de notre père Ibrâhîm qui vouait un culte exclusif à Allah, soumis à Lui, et n'était point du nombre des polythéistes.",
      arabic:
        "أَصْبَحْنَا عَلَى فِطْرَةِ الإِسْلاَمِ، وَ عَلَى كَلِمَةِ الإِخْلاَصِ، وَ عَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ وَ عَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفاً مُسْلِماً وَ مَا كَانَ مِنَ المُشْرِكِينَ",
      latin: "Asbahna 'alâ fitrati-l-islâm, wa 'alâ kalimati-l-ikhlâs...",
      source: "As-Sahîhah n° 2989.",
    },
    {
      id: 17,
      title: "J'agrée Allah comme Seigneur",
      translation: "J'agrée Allah comme Seigneur, l'Islam comme religion et Muhammad comme prophète.",
      arabic: "رَضِيتُ بِاللهِ رَبّاً وَ بِالإِسْلاَمِ دِيناً وَ بِمُحَمَّدٍ نَبِيّاً",
      latin: "Radîtu bi-llâhi rabban wa bi-l-islâmi dînan wa bi-Muhammadin nabiyyâ.",
      source: "As-Sahîhah n° 334.",
    },
    {
      id: 18,
      title: "Gloire, pureté et louange à Allah (3 fois)",
      translation:
        "Gloire, pureté et louange à Allah, autant que le nombre de Ses créatures, autant de fois qu'il le faut pour Le satisfaire, d'un nombre égal au poids de Son Trône et au nombre indéterminé de Ses paroles.",
      arabic:
        "سُبْحَانَ اللهِ وَ بِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَ مِدَادَ كَلِمَاتِهِ",
      latin: "Subhâna-llâhi wa bi-hamdih, 'adada khalqih, wa ridâ nafsih, wa zinata 'arshih, wa midâda kalimâtih.",
      source: "Sahîh Muslim n° 2090.",
    },
    {
      id: 19,
      title: "Gloire, pureté et louange à Allah (100 fois)",
      translation: "Gloire, pureté et louange à Allah.",
      arabic: "سُبْحَانَ اللهِ وَ بِحَمْدِهِ",
      latin: "Subhâna-llâhi wa bi-hamdih.",
      source: "Sahîh Muslim n° 2692.",
    },
    {
      id: 20,
      title: "Il n'y a aucune divinité en dehors d'Allah (10 fois)",
      translation:
        "Il n'y a aucune divinité [digne d'être adorée] en dehors d'Allah, Seul, sans associé. À Lui la royauté, à Lui la louange, Il donne la vie et la mort et Il est capable de toute chose.",
      arabic:
        "لاَ إِلَهَ إِلاَّ اللهُ، وَحْدَهُ لاَشَرِيكَ لَهُ، لَهُ المُلْكُ وَ لَهُ الحَمْدُ، يُحْيِي وَ يُمِيتُ وَ هُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
      latin: "Lâ ilâha illa-llâhu wahdahu lâ sharîka lah. Lahu-l-mulku wa lahu-l-hamd, yuhyî wa yumît, wa huwa 'alâ kulli shayin Qadîr.",
      source: "As-Sahîhah n° 2563.",
    },
    {
      id: 21,
      title: "Istighfâr, Tasbîh, Hamd, Takbîr, Tahlîl (100 fois chacun)",
      translation:
        "Je demande pardon à Allah (100 fois). Gloire et pureté à Allah (100 fois). Louange à Allah (100 fois). Allah est le Plus Grand (100 fois). Il n'y a aucune divinité [digne d'être adorée] en dehors d'Allah, Seul, sans associé. À Lui la royauté, à Lui la louange et Il est capable de toute chose (100 fois).",
      arabic:
        "أَسْتَغْفِرُ اللهَ. سُبْحَانَ اللهِ. الحَمْدُ للهِ. اللهُ أَكْبَرُ. لاَ إِلَهَ إِلاَّ اللهُ، وَحْدَهُ لاَشَرِيكَ لَهُ، لَهُ المُلْكُ وَ لَهُ الحَمْدُ وَ هُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
      latin: "Astaghfiru-llâh. Subhâna-llâh. Al-hamdu li-llâh. Allâhu akbar. Lâ ilâha illa-llâhu wahdahu lâ sharîka lah...",
      source: "As-Sahîhah n° 1600 & Sahîh At-Targhîb wa-t-Tarhîb n°658.",
    },
  ],

  "invocations-du-soir": [
    {
      id: 1,
      title: "Réciter Âyatu-l-Kursî",
      translation:
        "Allah ! Point de divinité à part Lui, le Vivant, Celui qui n'a besoin de rien et dont toute chose dépend. Ni somnolence ni sommeil ne Le saisissent. À Lui appartient tout ce qui est dans les cieux et sur la Terre...",
      arabic:
        "اللهُ لاَ إِلَهَ إِلاَّ هُوَ الحَيُّ القَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَ لاَ نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَ مَا فِي الأَرْضِ...",
      source: "Sahîh Al-Kalim At-Tayyib n° 22.",
    },
    {
      id: 2,
      title: "Les trois dernières sourates",
      translation: "Réciter les trois dernières sourates du Coran : Sourate al-Ikhlâs, al-Falaq, an-Nâs.",
      source: "Sahîh At-Tirmidhî n° 3575.",
    },
    {
      id: 3,
      title: "Sourate Al-Ikhlâs (3 fois)",
      translation: "Dis : Il est Allah, Unique. Allah Le Seul à être imploré pour ce que nous désirons...",
      arabic: "قُلْ هُوَ اللهُ أَحَدٌ ۞ اللهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
      source: "Sourate 112.",
    },
    {
      id: 4,
      title: "Sourate Al-Falaq (3 fois)",
      translation: "Dis : Je cherche protection auprès du Seigneur de l'aube naissante...",
      arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۞ مِنْ شَرِّ مَا خَلَقَ...",
      source: "Sourate 113.",
    },
    {
      id: 5,
      title: "Au nom d'Allah (3 fois)",
      translation:
        "Au nom d'Allah, tel qu'en compagnie de Son Nom rien sur Terre ni au ciel ne peut nuire, Lui l'Audient, l'Omniscient.",
      arabic:
        "بِسْمِ اللهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَ لاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ العَلِيمُ",
      latin: "Bi-smi-llâhi-lladhî lâ yadurru ma'a-smihi shayun fi-l-ardi wa lâ fi-s-samâi wa huwa-s-Samî'-ul-'Alîm.",
      source: "Sahîh At-Tirmidhî n° 3388.",
    },
    {
      id: 6,
      title: "Protection par les paroles parfaites d'Allah (3 fois)",
      translation: "Je me mets sous la protection des paroles parfaites d'Allah contre le mal qu'Il a créé.",
      arabic: "أَعُوذُ بِكلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
      latin: "A'ûdhu bi-kalimati-llâhi-t-tâmmâti min sharri mâ khalaq.",
      source: "Sahîh Muslim n° 2709.",
    },
    {
      id: 7,
      title: "Ô Allah ! C'est par Toi que nous nous retrouvons au soir",
      translation:
        "Ô Allah ! C'est par Toi que nous nous retrouvons au soir et c'est par Toi que nous nous retrouvons au matin. C'est par Toi que nous vivons et c'est par Toi que nous mourons et c'est vers Toi que sera notre destinée.",
      arabic:
        "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَ بِكَ أَصْبَحْنَا، وَ بِكَ نَحْيَا، وَ بِكَ نَمُوتُ وَ إِلَيْكَ المَصِيرُ",
      latin: "Allâhumma bika amsaynâ, wa bika asbahnâ, wa bika nahyâ, wa bika namût, wa ilayka-l-masîr.",
      source: "As-Sahîhah n° 262.",
    },
    {
      id: 8,
      title: "Nous voilà au soir et le règne appartient à Allah",
      translation:
        "Nous voilà au soir et le règne appartient à Allah. Louange à Allah, Il n'y a aucune divinité en dehors d'Allah, Seul, sans associé... Seigneur ! Je Te demande le bien que contient cette nuit et le bien qui vient après. Et je cherche refuge auprès de Toi contre le mal de cette nuit et le mal qui vient après. Seigneur ! Je cherche refuge auprès de Toi contre la paresse et les maux de la vieillesse. Je cherche refuge auprès de Toi contre le châtiment de l'Enfer et contre les tourments de la tombe.",
      arabic:
        "أَمْسَيْنَا وَ أَمْسَى المُلْكُ للهِ وَ الحَمْدُ للهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحدَهُ لاَشَرِيكَ لَهُ...",
      latin: "Amsaynâ wa amsa-l-mulku li-llâhi wa-l-hamduli-llâh...",
      source: "Sahîh Muslim n° 2723.",
    },
    {
      id: 9,
      title: "Nous voilà au soir et la Royauté appartient à Allah",
      translation:
        "Nous voilà au soir et la Royauté appartient à Allah, le Seigneur de l'Univers. Ô Allah ! Je Te demande le bien de cette nuit : ce qu'elle contient comme conquêtes, victoires, lumière, bénédiction et guidée. Je cherche refuge auprès de Toi contre le mal qu'elle contient et le mal qui vient après elle.",
      arabic:
        "أَمْسَيْنَا وَ أَمْسَى المُلْكُ للهِ رَبِّ العَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذِهِ اللَّيلَةِ...",
      latin: "Amsaynâ wa amsâ-l-mulku li-llâhi Rabbi-l-'âlamîn...",
      source: "Sahîh Al-Jâmi' n° 352.",
    },
    {
      id: 10,
      title: "Ô Allah ! Tu es mon Seigneur (soir)",
      translation:
        "Ô Allah ! Tu es mon Seigneur. Il n'y a aucune divinité en dehors de Toi. Tu m'as créé et je suis Ton serviteur... Pardonne-moi donc, en effet nul autre que Toi ne pardonne les péchés.",
      arabic:
        "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَ أَنَا عَبْدُكَ...",
      source: "Sahîh Al-Bukhârî n° 5947.",
    },
  ],

  "doua-apres-priere": [
    {
      id: 1,
      title: "Demande de pardon et Salâm",
      translation:
        "Je demande pardon à Allah [trois fois]. Ô Seigneur ! Tu es la Paix et la paix vient de Toi. Béni sois-Tu, ô Digne de glorification et de munificence.",
      arabic:
        "أَسْـتَغْفِرُ الله . (ثَلاثاً) اللّهُـمَّ أَنْـتَ السَّلامُ ، وَمِـنْكَ السَّلام تَبارَكْتَ يا ذا الجَـلالِ وَالإِكْـرام",
      latin: "Astaghfiru l-lâha (3 fois). Allâhumma anta s-salâmu wa minka s-salâmu, tabârakta yâ dhâ-l-jalâli wa-l-ikrâm.",
    },
    {
      id: 2,
      title: "Il n'y a d'autre divinité qu'Allah",
      translation:
        "Il n'y a d'autre divinité qu'Allah, Unique, sans associé. À Lui la royauté, à Lui la louange et Il est capable de toute chose. Ô Seigneur ! Nul ne peut retenir ce que Tu as donné et nul ne peut donner ce que Tu as retenu. Le fortuné ne trouve dans sa fortune aucune protection efficace contre Toi.",
      arabic:
        "لا إلهَ إلاّ اللّهُ وحدَهُ لا شريكَ لهُ، لهُ المُـلْكُ ولهُ الحَمْد، وَهُوَ على كلّ شَيءٍ قَدير، اللّهُـمَّ لا مانِعَ لِما أَعْطَـيْت وَلا مُعْطِـيَ لِما مَنَـعْت...",
      latin: "Lâ ilâha illâ l-lâhu, wahdahu lâ sharîka lahu, lahu-l-mulku wa lahu-l-hamdu wa huwa 'alâ kulli shay'in qadîr...",
    },
    {
      id: 3,
      title: "Tahlîl et Hawqala",
      translation:
        "Il n'y a d'autre divinité qu'Allah Unique, sans associé. À Lui la royauté, à Lui la louange et Il est capable de toute chose. Il n'y a de puissance ni de force qu'en Allah. Nulle divinité sauf Allah et nous n'adorons que Lui, la grâce et la générosité sont à Lui. C'est à Lui que vont les belles formules de louange. Nulle divinité sauf Allah. Nous Lui vouons un culte exclusif en dépit de la haine des incrédules.",
      arabic:
        "لا إلهَ إلاّ اللّه, وحدَهُ لا شريكَ لهُ، لهُ الملكُ ولهُ الحَمد، وَهُوَ على كلّ شيءٍ قدير، لا حَـوْلَ وَلا قـوَّةَ إِلاّ بِاللهِ...",
      latin: "Lâ ilâha illâ l-lâhu, wahdahu lâ sharîka lahu... Lâ hawla wa lâ quwwata illâ bi-l-lâhi...",
    },
    {
      id: 4,
      title: "Subhânallah, Al-hamdulillah, Allâhu akbar (33 fois)",
      translation:
        "Gloire à Allah et la Louange est à Allah et Allah est le Plus Grand [trente-trois fois]. Il n'y a d'autre divinité qu'Allah l'Unique, sans associé. À Lui la royauté, à Lui la louange et Il est capable de toute chose.",
      arabic:
        "سُـبْحانَ اللهِ، والحَمْـدُ لله ، واللهُ أكْـبَر .ثلاثاً وثلاثين لا إلهَ إلاّ اللّهُ وَحْـدَهُ لا شريكَ لهُ، لهُ الملكُ ولهُ الحَمْ د، وهُوَ على كُلّ شَيءٍ قَـدير",
      latin: "Subhâna l-lâhi, wa-l-hamdu li-l-lâhi, wa l-lâhu akbar (33 fois). Lâ ilâha illâ l-lâhu, wahdahu lâ sharîka lahu...",
    },
    {
      id: 5,
      title: "Les trois dernières sourates (après chaque prière)",
      translation:
        "Réciter Sourate Al-Ikhlâs, Al-Falaq et An-Nâs [trois fois chaque sourate] après chaque prière.",
      arabic: "قُـلْ هُـوَ اللهُ أَحَـدٌ ….. الإِخْـلاصْ قُـلْ أَعـوذُ بِرَبِّ الفَلَـقِ….. الفَلَـقْ قُـلْ أَعـوذُ بِرَبِّ النّـاسِ….. الـنّاس",
      source: "Après chaque prière.",
    },
    {
      id: 6,
      title: "Âyatu-l-Kursî (après chaque prière)",
      translation:
        "Allah ! Nulle divinité autre que Lui, le Vivant qui veille éternellement à la bonne marche de toute chose. Ni somnolence ni sommeil ne Le saisissent. À Lui appartient tout ce qui est dans les cieux et sur la terre...",
      arabic:
        "للهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ...",
      latin: "Allâhu lâ ilâha illâ huwa-l-hayyu-l-qayyûm...",
    },
    {
      id: 7,
      title: "Savoir utile et subsistance (après Fajr)",
      translation:
        "Ô Seigneur ! Je Te demande un savoir utile, une bonne subsistance et des œuvres agréées. [À dire après la prière du Fajr]",
      arabic:
        "اللّهُـمَّ إِنِّـي أَسْأَلُـكَ عِلْمـاً نافِعـاً وَرِزْقـاً طَيِّـباً ، وَعَمَـلاً مُتَقَـبَّلاً",
      latin: "Allâhumma innî as'aluka 'ilman nâfi'an, wa rizqan tayyiban, wa 'amalan mutaqabbalan.",
    },
  ],

  "doua-avant-manger": [
    {
      id: 1,
      title: "Au nom d'Allah",
      translation: "Au nom d'Allah",
      arabic: "بِسْمِ اللهِ",
      latin: "Bismillâhi",
    },
    {
      id: 2,
      title: "Bénédiction dans la nourriture",
      translation:
        "Place pour nous Ta bénédiction dans cette nourriture et accorde-nous une nourriture meilleure.",
      arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيْهِ، وَأَطْعِمْنَا خَيْراً مِنْهُ",
      latin: "Allâhoumma bârik lanâ fîhi, wa at'imnâ khayran minhou.",
    },
    {
      id: 3,
      title: "Avant de boire du lait",
      translation: "Ô Allah, bénis-le nous et donne-nous en davantage.",
      arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيْهِ، وَزِدْنَا مِنْهُ",
      latin: "Allâhoumma bârik lanâ fîhi wa zidnâ minhou.",
    },
    {
      id: 4,
      title: "Doua de rupture du jeûne (iftar)",
      translation:
        "La soif est dissipée, les veines sont abreuvées et la récompense restera avec la volonté d'Allah.",
      arabic: "ذَهَبَ الظَّمَأُ، وَابْتَلَّتِ العُرُوقُ، وَثَبَتَ الأجْرُ إِنْ شَاءَ اللهُ",
      latin: "Dhahaba z-zama u wa btallati-l-'ouroûqou wa thabata-l-ajrou in shâ a l-lâhou.",
    },
    {
      id: 5,
      title: "Autre doua de l'iftar",
      translation:
        "Ô Allah, je te demande par Ta miséricorde qui embrasse toute chose de me pardonner.",
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ، أَنْ تَغْفِرَ لِي",
      latin: "Allâhoumma innî as alouka bi-rahmatika l-lâti wasi'at koulla shay in an taghfira lî.",
    },
  ],

  "doua-avant-dormir": [
    {
      id: 1,
      title: "Âyatu-l-Kursî",
      translation:
        "Allah ! Point de divinité à part Lui, le Vivant, Celui qui n'a besoin de rien et dont toute chose dépend. Ni somnolence ni sommeil ne Le saisissent...",
      arabic:
        "اللهُ لاَ إِلَهَ إِلاَّ هُوَ الحَيُّ القَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَ لاَ نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَ مَا فِي الأَرْضِ...",
      source: "Sahîh Al-Kalim At-Tayyib n° 22.",
    },
    {
      id: 2,
      title: "C'est en Ton nom que je meurs et que je vis",
      translation: "C'est en Ton nom, Ô Allah, que je meurs et que je vis.",
      arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَ أَحْيَا",
      latin: "Bi-smika-llâhoumma amûtu wa ahyâ.",
      source: "Mukhtasar Al-Bukhârî n° 2425.",
    },
    {
      id: 3,
      title: "C'est en Ton nom, Seigneur que je me couche",
      translation:
        "C'est en Ton nom, Seigneur que je me couche, et en Ton nom que je me lève. Si Tu retiens mon âme, alors fais-lui miséricorde ; et si Tu la renvoies [dans mon corps], protège-la donc de la manière dont Tu protèges Tes pieux serviteurs.",
      arabic:
        "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَ بِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَ إِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ",
      latin: "Bi-smika Rabbî wada'tu janbî wa bika arfa'uh. Fa-in amsakta nafsî, fa-rhamhâ. Wa In arsaltahâ fa-hfadh-hâ bi-mâ tahfadhu bi-hi 'ibâdaka-s-sâlihîn.",
      source: "Al-Bukhârî n° 6320.",
    },
    {
      id: 4,
      title: "Ô Allah ! Connaisseur de l'invisible et de l'apparent",
      translation:
        "Ô Allah ! Connaisseur de l'invisible et de l'apparent, Créateur des cieux et de la Terre, Seigneur et Possesseur de toute chose, j'atteste qu'il n'y a aucune divinité en dehors de Toi, je cherche refuge auprès de Toi contre le mal de mon âme, contre le mal de Satan et de son polythéisme et contre le fait de me faire du mal à moi-même ou d'en faire à un musulman.",
      arabic:
        "اللَّهُمَّ عَالِمَ الغَيْبِ وَ الشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَ الأَرْضِ رَبَّ كُلِّ شَيْءٍ وَ مَلِيكَهُ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَ مِنْ شَرِّ الشَّيْطَانِ وَ شِرْكِهِ...",
      latin: "Allâhumma 'Âlima-l-ghaybi wa-sh-shahâdah, Fâtira-s-samâwâti wa-l-ard...",
      source: "Sahîh Al-Kalim At-Tayyib n° 21.",
    },
    {
      id: 5,
      title: "Ô Allah ! Épargne-moi Ton châtiment",
      translation: "Ô Allah ! Épargne-moi Ton châtiment le jour où Tu ressusciteras Tes serviteurs !",
      arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
      latin: "Allâhumma qinî 'adhâbaka yawma tab'athu 'ibâdak.",
      source: "As-Sahîhah n° 2754.",
    },
    {
      id: 6,
      title: "Louange à Allah qui nous a nourris et abreuvés",
      translation:
        "Louange à Allah qui nous a nourris, abreuvés, a suffit [à tous nos besoins] et nous a abrités ; alors que nombreux sont ceux qui n'ont personne pour les suffire et les abriter.",
      arabic: "الحَمْدُ للهِ الَّذِي أَطْعَمَنَا وَ سَقَانَا، وَ كَفَانَا، وَ آوَانَا، فَكَمْ مِمَّنْ لاَ كَافِيَ لَهُ وَ لاَ مُؤْوِيَ",
      latin: "Al- hamdu li-llâhi-llâdhi at'amanâ, wa saqânâ, wa kafânâ, wa âwânâ...",
      source: "Mukhtasar Muslim n° 1901.",
    },
    {
      id: 7,
      title: "Ô Allah ! C'est Toi qui a créé mon âme",
      translation:
        "Ô Allah ! C'est Toi qui a créé mon âme et c'est Toi qui la reprend, c'est à Toi que reviennent sa mort et sa vie. Si Tu la laisses vivre, protège-la et si Tu la fais mourir pardonne-lui. Ô Allah ! Je Te demande de m'accorder la [bonne] santé.",
      arabic:
        "اللَّهُمَّ أَنْتَ خَلَقْتَ نَفْسِي وَ أَنْتَ تَوَفَّاهَا لَكَ مَمَاتُهَا وَ مَحْيَاهَا، إِنْ أَحْيَيْتَهَا فاحْفَظْهَا ، وَ إِنْ أَمَتَّهَا فَاغْفِرْ لَهَا. اللَّهُمَّ إِنَّي أَسْأَلُكَ العَافِيَةَ",
      latin: "Allâhumma anta khalaqta nafsî wa anta tawaffâhâ...",
      source: "Mukhtasar Muslim n° 1898.",
    },
    {
      id: 8,
      title: "Ô Allah ! Seigneur des cieux et des terres",
      translation:
        "Ô Allah ! Seigneur des cieux et Seigneur des terres, notre Seigneur et le Seigneur de toute chose. Toi qui fends la graine et le noyau, qui a fait descendre la Torah, l'Évangile et le Coran, je cherche refuge auprès de Toi contre le mal de toute personne mauvaise soumise à Ton pouvoir... Acquitte mes dettes et suffis-moi face à la pauvreté.",
      arabic:
        "اللَّهُمَّ رَبَّ السَّمَاوَاتِ وَ رَبَّ الأَرَضِينَ، وَ رَبَّنَا وَ رَبَّ كُلِّ شَيْءٍ، فَالِقَ الحَبِّ وَ النَّوَى، وَ مُنْزِلَ التَّوْرَاةِ وَ الإِنْجِيلِ وَ القُرْآنِ... اقْضِ عَنِّي الدَّيْنَ وَ أَغْنِنِي مِنَ الفَقْرِ",
      latin: "Allâhumma Rabba-s-samâwâti wa Rabba-l-aradîn...",
      source: "Sahîh At-Tirmidhî n° 3400.",
    },
    {
      id: 9,
      title: "Ô Allah ! Je me suis soumis à Toi",
      translation:
        "Ô Allah ! Je me suis soumis à Toi, je T'ai confié toutes mes affaires. Je m'en suis remis à Toi en toute chose. Je m'oriente vers Toi par amour et par crainte. Il n'existe aucun refuge contre Toi sauf auprès de Toi. J'ai cru au Livre que Tu as descendu et au Prophète que Tu as envoyé.",
      arabic:
        "اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَ وَجَّهْتُ وَجْهِي إِلَيْكَ، وَ فَوَّضْتُ أَمْرِي إِلَيْكَ، وَ أَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَ رَهْبَةً إِلَيْكَ، لاَ مَلْجَأَ وَ لاَ مَنْجَا مِنْكَ إِلاَّ إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ وَ بِنَبِيِّكَ الَّذِي أَرْسَلْتَ",
      latin: "Allâhumma aslamtu nafsî ilayk, wa wajjahtu wajhî ilayk...",
      source: "Mukhtasar Al-Bukhârî n° 2426.",
    },
    {
      id: 10,
      title: "Tahlîl et Hawqala avant de dormir",
      translation:
        "Il n'y a aucune divinité [digne d'être adorée] en dehors d'Allah, Seul sans associé. À Lui la royauté et la louange, et Il est capable de toute chose. Il n'y a de force ni de puissance qu'en Allah, gloire et pureté à Allah, louange à Allah, il n'y a aucune divinité en dehors d'Allah et Allah est le plus Grand.",
      arabic:
        "لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَشَرِيكَ لَهُ، لَهُ المُلْكُ وَ لَهُ الحَمْدُ، وَ هُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، وَ لاَ حَوْلَ وَ لاَ قُوَّةَ إِلاَّ بِاللهِ. سُبْحَانَ اللهِ، وَ الحَمْدُ للهِ، وَ لاَ إِلَهَ إِلاَّ اللهُ، وَ اللهُ أَكْبَرُ",
      latin: "Lâ ilâha illa-llâhu wahdahu lâ sharîka lah...",
      source: "As-Sahîhah n° 3414.",
    },
    {
      id: 11,
      title: "Louange à Allah qui a suffi et m'a abrité",
      translation:
        "Louange à Allah, qui a suffit [à tous mes besoins] et m'a abrité. Louange à Allah, qui m'a nourri et abreuvé. Louange à Allah, qui m'a octroyé de Ses bienfaits et m'a honoré. Ô Allah ! Je Te demande, par Ta puissance, de me sauver du feu [de l'Enfer].",
      arabic:
        "الحَمْدُ للهِ الَّذِي كَفَانِي وَ آوَانِي، الحَمْدُ للهِ الَّذِي أَطْعَمَنِي وَ سَقَانِي، الحَمْدُ للهِ الَّذِي مَنَّ عَلَيَّ وَ أَفْضَلَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ بِعِزَّتِكَ أَنْ تُنَجِّيَنِي مِنَ النَّارِ",
      latin: "Al-hamdu li-llâhi-llâdhi kafânî wa âwânî...",
      source: "As-Sahîhah n° 3444.",
    },
    {
      id: 12,
      title: "Au nom d'Allah je me couche",
      translation:
        "Au nom d'Allah je me couche. Ô Allah ! Pardonne-moi mes péchés, humilie le démon [qui me tient compagnie], libère-moi de mes hypothèques, alourdit ma balance et place-moi au royaume des cieux [avec les Anges].",
      arabic:
        "بِسْمِ اللهِ وَضَعْتُ جَنْبِي، اللَّهُمَّ اغْفِرْ لِي ذَنْبِي، وَ اخْسَأْ شَيْطَانِي، وَ فُكَّ رِهَانِي، وَ ثَقِّلْ مِيزَانِي، وَ اجْعَلْنِي فِي النَّدِيِّ الأَعْلَى",
      latin: "Bi-smi-llâhi wada'tu janbî. Allâhumma ghfir lî dhanbî, wa khsa shaytânî...",
      source: "Sahîh Al-Jâmi' n° 4649.",
    },
    {
      id: 13,
      title: "Les trois dernières sourates et massage (3 fois)",
      translation:
        "Tous les soirs en allant se coucher, le Prophète (صلى الله عليه وسلم) joignait ses deux mains, y crachotait et y récitait les trois dernières sourates du Coran : Al-'Ikhlâs, Al-Falaq et An-Nâs. Il passait ses mains sur toutes les parties du corps qu'il pouvait atteindre, en débutant par la tête, puis le visage et enfin le devant du corps [il répétait cela 3 fois].",
      arabic:
        "قُلْ هُوَ اللهُ أَحَدٌ، وَ قُلْ أَعُوذُ بِرَبِّ الفَلَقِ، وَ قُلْ أَعُوذُ بِرَبِّ النَّاسِ، ثُمَّ مَسَحَ بِهِمَا مَا اسْتَطَاعَ مِنْ جَسَدِهِ...",
      source: "Mukhtasar Al-Bukhârî n° 2025.",
    },
    {
      id: 14,
      title: "Glorification 33, 33, 34",
      translation:
        "Gloire et pureté à Allah [33 fois], louange à Allah [33 fois], Allah est le Plus Grand [34 fois].",
      arabic:
        "سُبْحَانَ اللهِ (ثَلاَثاً وَ ثَلاَثِينَ)، الحَمْدُ للهِ (ثَلاَثاً وَ ثَلاَثِينَ)، اللهُ أَكْبَرُ(أَرْبَعاً وَ ثَلاَثِينَ.)",
      latin: "Subhâna-llâh [33], al-hamdu li-llâh [33], Allâhu akbar [34].",
      source: "As-Sahîhah n° 3596.",
    },
    {
      id: 15,
      title: "Âmânar-Rasûl (derniers versets Al-Baqarah)",
      translation:
        "Le Messager a cru en ce qu'on a fait descendre vers lui venant de son Seigneur, et aussi les croyants : tous ont cru en Allah, en Ses Anges, à Ses Livres et en Ses Messagers... Seigneur, nous implorons Ton pardon. C'est à Toi que sera le retour... [Sourate al-Baqarah, versets 285/286]",
      arabic:
        "آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَ الْمُؤْمِنُونَ كُلٌّ آمَنَ بِاللهِ وَ مَلاَئِكَتِهِ وَ كُتُبِهِ وَ رُسُلِهِ... غُفْرَانَكَ رَبَّنَا وَ إِلَيْكَ الْمَصِيرُ...",
      source: "Sahîh Al-Bukhârî n° 5009 et Sahîh Muslim n°808.",
    },
  ],

  "invocations-voyage": [
    {
      id: 1,
      title: "Invocation du voyageur (doua safar)",
      translation:
        "Allah est le Plus Grand, Allah est le Plus Grand, Allah est le Plus Grand. Gloire et pureté à Celui qui nous a soumis tout cela alors que nous n'étions pas capables de les dominer. Et c'est vers notre Seigneur que nous retournerons. Ô Allah ! Nous Te demandons de nous accorder dans ce voyage la bonté pieuse, la crainte ainsi que tout acte qui Te satisfait. Ô Allah ! Facilite-nous ce voyage et raccourcis pour nous sa distance. Ô Allah ! Tu es notre compagnon de voyage et le successeur auprès de nos familles. Ô Allah ! Je cherche refuge auprès de Toi contre la fatigue du voyage, contre toute vue source de chagrin et contre tout malheur qui toucherait nos biens et notre famille à notre retour.",
      arabic:
        "اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، اللهُ أَكْبَرُ سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَ مَا كُنَّا لَهُ مُقْرِنِينَ وَ إِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ، اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا البِرَّ وَ التَّقْوَى، وَ مِنَ العَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَ اطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ، وَ الخَلِيفَةُ فِي الأَهْلِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ وَعْثَاءِ السَّفَرِ، وَ كآبَةِ المَنْظَرِ وَ سُوءِ المُنْقَلَبِ فِي المَالِ وَ الأَهْلِ",
      latin: "Allâhu akbar, Allâhu akbar, Allâhu akbar. Subhâna-lladhî sakh-khara lanâ hâdhâ wa mâ kunnâ lahu muqrinîn, wa innâ ilâ Rabbinâ la-munqalibûn...",
      source: "Sahîh At-Tirmidhî n° 3388.",
    },
    {
      id: 2,
      title: "Au retour du voyage",
      translation: "Nous voilà de retour, repentants, dévoués et proclamant la louange de notre Seigneur.",
      arabic: "آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ",
      latin: "Âyibûn, tâibûn, 'âbidûn, li-Rabbinâ hâmidûn.",
      source: "Sahîh At-Tirmidhî n° 3388.",
    },
  ],

  "doua-apres-adhan": [
    {
      id: 1,
      title: "Répéter après le muezzin",
      translation:
        "Répéter la même chose que le muezzin dit, sauf après « Venez à la prière » et « Accourrez au succès ». À chaque fois que ces phrases sont prononcées, dire : Il n'y a de puissance ni de force qu'en Allah.",
      arabic: "يَقُولُ مِثْلَ مَا يَقُولُ المُؤَذِّنُ إلَّا فِي «حَيَّ عَلَى الصَّلاةِ» وَ «حَيَّ عَلَى الفَلاحِ» فَيَقُولُ : «لَا حَولَ وَ لَا قُوَّةَ إلَّا بِاللهِ»",
      latin: "Lâ hawla wa lâ qouwwata illâ billâhi.",
    },
    {
      id: 2,
      title: "Prier sur le Prophète après l'adhan",
      translation: "Prier sur le Prophète (sallallahou 'alayhi wa sallam) à la fin de l'appel à la prière.",
      arabic: "يُصَلِّي عَلَى النَّبِي صلى الله عليه وسلم بَعْدَ فَرَاغِهِ مِنْ إِجَابَةِ المُؤَذِّنِ",
      latin: "Allâhoumma salli 'alâ sayyidinâ mouhammadin wa 'alâ âlihi wa sahbihi wa sallim.",
      source: "Rapporté par Mouslim (#384).",
    },
    {
      id: 3,
      title: "Invocation après l'adhan",
      translation:
        "Ô Allah, Maître de cet appel parfait et de la prière que l'on va accomplir, donne à Mohammed le pouvoir d'intercéder et la place d'honneur, et ressuscite-le dans la position louable que Tu lui as promise. [Car Tu ne manques jamais à Ta promesse].",
      arabic:
        "اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ ، وَالصَّلاةِ القَائِمَةِ ، آتِ مُحَمَّداً الوَسِيْلَةَ وَالفَضِيْلَةَ ، وَابْعَثْهُ مَقَاماً مَحْمُوْداً الَّذِي وَعَدْتَهُ ، [إِنَّكَ لاَ تُخْلِفُ الْمِيعَادِ]",
      latin: "Allâhoumma rabba hâdhihi d-da'wati t-âmmati, wa s-salâti-l-qâ imati. Âti mouhammadan al wasîlata wa-l-fadîlata, wa b'ath-hou maqâman mahmûdan al-ladhî wa'adtahou. [Innaka lâ toukhlifou-l-mî'âd.]",
      source: "Rapporté par al-Boukhari.",
    },
  ],

  "doua-protection": [
    {
      id: 1,
      title: "Âyatu-l-Kursî pour se protéger",
      translation:
        "Allah ! Point de divinité à part Lui, le Vivant, Celui qui n'a besoin de rien et dont toute chose dépend. Ni somnolence ni sommeil ne Le saisissent. À Lui appartient tout ce qui est dans les cieux et sur la Terre... (Cette invocation peut être prononcée pour demander à Allah de nous protéger contre toutes formes de maux comme les djinns, le mauvais œil, la sorcellerie ou toutes autres agressions extérieures.)",
      arabic:
        "اللهُ لاَ إِلَهَ إِلاَّ هُوَ الحَيُّ القَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَ لاَ نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَ مَا فِي الأَرْضِ...",
      source: "Sourate Al-Baqarah, verset 255.",
    },
    {
      id: 2,
      title: "Les trois dernières sourates",
      translation: "Réciter les trois dernières sourates du Coran : Al-Ikhlâs, Al-Falaq, An-Nâs (3 fois chacune).",
      source: "Sahîh At-Tirmidhî n° 3575.",
    },
    {
      id: 3,
      title: "Au nom d'Allah (3 fois)",
      translation:
        "Au nom d'Allah, tel qu'en compagnie de Son Nom rien sur Terre ni au ciel ne peut nuire, Lui l'Audient, l'Omniscient.",
      arabic:
        "بِسْمِ اللهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَ لاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ العَلِيمُ",
      latin: "Bi-smi-llâhi-lladhî lâ yadurru ma'a-smihi shayun fi-l-ardi wa lâ fi-s-samâi wa huwa-s-Samî'-ul-'Alîm.",
      source: "Sahîh At-Tirmidhî n° 3388.",
    },
    {
      id: 4,
      title: "Protection pour les enfants",
      translation:
        "Je cherche refuge pour vous auprès des paroles parfaites d'Allah contre tout démon, contre toute vermine et contre tout mauvais œil.",
      arabic: "أُعِيذُكُمَا بِكَلِمَاتِ اللهِ التَّامَّةِ، مِنْ كُلِّ شَيْطَانٍ وَ هَامَّةٍ، وَ مِنْ كُلِّ عَيْنٍ لاَمَّةٍ",
      latin: "U'îdhukumâ bi-kalimâti-llâhi-t-tâmmah, min kulli shaytânin wa hâmmah, wa min kulli 'aynin lâmmah.",
      source: "Sahîh Al-Kalim At-Tayyib n° 118.",
    },
  ],

  "doua-tristesse": [
    {
      id: 1,
      title: "Invocation contre la tristesse",
      translation:
        "Ô Allah ! Je suis Ton serviteur, fils de Ton serviteur, fils de Ta servante. Je suis sous Ton pouvoir. Ton jugement s'accomplit sur moi, Ton décret sur moi est juste. Je Te demande par tout nom qui T'appartient, par lequel Tu T'es nommé, ou que Tu as révélé dans Ton Livre ou que Tu as enseigné à l'une de Tes créatures, ou bien que Tu as gardé secret dans la science de l'inconnu, de faire en sorte que le Coran soit le printemps de mon cœur, la lumière de ma poitrine, qu'il dissipe ma tristesse et mette fin à mes soucis.",
      arabic:
        "اللَّهُمَّ إِنِّي عَبْدُكَ ابْنُ عَبْدِكَ ابْنُ أَمَتِكَ نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤكَ أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ سَمَّيْتَ بِهِ نَفْسَكَ أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ، أَوْ عَلَّمْتَهُ أَحَداً مِنْ خَلْقِكَ أَوِ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الغَيْبِ عِنْدَكَ أَنْ تَجْعَلَ القُرْآنَ رَبِيعَ قَلْبِي، وَ نُورَ صَدْرِي وَ جَلاَءَ حُزْنِي وَ ذِهَابَ هَمِّي",
      latin: "Allâhumma innî 'abduka bnu 'abdika bnu amatik. Nâsiyatî bi-yadik. Mâdin fiyya hukmuk, 'adlun fiyya qadâuk. Asaluka bi-kulli-smin huwa laka sammayta bihi nafsak...",
      source: "Ahmed (1/391). Al-Albani l'a authentifié dans al-Kalim at-Tayyib (#124).",
    },
    {
      id: 2,
      title: "Autre doua contre la tristesse",
      translation:
        "Ô Allah, je me mets sous Ta protection contre les soucis et la tristesse, contre l'incapacité et la paresse, contre l'avarice et la lâcheté, contre le poids de la dette et la domination des hommes.",
      arabic:
        "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الهَمِّ وَ الْحَـزَنِ، والعَجْـزِ والكَسَلِ، والبُخْلِ والجُبْنِ، وضَلَعِ الدَّيْنِ وغَلَبَةِ الرِّجَالِ",
      latin: "Allâhoumma innî a'oûdhou bika mina-l-hammi wa-l-hazani, wa-l-'ajzi wa-l-kasali, wa-l-boukhli wa-l-joubni, wa dala'i d-dayni wa ghalabati r-rijâl.",
      source: "Al-Boukhari (#6363).",
    },
  ],

  "doua-mosquee": [
    {
      id: 1,
      title: "En allant à la mosquée",
      translation: "Invocation à dire en se rendant à la mosquée.",
      arabic: "",
      source: "Voir fiche invocation-allant-mosquee.",
    },
    {
      id: 2,
      title: "En entrant à la mosquée",
      translation: "Invocation à dire en entrant dans la mosquée.",
      arabic: "",
      source: "Voir fiche doua-invocation-entrant-mosquee.",
    },
    {
      id: 3,
      title: "En sortant de la mosquée",
      translation: "Invocation à dire en sortant de la mosquée.",
      arabic: "",
      source: "Voir fiche invocation-doua-sortant-mosquee.",
    },
  ],

  "doua-quotidien": [
    {
      id: 1,
      title: "Au réveil",
      translation: "Louange à Allah qui nous a rendu la vie après nous avoir fait mourir, et c'est vers Lui la résurrection.",
      arabic: "الحَمْدُ للهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
      latin: "Al-hamdu li-llâhi-lladhî ahyânâ ba'da mâ amâtanâ wa ilayhi-n-nushûr.",
    },
    {
      id: 2,
      title: "En s'habillant",
      translation: "Au nom d'Allah. Ô Allah, je Te demande de son bien et le bien de ce pour quoi il a été fait, et je cherche refuge auprès de Toi contre son mal et le mal de ce pour quoi il a été fait.",
      arabic: "بِسْمِ اللهِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ خَيْرِهِ وَخَيْرِ مَا هُوَ لَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّهِ وَشَرِّ مَا هُوَ لَهُ",
      latin: "Bismi-llâh. Allâhumma innî as'aluka min khayrihi wa khayri mâ huwa lah, wa a'ûdhu bika min sharrihi wa sharri mâ huwa lah.",
    },
    {
      id: 3,
      title: "En entrant aux toilettes",
      translation: "Ô Allah, je cherche refuge auprès de Toi contre les démons mâles et femelles.",
      arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبْثِ وَالْخَبَائِثِ",
      latin: "Allâhumma innî a'ûdhu bika mina-l-khubthi wa-l-khabâ'ith.",
    },
    {
      id: 4,
      title: "En sortant des toilettes",
      translation: "Je Te demande pardon. Louange à Allah qui m'a enlevé le mal et m'a guéri.",
      arabic: "غُفْرَانَكَ، الحَمْدُ للهِ الَّذِي أَذْهَبَ عَنِّي الأَذَى وَعَافَانِي",
      latin: "Ghufrânak. Al-hamdu li-llâhi-lladhî adhhaba 'annî l-adhâ wa 'âfânî.",
    },
  ],
};

/** Retourne les catégories françaises (données locales). */
export function getLocalCategoriesFr(): DuaCategory[] {
  return LOCAL_CATEGORIES_FR.map((c) => ({
    ...c,
    total: DUAS_BY_SLUG[c.slug]?.length ?? 0,
  }));
}

/** Retourne le nom d'affichage d'une catégorie par slug (FR). */
export function getCategoryNameBySlugFr(slug: string): string | undefined {
  return LOCAL_CATEGORIES_FR.find((c) => c.slug === slug)?.name;
}

/** Retourne les invocations d'une catégorie (données locales FR). */
export function getLocalCategoryDuasFr(slug: string): DuaItem[] {
  return DUAS_BY_SLUG[slug] ?? [];
}

/** Retourne le détail d'une invocation par slug et id (données locales FR). */
export function getLocalDuaDetailFr(slug: string, id: number): DuaDetail | null {
  const list = DUAS_BY_SLUG[slug];
  if (!list) return null;
  const item = list.find((d) => d.id === id);
  if (!item) return null;
  const category = LOCAL_CATEGORIES_FR.find((c) => c.slug === slug);
  return {
    ...item,
    categorySlug: slug,
    categoryName: category?.name,
  };
}

/** Vérifie si un slug fait partie des données locales FR. */
export function hasLocalCategoryFr(slug: string): boolean {
  return slug in DUAS_BY_SLUG || LOCAL_CATEGORIES_FR.some((c) => c.slug === slug);
}
