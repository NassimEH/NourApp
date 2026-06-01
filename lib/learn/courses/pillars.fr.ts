import type { LearnCourse } from "../types";

export const PILLARS_COURSE_ID = "pillars-islam";

export const PILLARS_COURSE: LearnCourse = {
  id: PILLARS_COURSE_ID,
  title: "Les piliers de l'Islam",
  subtitle: "Les cinq piliers — introduction (3 leçons)",
  lessons: [
    {
      id: "pillars-shahada",
      order: 1,
      title: "La Shahada",
      subtitle: "Attestation de foi",
      nameAr: "الشهادة",
      sections: [
        {
          heading: "Sens de la Shahada",
          body: "« Il n'y a de divinité digne d'adoration qu'Allah et Muhammad est Son messager. » Cette attestation est la porte de l'Islam : elle affirme l'unicité d'Allah et la prophétie de Muhammad ﷺ.",
        },
        {
          heading: "Sincérité et engagement",
          body: "La Shahada n'est pas seulement prononcée par la langue : elle engage le cœur à abandonner l'association à Allah (shirk) et à suivre la Sunna du Prophète ﷺ dans la vie quotidienne.",
        },
      ],
      quiz: [
        {
          id: "sh-1",
          question: "Que signifie principalement la Shahada ?",
          options: [
            "Un jeûne annuel",
            "L'attestation de foi en Allah et Son messager",
            "Un pèlerinage obligatoire",
            "Une aumône facultative",
          ],
          correctIndex: 1,
        },
        {
          id: "sh-2",
          question: "La Shahada engage-t-elle seulement la langue ?",
          options: ["Oui, uniquement", "Non, aussi le cœur et les actes", "Non, seulement en public", "Oui, si on est né musulman"],
          correctIndex: 1,
        },
      ],
    },
    {
      id: "pillars-salat",
      order: 2,
      title: "La Salat",
      subtitle: "La prière rituelle",
      nameAr: "الصلاة",
      sections: [
        {
          heading: "Deuxième pilier",
          body: "La prière (salat) est le lien quotidien entre le serviteur et Allah. Elle structure la journée par cinq prières obligatoires et rappelle la gratitude, la discipline et la présence du cœur.",
        },
        {
          heading: "Purification et concentration",
          body: "Avant la prière, le musulman se purifie (wudu ou ghusl). Pendant la salat, il évite les distractions et se tourne vers la qibla, symbole d'unité de la communauté.",
        },
      ],
      quiz: [
        {
          id: "sa-1",
          question: "Combien de prières obligatoires par jour ?",
          options: ["Trois", "Cinq", "Sept", "Une seule le vendredi"],
          correctIndex: 1,
        },
        {
          id: "sa-2",
          question: "Que fait-on généralement avant la prière ?",
          options: ["Rien", "La purification (wudu)", "Un jeûne de trois jours", "Une aumône obligatoire"],
          correctIndex: 1,
        },
      ],
    },
    {
      id: "pillars-zakat",
      order: 3,
      title: "La Zakat",
      subtitle: "Aumône purificatrice",
      nameAr: "الزكاة",
      sections: [
        {
          heading: "Troisième pilier",
          body: "La zakat purifie la richesse et soutient les nécessiteux. Elle concerne l'épargne et certains biens lorsqu'ils atteignent le seuil (nisab) et qu'une année lunaire s'est écoulée.",
        },
        {
          heading: "Solidarité",
          body: "La zakat renforce la fraternité : elle rappelle que la richesse est une confiance d'Allah et qu'une part revient aux pauvres, aux orphelins et aux besogneux.",
        },
      ],
      quiz: [
        {
          id: "za-1",
          question: "La zakat concerne surtout :",
          options: [
            "Un don facultatif uniquement",
            "Une part obligatoire de richesse éligible",
            "Le jeûne du Ramadan",
            "Le pèlerinage seul",
          ],
          correctIndex: 1,
        },
        {
          id: "za-2",
          question: "Un objectif central de la zakat est :",
          options: [
            "Enrichir les riches",
            "Soutenir les nécessiteux et purifier la richesse",
            "Remplacer la prière",
            "Éviter la Shahada",
          ],
          correctIndex: 1,
        },
      ],
    },
  ],
};
