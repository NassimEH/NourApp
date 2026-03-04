import type { WeatherImageKey } from "@/lib/useWeather";

export const weatherImages: Record<WeatherImageKey, number> = {
  orage: require("@/assets/images/villes/orage.png"),
  neige: require("@/assets/images/villes/neige.png"),
  pluie: require("@/assets/images/villes/pluie.png"),
  brouillard: require("@/assets/images/villes/brouillard.png"),
  crépuscule: require("@/assets/images/villes/crépuscule.png"),
  nuageux: require("@/assets/images/villes/nuageux.png"),
};

export const WEATHER_DOU3A: Record<
  WeatherImageKey,
  { dou3a: string; reason: string }
> = {
  pluie: {
    dou3a: "اللَّهُمَّ صَيِّباً نَافِعاً — Allâhumma sayyiban nâfi'an. « Ô Allah, (fais qu'il tombe) une pluie bénéfique. »",
    reason: "La pluie est un moment privilégié où les invocations sont exaucées ; le Prophète (ﷺ) nous a enseigné cette invocation lorsqu'il pleut.",
  },
  orage: {
    dou3a: "سُبْحَانَ الَّذِي يُسَبِّحُ الرَّعْدُ بِحَمْدِهِ وَالْمَلَائِكَةُ مِنْ خِيفَتِهِ — Gloire à Celui que le tonnerre glorifie par Sa louange, ainsi que les anges par crainte de Lui.",
    reason: "L'orage rappelle la puissance d'Allah ; il est recommandé de glorifier Allah et de se rappeler de Lui quand on entend le tonnerre.",
  },
  neige: {
    dou3a: "اللَّهُمَّ احْفَظْنَا مِنْ شَرِّ الْبَرْدِ وَالثَلْجِ — Allâhumma hfaznâ min charri al-bardi wa at-thalj. « Ô Allah, préserve-nous du mal du froid et de la neige. »",
    reason: "Le froid et la neige nous invitent à demander la protection d'Allah et à être reconnaissants pour l'abri qu'Il nous accorde.",
  },
  brouillard: {
    dou3a: "بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ — Bismi Llâhi lladhî lâ yadurru ma'a smihi shay'. « Au nom d'Allah, avec le nom de qui rien ne peut nuire. »",
    reason: "Le brouillard réduit la visibilité ; invoquer Allah nous rappelle de nous en remettre à Lui pour la sécurité et la clarté du chemin.",
  },
  crépuscule: {
    dou3a: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ — Amsaynâ wa amsâ al-mulku li Llâh. « Nous avons atteint le soir, et la royauté appartient à Allah. »",
    reason: "Le crépuscule est le moment des adhkâr du soir ; il rappelle que le jour et la nuit appartiennent à Allah.",
  },
  nuageux: {
    dou3a: "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْيَوْمِ — Allâhumma innî as'aluka khayra hâdhâ al-yawm. « Ô Allah, je Te demande le bien de ce jour. »",
    reason: "Un temps nuageux ou doux nous invite à demander à Allah le bien du jour et à Lui être reconnaissants pour Ses bienfaits.",
  },
};
