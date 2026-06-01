import type { LearnCourse } from "../types";
import { PILLARS_COURSE_ID } from "./pillars.fr";

export const PILLARS_COURSE_EN: LearnCourse = {
  id: PILLARS_COURSE_ID,
  title: "Pillars of Islam",
  subtitle: "The five pillars — introduction (3 lessons)",
  lessons: [
    {
      id: "pillars-shahada",
      order: 1,
      title: "Shahada",
      subtitle: "Declaration of faith",
      nameAr: "الشهادة",
      sections: [
        {
          heading: "Meaning",
          body: "“There is no god worthy of worship except Allah and Muhammad is His Messenger.” This testimony is the door to Islam: it affirms Allah’s oneness and the prophethood of Muhammad ﷺ.",
        },
        {
          heading: "Sincerity",
          body: "The Shahada is not only spoken: it engages the heart to avoid associating partners with Allah and to follow the Prophet’s ﷺ Sunnah in daily life.",
        },
      ],
      quiz: [
        {
          id: "sh-1",
          question: "What does the Shahada mainly express?",
          options: [
            "Annual fasting",
            "Faith in Allah and His Messenger",
            "Mandatory pilgrimage",
            "Optional charity",
          ],
          correctIndex: 1,
        },
        {
          id: "sh-2",
          question: "Is the Shahada only verbal?",
          options: ["Yes, only words", "No, heart and deeds too", "Only in public", "Yes if born Muslim"],
          correctIndex: 1,
        },
      ],
    },
    {
      id: "pillars-salat",
      order: 2,
      title: "Salat",
      subtitle: "Ritual prayer",
      nameAr: "الصلاة",
      sections: [
        {
          heading: "Second pillar",
          body: "Prayer (salat) is the daily bond with Allah through five obligatory prayers, bringing gratitude, discipline, and presence of heart.",
        },
        {
          heading: "Purification",
          body: "Before prayer, the Muslim performs wudu (or ghusl when required), faces the qibla, and strives for focus.",
        },
      ],
      quiz: [
        {
          id: "sa-1",
          question: "How many obligatory daily prayers?",
          options: ["Three", "Five", "Seven", "Only Friday"],
          correctIndex: 1,
        },
        {
          id: "sa-2",
          question: "What is usually done before prayer?",
          options: ["Nothing", "Purification (wudu)", "Three-day fast", "Mandatory zakat"],
          correctIndex: 1,
        },
      ],
    },
    {
      id: "pillars-zakat",
      order: 3,
      title: "Zakat",
      subtitle: "Obligatory charity",
      nameAr: "الزكاة",
      sections: [
        {
          heading: "Third pillar",
          body: "Zakat purifies wealth and supports those in need when savings reach nisab and a lunar year passes.",
        },
        {
          heading: "Solidarity",
          body: "Wealth is a trust from Allah; a defined share belongs to the poor, orphans, and those in hardship.",
        },
      ],
      quiz: [
        {
          id: "za-1",
          question: "Zakat mainly concerns:",
          options: [
            "Only optional gifts",
            "An obligatory share of eligible wealth",
            "Ramadan fasting",
            "Hajj alone",
          ],
          correctIndex: 1,
        },
        {
          id: "za-2",
          question: "A central goal of zakat is:",
          options: [
            "Enrich the wealthy",
            "Help the needy and purify wealth",
            "Replace prayer",
            "Skip the Shahada",
          ],
          correctIndex: 1,
        },
      ],
    },
  ],
};
