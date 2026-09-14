/**
 * English local duas data (Fortress of the Muslim style).
 */

import type { DuaCategory, DuaItem, DuaDetail } from "../types";

/** English categories using the slugs expected by the app. */
export const LOCAL_CATEGORIES_EN: DuaCategory[] = [
  { id: "invocations-du-matin", name: "Morning invocations", slug: "invocations-du-matin" },
  { id: "invocations-du-soir", name: "Evening invocations", slug: "invocations-du-soir" },
  { id: "doua-apres-priere", name: "Duas after prayer", slug: "doua-apres-priere" },
  { id: "doua-avant-manger", name: "Duas before eating", slug: "doua-avant-manger" },
  { id: "doua-avant-dormir", name: "Duas before sleeping", slug: "doua-avant-dormir" },
  { id: "invocations-voyage", name: "Travel invocations", slug: "invocations-voyage" },
  { id: "doua-apres-adhan", name: "Invocation after the adhan", slug: "doua-apres-adhan" },
  { id: "doua-protection", name: "Duas for protection", slug: "doua-protection" },
  { id: "doua-tristesse", name: "Duas for sadness and anxiety", slug: "doua-tristesse" },
  { id: "doua-mosquee", name: "Mosque invocations", slug: "doua-mosquee" },
  { id: "doua-quotidien", name: "Daily invocations", slug: "doua-quotidien" },
];

/** Invocations by category slug. Each item has a unique id within its category. */
const DUAS_BY_SLUG: Record<string, DuaItem[]> = {
  "invocations-du-matin": [
    {
      id: 1,
      title: "Recite Ayat al-Kursi",
      translation: "Allah! There is no deity except Him, the Ever-Living, the Sustainer of all. Neither drowsiness nor sleep overtakes Him. To Him belongs whatever is in the heavens and whatever is on Earth. Who can intercede with Him except by His permission? He knows what is before them and what is behind them, and they encompass nothing of His knowledge except what He wills. His Kursi extends over the heavens and the Earth, and preserving them does not tire Him. He is the Most High, the Most Great.",
      arabic:
        "اللهُ لاَ إِلَهَ إِلاَّ هُوَ الحَيُّ القَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَ لاَ نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَ مَا فِي الأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَ مَا خَلْفَهُمْ وَ لاَ يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلاَّ بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَ الأَرْضَ وَ لاَ يَئُودُهُ حِفْظُهُمَا وَ هُوَ العَلَيُّ العَظِيمُ",
      latin: "Allâhu lâ ilâha illâ huwa-l-hayyu-l-qayyûm...",
      source: "Sourate Al-Baqarah, verset 255. Sahîh Al-Kalim At-Tayyib n° 22.",
    },
    {
      id: 2,
      title: "The last three surahs",
      translation: "Recite the last three surahs of the Quran: Surah Al-Ikhlas, Al-Falaq, and An-Nas.",
      source: "Sahîh At-Tirmidhî n° 3575.",
    },
    {
      id: 3,
      title: "Surah Al-Ikhlas (3 times)",
      translation: "Say: He is Allah, the One. Allah, the One upon Whom all depend. He neither begets nor is born. And there is none equal to Him.",
      arabic: "قُلْ هُوَ اللهُ أَحَدٌ ۞ اللهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
      latin: "Qul huwa Allâhu ahad, Allâhu-s-Samad, lam yalid wa lam yûlad, wa lam yakun lahu kufuwan ahad.",
      source: "Sourate 112.",
    },
    {
      id: 4,
      title: "Surah Al-Falaq (3 times)",
      translation: "Say: I seek refuge in the Lord of daybreak, from the evil of what He has created, from the evil of darkness when it settles, from the evil of those who blow on knots, and from the evil of an envier when he envies.",
      arabic:
        "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۞ مِنْ شَرِّ مَا خَلَقَ ۞ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۞ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۞ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
      latin: "Qul a'ûdhu bi-rabbi-l-falaq...",
      source: "Sourate 113.",
    },
    {
      id: 5,
      title: "Surah An-Nas (3 times)",
      translation: "Say: I seek refuge in the Lord of mankind, the King of mankind, the God of mankind, from the evil of the retreating whisperer, who whispers into the hearts of mankind, whether from among the jinn or mankind.",
      arabic:
        "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۞ مَلِكِ النَّاسِ ۞ إِلَهِ النَّاسِ ۞ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۞ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۞ مِنَ الْجِنَّةِ وَالنَّاسِ",
      latin: "Qul a'ûdhu bi-rabbi-n-nâs...",
      source: "Sourate 114.",
    },
    {
      id: 6,
      title: "In the name of Allah (3 times)",
      translation: "In the name of Allah, with Whose name nothing on Earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
      arabic:
        "بِسْمِ اللهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَ لاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ العَلِيمُ",
      latin: "Bi-smi-llâhi-lladhî lâ yadurru ma'a-smihi shayun fi-l-ardi wa lâ fi-s-samâi wa huwa-s-Samî'-ul-'Alîm.",
      source: "Sahîh At-Tirmidhî n° 3388.",
    },
    {
      id: 7,
      title: "O Allah, by You we enter the morning",
      translation: "O Allah, by You we enter the morning and by You we enter the evening. By You we live and by You we die, and to You is the resurrection.",
      arabic:
        "اللَّهُمَّ بِكَ أَصْبَحْنَا وَ بِكَ أَمْسَيْنَا، وَ بِكَ نَحْيَا وَ بِكَ نَمُوتُ وَ إِلَيْكَ النُّشُورُ",
      latin: "Allâhumma bika asbahnâ, wa bika amsaynâ, wa bika nahyâ, wa bika namût, wa ilayka-n-nushûr.",
      source: "As-Sahîhah n° 262.",
    },
    {
      id: 8,
      title: "We have entered the morning and sovereignty belongs to Allah",
      translation: "We have entered the morning and sovereignty belongs to Allah. Praise be to Allah. There is no deity worthy of worship except Allah alone, without partner. To Him belongs sovereignty and to Him belongs praise, and He is capable of all things. My Lord, I ask You for the good of this day and the good that follows it, and I seek refuge in You from the evil of this day and the evil that follows it. My Lord, I seek refuge in You from laziness and the evils of old age. I seek refuge in You from the punishment of the Fire and the punishment of the grave.",
      arabic:
        "أَصْبَحْنَا وَ أَصْبَحَ المُلْكُ للهِ وَ الحَمْدُ للهِ ، لاَ إلَهَ إلاَّ اللهُ وَحدَهُ لاَشَرِيكَ لَهُ، لَهُ المُلْكُ وَ لَهُ الحَمْدُ، وَ هُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا اليَوْمِ وَ خَيْرَ مَا بَعْدَهُ، وَ أَعُوذُ بِكَ مِنْ شَرِّ هَذَا اليَوْمِ وَ شَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الكَسَلِ وَ سُوءِ الكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَ عَذَابٍ فِي القَبْرِ.",
      latin: "Asbahnâ wa asbaha-l-mulku li-llâhi wa-l-hamduli-llâh. Lâ ilâha illâ llâhu wahdahu lâ sharîka lah...",
      source: "Sahîh Muslim n° 2723.",
    },
    {
      id: 9,
      title: "We have entered the morning and dominion belongs to Allah",
      translation: "We have entered the morning and dominion belongs to Allah, Lord of the worlds. O Allah, I ask You for the good of this day: its openings, victories, light, blessings, and guidance. I seek refuge in You from the evil within it and the evil that follows it.",
      arabic:
        "أَصْبَحْنَا وَ أَصْبَحَ المُلْكُ للهِ رَبِّ العَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا اليَوْمِ، فَتْحَهُ، وَ نَصْرَهُ، وَ نُورَهُ وَبَرَكَتَهُ، و َهُدَاهُ، وَ أَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهِ وَ شَرِّ مَا بَعْدَهُ.",
      latin: "Asbahnâ wa asbaha-l-mulku li-llâhi Rabbi-l-'âlamîn. Allâhumma innî asaluka khayra hâdha-l-yawmi...",
      source: "Sahîh Al-Jâmi' n° 352.",
    },
    {
      id: 10,
      title: "O Allah, You are my Lord",
      translation: "O Allah, You are my Lord. There is no deity worthy of worship except You. You created me and I am Your servant. I uphold my covenant and promise to You as best I can. I seek refuge in You from the evil I have committed. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for no one forgives sins except You.",
      arabic:
        "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَ أَنَا عَبْدُكَ، وَ أَنَا عَلَى عَهْدِكَ وَ وَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَ َأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ",
      latin: "Allâhumma anta Rabbî, lâ ilâha illâ ant. Khalaqtanî wa ana 'abduk...",
      source: "Sahîh Al-Bukhârî n° 5947.",
    },
    {
      id: 11,
      title: "O Allah, I ask You for well-being",
      translation: "O Allah, I ask You for well-being in this life and the Hereafter. O Allah, I ask You for forgiveness and well-being in my religion, my worldly affairs, my family, and my wealth. O Allah, conceal my faults and keep me safe from all that I fear. O Allah, protect me from in front of me, from behind me, on my right, on my left, and above me. I seek refuge in Your greatness from being swallowed up from beneath me.",
      arabic:
        "اللَّهُمَّ إِنِّي أَسْأَلُكَ العَافِيةَ فِي الدُّنْيَا وَ الآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ العَفْوَ وَ العَافِيةَ فِي دِينِي وَ دُنْيَايَ وَ أَهْلِي وَ مَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَ آمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَ مِنْ خَلْفِي وَ عَنْ يَمِينِي وَ عَنْ شِمَالِي، وَ مِنْ فَوْقِي، وَ أَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي",
      latin: "Allâhumma innî asaluka-l-'âfiyata fi-d-duniyâ wa-l-âkhirah...",
      source: "Sahîh Abû Dâwûd n°5074.",
    },
    {
      id: 12,
      title: "O Ever-Living, O Sustainer of all",
      translation: "O Ever-Living, O Sustainer of all, by Your mercy I seek help. Set right all of my affairs and do not leave me to myself even for the blink of an eye.",
      arabic:
        "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَ لاَ تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
      latin: "Yâ Hayyû yâ Qayyûmu bi-rahmatika astaghîth. Aslih lî shanî kullah, wa lâ takilnî ilâ nafsî tarfata 'ayn.",
      source: "Sahîh At-Targhîb wa-t-Tarhîb n°661.",
    },
    {
      id: 13,
      title: "There is no deity except Allah (affirmation of His oneness)",
      translation: "There is no deity worthy of worship except Allah alone, without partner. To Him belongs sovereignty and to Him belongs praise, and He is capable of all things.",
      arabic:
        "لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَشَرِيكَ لَهُ، لَهُ المُلْكُ وَ لَهُ الحَمْدُ، وَ هُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
      latin: "Lâ ilâha illa-llâhu wahdahu lâ sharîka lah. Lahu-l-mulku wa lahu-l-hamdu, wa huwa 'alâ kulli shayin Qadîr.",
      source: "Sahîh Abû Dâwûd n°5077.",
    },
    {
      id: 14,
      title: "O Allah, preserve my body (3 times)",
      translation: "O Allah, preserve my body. O Allah, preserve my hearing. O Allah, preserve my sight. There is no deity worthy of worship except You. O Allah, I seek refuge in You from disbelief and poverty. I seek refuge in You from the punishment of the grave. There is no deity worthy of worship except You.",
      arabic:
        "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لاَ إِلَهَ إِلاَّ أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الكُفْرِ، وَ الفَقْرِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ القَبْرِ، لاَ إِلَهَ إِلاَّ أَنْتَ",
      latin: "Allâhumma 'âfinî fî badanî. Allâhumma 'âfinî fî sam'î. Allâhumma 'âfinî fî basarî...",
      source: "Sahîh Abû Dâwûd n°5090.",
    },
    {
      id: 15,
      title: "O Allah, I ask You for beneficial knowledge",
      translation: "O Allah, I ask You to grant me beneficial knowledge, lawful provision, and deeds that You accept.",
      arabic:
        "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْماً نَافِعاً، وَ رِزْقاً طَيِّباً، وَ عَمَلاً مُتَقَبَّلاً",
      latin: "Allâhumma innî asaluka 'ilman nâfi'â, wa rizqan tayyibâ, wa 'amalan mutaqabbalâ.",
      source: "Sahîh Ibn Mâjah n° 925.",
    },
    {
      id: 16,
      title: "We have entered the morning upon the natural way of Islam",
      translation: "We have entered the morning upon the natural way of Islam, the word of sincere monotheism, the religion of our Prophet Muhammad, and the way of our father Ibrahim, who worshipped Allah alone, submitted to Him, and was not among the polytheists.",
      arabic:
        "أَصْبَحْنَا عَلَى فِطْرَةِ الإِسْلاَمِ، وَ عَلَى كَلِمَةِ الإِخْلاَصِ، وَ عَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ وَ عَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفاً مُسْلِماً وَ مَا كَانَ مِنَ المُشْرِكِينَ",
      latin: "Asbahna 'alâ fitrati-l-islâm, wa 'alâ kalimati-l-ikhlâs...",
      source: "As-Sahîhah n° 2989.",
    },
    {
      id: 17,
      title: "I am pleased with Allah as my Lord",
      translation: "I am pleased with Allah as my Lord, Islam as my religion, and Muhammad as my Prophet.",
      arabic: "رَضِيتُ بِاللهِ رَبّاً وَ بِالإِسْلاَمِ دِيناً وَ بِمُحَمَّدٍ نَبِيّاً",
      latin: "Radîtu bi-llâhi rabban wa bi-l-islâmi dînan wa bi-Muhammadin nabiyyâ.",
      source: "As-Sahîhah n° 334.",
    },
    {
      id: 18,
      title: "Glory and praise be to Allah (3 times)",
      translation: "Glory and praise be to Allah, as many as His creatures, as much as pleases Him, equal to the weight of His Throne, and equal to the ink of His words.",
      arabic:
        "سُبْحَانَ اللهِ وَ بِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَ مِدَادَ كَلِمَاتِهِ",
      latin: "Subhâna-llâhi wa bi-hamdih, 'adada khalqih, wa ridâ nafsih, wa zinata 'arshih, wa midâda kalimâtih.",
      source: "Sahîh Muslim n° 2090.",
    },
    {
      id: 19,
      title: "Glory and praise be to Allah (100 times)",
      translation: "Glory and praise be to Allah.",
      arabic: "سُبْحَانَ اللهِ وَ بِحَمْدِهِ",
      latin: "Subhâna-llâhi wa bi-hamdih.",
      source: "Sahîh Muslim n° 2692.",
    },
    {
      id: 20,
      title: "There is no deity except Allah (10 times)",
      translation: "There is no deity worthy of worship except Allah alone, without partner. To Him belongs sovereignty and praise. He gives life and causes death, and He is capable of all things.",
      arabic:
        "لاَ إِلَهَ إِلاَّ اللهُ، وَحْدَهُ لاَشَرِيكَ لَهُ، لَهُ المُلْكُ وَ لَهُ الحَمْدُ، يُحْيِي وَ يُمِيتُ وَ هُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
      latin: "Lâ ilâha illa-llâhu wahdahu lâ sharîka lah. Lahu-l-mulku wa lahu-l-hamd, yuhyî wa yumît, wa huwa 'alâ kulli shayin Qadîr.",
      source: "As-Sahîhah n° 2563.",
    },
    {
      id: 21,
      title: "Istighfar, Tasbih, Hamd, Takbir, and Tahlil (100 times each)",
      translation: "I seek Allah's forgiveness (100 times). Glory be to Allah (100 times). Praise be to Allah (100 times). Allah is the Greatest (100 times). There is no deity worthy of worship except Allah alone, without partner. To Him belongs sovereignty and praise, and He is capable of all things (100 times).",
      arabic:
        "أَسْتَغْفِرُ اللهَ. سُبْحَانَ اللهِ. الحَمْدُ للهِ. اللهُ أَكْبَرُ. لاَ إِلَهَ إِلاَّ اللهُ، وَحْدَهُ لاَشَرِيكَ لَهُ، لَهُ المُلْكُ وَ لَهُ الحَمْدُ وَ هُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
      latin: "Astaghfiru-llâh. Subhâna-llâh. Al-hamdu li-llâh. Allâhu akbar. Lâ ilâha illa-llâhu wahdahu lâ sharîka lah...",
      source: "As-Sahîhah n° 1600 & Sahîh At-Targhîb wa-t-Tarhîb n°658.",
    },
  ],

  "invocations-du-soir": [
    {
      id: 1,
      title: "Recite Ayat al-Kursi",
      translation: "Allah! There is no deity except Him, the Ever-Living, the Sustainer of all. Neither drowsiness nor sleep overtakes Him. To Him belongs whatever is in the heavens and whatever is on Earth...",
      arabic:
        "اللهُ لاَ إِلَهَ إِلاَّ هُوَ الحَيُّ القَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَ لاَ نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَ مَا فِي الأَرْضِ...",
      source: "Sahîh Al-Kalim At-Tayyib n° 22.",
    },
    {
      id: 2,
      title: "The last three surahs",
      translation: "Recite the last three surahs of the Quran: Surah Al-Ikhlas, Al-Falaq, and An-Nas.",
      source: "Sahîh At-Tirmidhî n° 3575.",
    },
    {
      id: 3,
      title: "Surah Al-Ikhlas (3 times)",
      translation: "Say: He is Allah, the One. Allah, the One upon Whom all depend...",
      arabic: "قُلْ هُوَ اللهُ أَحَدٌ ۞ اللهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
      source: "Sourate 112.",
    },
    {
      id: 4,
      title: "Surah Al-Falaq (3 times)",
      translation: "Say: I seek refuge in the Lord of daybreak...",
      arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۞ مِنْ شَرِّ مَا خَلَقَ...",
      source: "Sourate 113.",
    },
    {
      id: 5,
      title: "In the name of Allah (3 times)",
      translation: "In the name of Allah, with Whose name nothing on Earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
      arabic:
        "بِسْمِ اللهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَ لاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ العَلِيمُ",
      latin: "Bi-smi-llâhi-lladhî lâ yadurru ma'a-smihi shayun fi-l-ardi wa lâ fi-s-samâi wa huwa-s-Samî'-ul-'Alîm.",
      source: "Sahîh At-Tirmidhî n° 3388.",
    },
    {
      id: 6,
      title: "Protection through Allah's perfect words (3 times)",
      translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
      arabic: "أَعُوذُ بِكلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
      latin: "A'ûdhu bi-kalimati-llâhi-t-tâmmâti min sharri mâ khalaq.",
      source: "Sahîh Muslim n° 2709.",
    },
    {
      id: 7,
      title: "O Allah, by You we enter the evening",
      translation: "O Allah, by You we enter the evening and by You we enter the morning. By You we live and by You we die, and to You is our final return.",
      arabic:
        "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَ بِكَ أَصْبَحْنَا، وَ بِكَ نَحْيَا، وَ بِكَ نَمُوتُ وَ إِلَيْكَ المَصِيرُ",
      latin: "Allâhumma bika amsaynâ, wa bika asbahnâ, wa bika nahyâ, wa bika namût, wa ilayka-l-masîr.",
      source: "As-Sahîhah n° 262.",
    },
    {
      id: 8,
      title: "We have entered the evening and sovereignty belongs to Allah",
      translation: "We have entered the evening and sovereignty belongs to Allah. Praise be to Allah. There is no deity except Allah alone, without partner... My Lord, I ask You for the good of this night and the good that follows it, and I seek refuge in You from the evil of this night and the evil that follows it. My Lord, I seek refuge in You from laziness and the evils of old age. I seek refuge in You from the punishment of the Fire and the punishment of the grave.",
      arabic:
        "أَمْسَيْنَا وَ أَمْسَى المُلْكُ للهِ وَ الحَمْدُ للهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحدَهُ لاَشَرِيكَ لَهُ...",
      latin: "Amsaynâ wa amsa-l-mulku li-llâhi wa-l-hamduli-llâh...",
      source: "Sahîh Muslim n° 2723.",
    },
    {
      id: 9,
      title: "We have entered the evening and dominion belongs to Allah",
      translation: "We have entered the evening and dominion belongs to Allah, Lord of the worlds. O Allah, I ask You for the good of this night: its openings, victories, light, blessings, and guidance. I seek refuge in You from the evil within it and the evil that follows it.",
      arabic:
        "أَمْسَيْنَا وَ أَمْسَى المُلْكُ للهِ رَبِّ العَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذِهِ اللَّيلَةِ...",
      latin: "Amsaynâ wa amsâ-l-mulku li-llâhi Rabbi-l-'âlamîn...",
      source: "Sahîh Al-Jâmi' n° 352.",
    },
    {
      id: 10,
      title: "O Allah, You are my Lord (evening)",
      translation: "O Allah, You are my Lord. There is no deity except You. You created me and I am Your servant... Forgive me, for no one forgives sins except You.",
      arabic:
        "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَ أَنَا عَبْدُكَ...",
      source: "Sahîh Al-Bukhârî n° 5947.",
    },
  ],

  "doua-apres-priere": [
    {
      id: 1,
      title: "Seeking forgiveness and peace",
      translation: "I seek Allah's forgiveness [three times]. O Lord, You are Peace and peace comes from You. Blessed are You, O Possessor of majesty and honor.",
      arabic:
        "أَسْـتَغْفِرُ الله . (ثَلاثاً) اللّهُـمَّ أَنْـتَ السَّلامُ ، وَمِـنْكَ السَّلام تَبارَكْتَ يا ذا الجَـلالِ وَالإِكْـرام",
      latin: "Astaghfiru l-lâha (3 fois). Allâhumma anta s-salâmu wa minka s-salâmu, tabârakta yâ dhâ-l-jalâli wa-l-ikrâm.",
    },
    {
      id: 2,
      title: "There is no deity but Allah",
      translation: "There is no deity but Allah alone, without partner. To Him belongs sovereignty and praise, and He is capable of all things. O Lord, none can withhold what You have given, and none can give what You have withheld. No wealth can protect its owner from You.",
      arabic:
        "لا إلهَ إلاّ اللّهُ وحدَهُ لا شريكَ لهُ، لهُ المُـلْكُ ولهُ الحَمْد، وَهُوَ على كلّ شَيءٍ قَدير، اللّهُـمَّ لا مانِعَ لِما أَعْطَـيْت وَلا مُعْطِـيَ لِما مَنَـعْت...",
      latin: "Lâ ilâha illâ l-lâhu, wahdahu lâ sharîka lahu, lahu-l-mulku wa lahu-l-hamdu wa huwa 'alâ kulli shay'in qadîr...",
    },
    {
      id: 3,
      title: "Tahlil and Hawqala",
      translation: "There is no deity but Allah alone, without partner. To Him belongs sovereignty and praise, and He is capable of all things. There is no might or power except through Allah. There is no deity but Allah, and we worship none but Him. To Him belong grace and generosity, and to Him belongs beautiful praise. There is no deity but Allah. We worship Him sincerely, even if the disbelievers detest it.",
      arabic:
        "لا إلهَ إلاّ اللّه, وحدَهُ لا شريكَ لهُ، لهُ الملكُ ولهُ الحَمد، وَهُوَ على كلّ شيءٍ قدير، لا حَـوْلَ وَلا قـوَّةَ إِلاّ بِاللهِ...",
      latin: "Lâ ilâha illâ l-lâhu, wahdahu lâ sharîka lahu... Lâ hawla wa lâ quwwata illâ bi-l-lâhi...",
    },
    {
      id: 4,
      title: "Subhanallah, Alhamdulillah, Allahu Akbar (33 times)",
      translation: "Glory be to Allah, praise be to Allah, and Allah is the Greatest [thirty-three times]. There is no deity but Allah alone, without partner. To Him belongs sovereignty and praise, and He is capable of all things.",
      arabic:
        "سُـبْحانَ اللهِ، والحَمْـدُ لله ، واللهُ أكْـبَر .ثلاثاً وثلاثين لا إلهَ إلاّ اللّهُ وَحْـدَهُ لا شريكَ لهُ، لهُ الملكُ ولهُ الحَمْ د، وهُوَ على كُلّ شَيءٍ قَـدير",
      latin: "Subhâna l-lâhi, wa-l-hamdu li-l-lâhi, wa l-lâhu akbar (33 fois). Lâ ilâha illâ l-lâhu, wahdahu lâ sharîka lahu...",
    },
    {
      id: 5,
      title: "The last three surahs (after every prayer)",
      translation: "Recite Surah Al-Ikhlas, Al-Falaq, and An-Nas [each surah three times] after every prayer.",
      arabic: "قُـلْ هُـوَ اللهُ أَحَـدٌ ….. الإِخْـلاصْ قُـلْ أَعـوذُ بِرَبِّ الفَلَـقِ….. الفَلَـقْ قُـلْ أَعـوذُ بِرَبِّ النّـاسِ….. الـنّاس",
      source: "Après chaque prière.",
    },
    {
      id: 6,
      title: "Ayat al-Kursi (after every prayer)",
      translation: "Allah! There is no deity except Him, the Ever-Living, the One who eternally sustains all things. Neither drowsiness nor sleep overtakes Him. To Him belongs whatever is in the heavens and on Earth...",
      arabic:
        "للهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ...",
      latin: "Allâhu lâ ilâha illâ huwa-l-hayyu-l-qayyûm...",
    },
    {
      id: 7,
      title: "Beneficial knowledge and provision (after Fajr)",
      translation: "O Lord, I ask You for beneficial knowledge, good provision, and accepted deeds. [To be said after the Fajr prayer]",
      arabic:
        "اللّهُـمَّ إِنِّـي أَسْأَلُـكَ عِلْمـاً نافِعـاً وَرِزْقـاً طَيِّـباً ، وَعَمَـلاً مُتَقَـبَّلاً",
      latin: "Allâhumma innî as'aluka 'ilman nâfi'an, wa rizqan tayyiban, wa 'amalan mutaqabbalan.",
    },
  ],

  "doua-avant-manger": [
    {
      id: 1,
      title: "In the name of Allah",
      translation: "In the name of Allah",
      arabic: "بِسْمِ اللهِ",
      latin: "Bismillâhi",
    },
    {
      id: 2,
      title: "Blessing in the food",
      translation: "Place Your blessing for us in this food and grant us food better than it.",
      arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيْهِ، وَأَطْعِمْنَا خَيْراً مِنْهُ",
      latin: "Allâhoumma bârik lanâ fîhi, wa at'imnâ khayran minhou.",
    },
    {
      id: 3,
      title: "Before drinking milk",
      translation: "O Allah, bless it for us and give us more of it.",
      arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيْهِ، وَزِدْنَا مِنْهُ",
      latin: "Allâhoumma bârik lanâ fîhi wa zidnâ minhou.",
    },
    {
      id: 4,
      title: "Dua for breaking the fast (iftar)",
      translation: "The thirst has gone, the veins are moistened, and the reward is assured, if Allah wills.",
      arabic: "ذَهَبَ الظَّمَأُ، وَابْتَلَّتِ العُرُوقُ، وَثَبَتَ الأجْرُ إِنْ شَاءَ اللهُ",
      latin: "Dhahaba z-zama u wa btallati-l-'ouroûqou wa thabata-l-ajrou in shâ a l-lâhou.",
    },
    {
      id: 5,
      title: "Another dua for iftar",
      translation: "O Allah, I ask You, by Your mercy which encompasses all things, to forgive me.",
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ، أَنْ تَغْفِرَ لِي",
      latin: "Allâhoumma innî as alouka bi-rahmatika l-lâti wasi'at koulla shay in an taghfira lî.",
    },
  ],

  "doua-avant-dormir": [
    {
      id: 1,
      title: "Ayat al-Kursi",
      translation: "Allah! There is no deity except Him, the Ever-Living, the Sustainer of all. Neither drowsiness nor sleep overtakes Him...",
      arabic:
        "اللهُ لاَ إِلَهَ إِلاَّ هُوَ الحَيُّ القَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَ لاَ نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَ مَا فِي الأَرْضِ...",
      source: "Sahîh Al-Kalim At-Tayyib n° 22.",
    },
    {
      id: 2,
      title: "In Your name I die and I live",
      translation: "In Your name, O Allah, I die and I live.",
      arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَ أَحْيَا",
      latin: "Bi-smika-llâhoumma amûtu wa ahyâ.",
      source: "Mukhtasar Al-Bukhârî n° 2425.",
    },
    {
      id: 3,
      title: "In Your name, my Lord, I lie down",
      translation: "In Your name, my Lord, I lie down, and by Your name I rise. If You take my soul, have mercy on it; and if You return it to my body, protect it as You protect Your righteous servants.",
      arabic:
        "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَ بِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَ إِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ",
      latin: "Bi-smika Rabbî wada'tu janbî wa bika arfa'uh. Fa-in amsakta nafsî, fa-rhamhâ. Wa In arsaltahâ fa-hfadh-hâ bi-mâ tahfadhu bi-hi 'ibâdaka-s-sâlihîn.",
      source: "Al-Bukhârî n° 6320.",
    },
    {
      id: 4,
      title: "O Allah, Knower of the unseen and the seen",
      translation: "O Allah, Knower of the unseen and the seen, Creator of the heavens and the Earth, Lord and Sovereign of all things, I testify that there is no deity except You. I seek refuge in You from the evil of my soul, from the evil of Satan and his polytheism, and from bringing harm upon myself or upon another Muslim.",
      arabic:
        "اللَّهُمَّ عَالِمَ الغَيْبِ وَ الشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَ الأَرْضِ رَبَّ كُلِّ شَيْءٍ وَ مَلِيكَهُ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَ مِنْ شَرِّ الشَّيْطَانِ وَ شِرْكِهِ...",
      latin: "Allâhumma 'Âlima-l-ghaybi wa-sh-shahâdah, Fâtira-s-samâwâti wa-l-ard...",
      source: "Sahîh Al-Kalim At-Tayyib n° 21.",
    },
    {
      id: 5,
      title: "O Allah, spare me Your punishment",
      translation: "O Allah, spare me Your punishment on the day You resurrect Your servants!",
      arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
      latin: "Allâhumma qinî 'adhâbaka yawma tab'athu 'ibâdak.",
      source: "As-Sahîhah n° 2754.",
    },
    {
      id: 6,
      title: "Praise be to Allah who fed us and gave us drink",
      translation: "Praise be to Allah who fed us, gave us drink, met all our needs, and gave us shelter; for many have no one to meet their needs or shelter them.",
      arabic: "الحَمْدُ للهِ الَّذِي أَطْعَمَنَا وَ سَقَانَا، وَ كَفَانَا، وَ آوَانَا، فَكَمْ مِمَّنْ لاَ كَافِيَ لَهُ وَ لاَ مُؤْوِيَ",
      latin: "Al- hamdu li-llâhi-llâdhi at'amanâ, wa saqânâ, wa kafânâ, wa âwânâ...",
      source: "Mukhtasar Muslim n° 1901.",
    },
    {
      id: 7,
      title: "O Allah, You created my soul",
      translation: "O Allah, You created my soul and You take it back; its death and its life belong to You. If You keep it alive, protect it, and if You cause it to die, forgive it. O Allah, I ask You to grant me well-being.",
      arabic:
        "اللَّهُمَّ أَنْتَ خَلَقْتَ نَفْسِي وَ أَنْتَ تَوَفَّاهَا لَكَ مَمَاتُهَا وَ مَحْيَاهَا، إِنْ أَحْيَيْتَهَا فاحْفَظْهَا ، وَ إِنْ أَمَتَّهَا فَاغْفِرْ لَهَا. اللَّهُمَّ إِنَّي أَسْأَلُكَ العَافِيَةَ",
      latin: "Allâhumma anta khalaqta nafsî wa anta tawaffâhâ...",
      source: "Mukhtasar Muslim n° 1898.",
    },
    {
      id: 8,
      title: "O Allah, Lord of the heavens and the earths",
      translation: "O Allah, Lord of the heavens and Lord of the earths, our Lord and the Lord of all things. Splitter of the grain and date stone, Revealer of the Torah, the Gospel, and the Quran, I seek refuge in You from the evil of every wicked being under Your control... Settle my debt and protect me from poverty.",
      arabic:
        "اللَّهُمَّ رَبَّ السَّمَاوَاتِ وَ رَبَّ الأَرَضِينَ، وَ رَبَّنَا وَ رَبَّ كُلِّ شَيْءٍ، فَالِقَ الحَبِّ وَ النَّوَى، وَ مُنْزِلَ التَّوْرَاةِ وَ الإِنْجِيلِ وَ القُرْآنِ... اقْضِ عَنِّي الدَّيْنَ وَ أَغْنِنِي مِنَ الفَقْرِ",
      latin: "Allâhumma Rabba-s-samâwâti wa Rabba-l-aradîn...",
      source: "Sahîh At-Tirmidhî n° 3400.",
    },
    {
      id: 9,
      title: "O Allah, I have submitted myself to You",
      translation: "O Allah, I have submitted myself to You and entrusted all my affairs to You. I rely upon You in all things. I turn to You with hope and fear. There is no refuge or escape from You except with You. I believe in the Book You revealed and in the Prophet You sent.",
      arabic:
        "اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَ وَجَّهْتُ وَجْهِي إِلَيْكَ، وَ فَوَّضْتُ أَمْرِي إِلَيْكَ، وَ أَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَ رَهْبَةً إِلَيْكَ، لاَ مَلْجَأَ وَ لاَ مَنْجَا مِنْكَ إِلاَّ إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ وَ بِنَبِيِّكَ الَّذِي أَرْسَلْتَ",
      latin: "Allâhumma aslamtu nafsî ilayk, wa wajjahtu wajhî ilayk...",
      source: "Mukhtasar Al-Bukhârî n° 2426.",
    },
    {
      id: 10,
      title: "Tahlil and Hawqala before sleeping",
      translation: "There is no deity worthy of worship except Allah alone, without partner. To Him belong sovereignty and praise, and He is capable of all things. There is no might or power except through Allah. Glory be to Allah, praise be to Allah, there is no deity except Allah, and Allah is the Greatest.",
      arabic:
        "لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَشَرِيكَ لَهُ، لَهُ المُلْكُ وَ لَهُ الحَمْدُ، وَ هُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، وَ لاَ حَوْلَ وَ لاَ قُوَّةَ إِلاَّ بِاللهِ. سُبْحَانَ اللهِ، وَ الحَمْدُ للهِ، وَ لاَ إِلَهَ إِلاَّ اللهُ، وَ اللهُ أَكْبَرُ",
      latin: "Lâ ilâha illa-llâhu wahdahu lâ sharîka lah...",
      source: "As-Sahîhah n° 3414.",
    },
    {
      id: 11,
      title: "Praise be to Allah who met my needs and sheltered me",
      translation: "Praise be to Allah who met all my needs and sheltered me. Praise be to Allah who fed me and gave me drink. Praise be to Allah who bestowed His favors upon me and honored me. O Allah, I ask You by Your might to save me from the Fire.",
      arabic:
        "الحَمْدُ للهِ الَّذِي كَفَانِي وَ آوَانِي، الحَمْدُ للهِ الَّذِي أَطْعَمَنِي وَ سَقَانِي، الحَمْدُ للهِ الَّذِي مَنَّ عَلَيَّ وَ أَفْضَلَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ بِعِزَّتِكَ أَنْ تُنَجِّيَنِي مِنَ النَّارِ",
      latin: "Al-hamdu li-llâhi-llâdhi kafânî wa âwânî...",
      source: "As-Sahîhah n° 3444.",
    },
    {
      id: 12,
      title: "In the name of Allah I lie down",
      translation: "In the name of Allah I lie down. O Allah, forgive my sins, drive away my devil, release me from my obligations, make my scale heavy, and place me in the highest assembly with the angels.",
      arabic:
        "بِسْمِ اللهِ وَضَعْتُ جَنْبِي، اللَّهُمَّ اغْفِرْ لِي ذَنْبِي، وَ اخْسَأْ شَيْطَانِي، وَ فُكَّ رِهَانِي، وَ ثَقِّلْ مِيزَانِي، وَ اجْعَلْنِي فِي النَّدِيِّ الأَعْلَى",
      latin: "Bi-smi-llâhi wada'tu janbî. Allâhumma ghfir lî dhanbî, wa khsa shaytânî...",
      source: "Sahîh Al-Jâmi' n° 4649.",
    },
    {
      id: 13,
      title: "The last three surahs and wiping the body (3 times)",
      translation: "Every night when going to bed, the Prophet (صلى الله عليه وسلم) joined his hands, lightly blew into them, and recited the last three surahs of the Quran: Al-Ikhlas, Al-Falaq, and An-Nas. He then wiped his hands over as much of his body as he could reach, beginning with his head, then his face, and then the front of his body [repeating this 3 times].",
      arabic:
        "قُلْ هُوَ اللهُ أَحَدٌ، وَ قُلْ أَعُوذُ بِرَبِّ الفَلَقِ، وَ قُلْ أَعُوذُ بِرَبِّ النَّاسِ، ثُمَّ مَسَحَ بِهِمَا مَا اسْتَطَاعَ مِنْ جَسَدِهِ...",
      source: "Mukhtasar Al-Bukhârî n° 2025.",
    },
    {
      id: 14,
      title: "Glorification: 33, 33, 34",
      translation: "Glory be to Allah [33 times], praise be to Allah [33 times], and Allah is the Greatest [34 times].",
      arabic:
        "سُبْحَانَ اللهِ (ثَلاَثاً وَ ثَلاَثِينَ)، الحَمْدُ للهِ (ثَلاَثاً وَ ثَلاَثِينَ)، اللهُ أَكْبَرُ(أَرْبَعاً وَ ثَلاَثِينَ.)",
      latin: "Subhâna-llâh [33], al-hamdu li-llâh [33], Allâhu akbar [34].",
      source: "As-Sahîhah n° 3596.",
    },
    {
      id: 15,
      title: "Amanar-Rasul (last verses of Al-Baqarah)",
      translation: "The Messenger believes in what was revealed to him from his Lord, as do the believers. All believe in Allah, His angels, His Books, and His messengers... Our Lord, we seek Your forgiveness, and to You is the final return... [Surah Al-Baqarah, verses 285–286]",
      arabic:
        "آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَ الْمُؤْمِنُونَ كُلٌّ آمَنَ بِاللهِ وَ مَلاَئِكَتِهِ وَ كُتُبِهِ وَ رُسُلِهِ... غُفْرَانَكَ رَبَّنَا وَ إِلَيْكَ الْمَصِيرُ...",
      source: "Sahîh Al-Bukhârî n° 5009 et Sahîh Muslim n°808.",
    },
  ],

  "invocations-voyage": [
    {
      id: 1,
      title: "The traveler's invocation (dua for travel)",
      translation: "Allah is the Greatest, Allah is the Greatest, Allah is the Greatest. Glory be to Him who has subjected this to us, though we could not have controlled it, and surely to our Lord we will return. O Allah, we ask You on this journey for righteousness, piety, and deeds that please You. O Allah, make this journey easy for us and shorten its distance. O Allah, You are our companion on the journey and the guardian of our families. O Allah, I seek refuge in You from the hardship of travel, from any distressing sight, and from returning to misfortune in our wealth or family.",
      arabic:
        "اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، اللهُ أَكْبَرُ سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَ مَا كُنَّا لَهُ مُقْرِنِينَ وَ إِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ، اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا البِرَّ وَ التَّقْوَى، وَ مِنَ العَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَ اطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ، وَ الخَلِيفَةُ فِي الأَهْلِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ وَعْثَاءِ السَّفَرِ، وَ كآبَةِ المَنْظَرِ وَ سُوءِ المُنْقَلَبِ فِي المَالِ وَ الأَهْلِ",
      latin: "Allâhu akbar, Allâhu akbar, Allâhu akbar. Subhâna-lladhî sakh-khara lanâ hâdhâ wa mâ kunnâ lahu muqrinîn, wa innâ ilâ Rabbinâ la-munqalibûn...",
      source: "Sahîh At-Tirmidhî n° 3388.",
    },
    {
      id: 2,
      title: "Upon returning from a journey",
      translation: "We return, repentant, devoted in worship, and praising our Lord.",
      arabic: "آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ",
      latin: "Âyibûn, tâibûn, 'âbidûn, li-Rabbinâ hâmidûn.",
      source: "Sahîh At-Tirmidhî n° 3388.",
    },
  ],

  "doua-apres-adhan": [
    {
      id: 1,
      title: "Repeat after the muezzin",
      translation: "Repeat what the muezzin says, except after “Come to prayer” and “Come to success.” Whenever these phrases are said, say: There is no might or power except through Allah.",
      arabic: "يَقُولُ مِثْلَ مَا يَقُولُ المُؤَذِّنُ إلَّا فِي «حَيَّ عَلَى الصَّلاةِ» وَ «حَيَّ عَلَى الفَلاحِ» فَيَقُولُ : «لَا حَولَ وَ لَا قُوَّةَ إلَّا بِاللهِ»",
      latin: "Lâ hawla wa lâ qouwwata illâ billâhi.",
    },
    {
      id: 2,
      title: "Send blessings upon the Prophet after the adhan",
      translation: "Send blessings upon the Prophet (sallallahu 'alayhi wa sallam) at the end of the call to prayer.",
      arabic: "يُصَلِّي عَلَى النَّبِي صلى الله عليه وسلم بَعْدَ فَرَاغِهِ مِنْ إِجَابَةِ المُؤَذِّنِ",
      latin: "Allâhoumma salli 'alâ sayyidinâ mouhammadin wa 'alâ âlihi wa sahbihi wa sallim.",
      source: "Rapporté par Mouslim (#384).",
    },
    {
      id: 3,
      title: "Invocation after the adhan",
      translation: "O Allah, Lord of this perfect call and the prayer about to be established, grant Muhammad the right of intercession and the place of honor, and raise him to the praised station You have promised him. [Indeed, You never break Your promise.]",
      arabic:
        "اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ ، وَالصَّلاةِ القَائِمَةِ ، آتِ مُحَمَّداً الوَسِيْلَةَ وَالفَضِيْلَةَ ، وَابْعَثْهُ مَقَاماً مَحْمُوْداً الَّذِي وَعَدْتَهُ ، [إِنَّكَ لاَ تُخْلِفُ الْمِيعَادِ]",
      latin: "Allâhoumma rabba hâdhihi d-da'wati t-âmmati, wa s-salâti-l-qâ imati. Âti mouhammadan al wasîlata wa-l-fadîlata, wa b'ath-hou maqâman mahmûdan al-ladhî wa'adtahou. [Innaka lâ toukhlifou-l-mî'âd.]",
      source: "Rapporté par al-Boukhari.",
    },
  ],

  "doua-protection": [
    {
      id: 1,
      title: "Ayat al-Kursi for protection",
      translation: "Allah! There is no deity except Him, the Ever-Living, the Sustainer of all. Neither drowsiness nor sleep overtakes Him. To Him belongs whatever is in the heavens and whatever is on Earth... (This invocation may be recited to ask Allah to protect us from every form of harm, such as jinn, the evil eye, sorcery, or any other external threat.)",
      arabic:
        "اللهُ لاَ إِلَهَ إِلاَّ هُوَ الحَيُّ القَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَ لاَ نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَ مَا فِي الأَرْضِ...",
      source: "Sourate Al-Baqarah, verset 255.",
    },
    {
      id: 2,
      title: "The last three surahs",
      translation: "Recite the last three surahs of the Quran: Al-Ikhlas, Al-Falaq, and An-Nas (3 times each).",
      source: "Sahîh At-Tirmidhî n° 3575.",
    },
    {
      id: 3,
      title: "In the name of Allah (3 times)",
      translation: "In the name of Allah, with Whose name nothing on Earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
      arabic:
        "بِسْمِ اللهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَ لاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ العَلِيمُ",
      latin: "Bi-smi-llâhi-lladhî lâ yadurru ma'a-smihi shayun fi-l-ardi wa lâ fi-s-samâi wa huwa-s-Samî'-ul-'Alîm.",
      source: "Sahîh At-Tirmidhî n° 3388.",
    },
    {
      id: 4,
      title: "Protection for children",
      translation: "I seek refuge for you both in the perfect words of Allah from every devil, every harmful creature, and every evil eye.",
      arabic: "أُعِيذُكُمَا بِكَلِمَاتِ اللهِ التَّامَّةِ، مِنْ كُلِّ شَيْطَانٍ وَ هَامَّةٍ، وَ مِنْ كُلِّ عَيْنٍ لاَمَّةٍ",
      latin: "U'îdhukumâ bi-kalimâti-llâhi-t-tâmmah, min kulli shaytânin wa hâmmah, wa min kulli 'aynin lâmmah.",
      source: "Sahîh Al-Kalim At-Tayyib n° 118.",
    },
  ],

  "doua-tristesse": [
    {
      id: 1,
      title: "Invocation against sadness",
      translation: "O Allah, I am Your servant, the son of Your servant, the son of Your maidservant. My forelock is in Your hand. Your judgment over me is carried out, and Your decree concerning me is just. I ask You by every name that belongs to You, by which You have named Yourself, revealed in Your Book, taught to any of Your creation, or kept with You in the knowledge of the unseen, to make the Quran the spring of my heart, the light of my chest, the remover of my sadness, and the end of my worries.",
      arabic:
        "اللَّهُمَّ إِنِّي عَبْدُكَ ابْنُ عَبْدِكَ ابْنُ أَمَتِكَ نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤكَ أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ سَمَّيْتَ بِهِ نَفْسَكَ أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ، أَوْ عَلَّمْتَهُ أَحَداً مِنْ خَلْقِكَ أَوِ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الغَيْبِ عِنْدَكَ أَنْ تَجْعَلَ القُرْآنَ رَبِيعَ قَلْبِي، وَ نُورَ صَدْرِي وَ جَلاَءَ حُزْنِي وَ ذِهَابَ هَمِّي",
      latin: "Allâhumma innî 'abduka bnu 'abdika bnu amatik. Nâsiyatî bi-yadik. Mâdin fiyya hukmuk, 'adlun fiyya qadâuk. Asaluka bi-kulli-smin huwa laka sammayta bihi nafsak...",
      source: "Ahmed (1/391). Al-Albani l'a authentifié dans al-Kalim at-Tayyib (#124).",
    },
    {
      id: 2,
      title: "Another dua against sadness",
      translation: "O Allah, I seek refuge in You from worry and sadness, from weakness and laziness, from miserliness and cowardice, from the burden of debt, and from being overpowered by others.",
      arabic:
        "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الهَمِّ وَ الْحَـزَنِ، والعَجْـزِ والكَسَلِ، والبُخْلِ والجُبْنِ، وضَلَعِ الدَّيْنِ وغَلَبَةِ الرِّجَالِ",
      latin: "Allâhoumma innî a'oûdhou bika mina-l-hammi wa-l-hazani, wa-l-'ajzi wa-l-kasali, wa-l-boukhli wa-l-joubni, wa dala'i d-dayni wa ghalabati r-rijâl.",
      source: "Al-Boukhari (#6363).",
    },
  ],

  "doua-mosquee": [
    {
      id: 1,
      title: "On the way to the mosque",
      translation: "An invocation to say while going to the mosque.",
      arabic: "",
      source: "Voir fiche invocation-allant-mosquee.",
    },
    {
      id: 2,
      title: "Upon entering the mosque",
      translation: "An invocation to say when entering the mosque.",
      arabic: "",
      source: "Voir fiche doua-invocation-entrant-mosquee.",
    },
    {
      id: 3,
      title: "Upon leaving the mosque",
      translation: "An invocation to say when leaving the mosque.",
      arabic: "",
      source: "Voir fiche invocation-doua-sortant-mosquee.",
    },
  ],

  "doua-quotidien": [
    {
      id: 1,
      title: "Upon waking",
      translation: "Praise be to Allah who restored us to life after causing us to die, and to Him is the resurrection.",
      arabic: "الحَمْدُ للهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
      latin: "Al-hamdu li-llâhi-lladhî ahyânâ ba'da mâ amâtanâ wa ilayhi-n-nushûr.",
    },
    {
      id: 2,
      title: "When getting dressed",
      translation: "In the name of Allah. O Allah, I ask You for its good and the good for which it was made, and I seek refuge in You from its evil and the evil for which it was made.",
      arabic: "بِسْمِ اللهِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ خَيْرِهِ وَخَيْرِ مَا هُوَ لَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّهِ وَشَرِّ مَا هُوَ لَهُ",
      latin: "Bismi-llâh. Allâhumma innî as'aluka min khayrihi wa khayri mâ huwa lah, wa a'ûdhu bika min sharrihi wa sharri mâ huwa lah.",
    },
    {
      id: 3,
      title: "Upon entering the restroom",
      translation: "O Allah, I seek refuge in You from male and female devils.",
      arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبْثِ وَالْخَبَائِثِ",
      latin: "Allâhumma innî a'ûdhu bika mina-l-khubthi wa-l-khabâ'ith.",
    },
    {
      id: 4,
      title: "Upon leaving the restroom",
      translation: "I seek Your forgiveness. Praise be to Allah who removed the harm from me and granted me well-being.",
      arabic: "غُفْرَانَكَ، الحَمْدُ للهِ الَّذِي أَذْهَبَ عَنِّي الأَذَى وَعَافَانِي",
      latin: "Ghufrânak. Al-hamdu li-llâhi-lladhî adhhaba 'annî l-adhâ wa 'âfânî.",
    },
  ],
};

/** Returns the English local categories. */
export function getLocalCategoriesEn(): DuaCategory[] {
  return LOCAL_CATEGORIES_EN.map((c) => ({
    ...c,
    total: DUAS_BY_SLUG[c.slug]?.length ?? 0,
  }));
}

/** Returns an English category display name by slug. */
export function getCategoryNameBySlugEn(slug: string): string | undefined {
  return LOCAL_CATEGORIES_EN.find((c) => c.slug === slug)?.name;
}

/** Returns the English local invocations for a category. */
export function getLocalCategoryDuasEn(slug: string): DuaItem[] {
  return DUAS_BY_SLUG[slug] ?? [];
}

/** Returns an English local invocation by category slug and id. */
export function getLocalDuaDetailEn(slug: string, id: number): DuaDetail | null {
  const list = DUAS_BY_SLUG[slug];
  if (!list) return null;
  const item = list.find((d) => d.id === id);
  if (!item) return null;
  const category = LOCAL_CATEGORIES_EN.find((c) => c.slug === slug);
  return {
    ...item,
    categorySlug: slug,
    categoryName: category?.name,
  };
}

/** Checks whether a slug belongs to the English local data. */
export function hasLocalCategoryEn(slug: string): boolean {
  return slug in DUAS_BY_SLUG || LOCAL_CATEGORIES_EN.some((c) => c.slug === slug);
}
