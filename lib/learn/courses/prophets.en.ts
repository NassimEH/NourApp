import type { LearnCourse } from "../types";

export const PROPHETS_COURSE_EN: LearnCourse = {
  id: "prophets-life",
  title: "Lives of the prophets",
  subtitle: "Discover Allah's messengers (5 lessons)",
  lessons: [
    {
      id: "prophet-adam",
      order: 1,
      title: "Adam",
      subtitle: "The first man and first prophet",
      nameAr: "آدم",
      sections: [
        {
          heading: "Creation and honor",
          body: "Adam (peace be upon him) was the first human created by Allah. He taught him the names of all things and commanded the angels to bow to him, a sign of honor and responsibility on earth.",
        },
        {
          heading: "Paradise and the trial",
          body: "Allah placed Adam and Hawwa in paradise and forbade one tree. Satan deceived them; they ate from it, sought forgiveness, and Allah forgave them before their descent to earth.",
        },
        {
          heading: "Lesson",
          body: "Adam's story reminds us of human dignity, sincere repentance (tawba), and that lasting success comes through obedience to Allah.",
        },
      ],
      quiz: [
        {
          id: "adam-1",
          question: "Who is the first prophet in Islam?",
          options: ["Nuh", "Adam", "Ibrahim", "Musa"],
          correctIndex: 1,
        },
        {
          id: "adam-2",
          question: "What did Allah do after Adam and Hawwa's mistake?",
          options: [
            "Abandoned them without forgiveness",
            "Accepted their repentance",
            "Left them in paradise",
            "Erased their memory",
          ],
          correctIndex: 1,
        },
        {
          id: "adam-3",
          question: "What is the main lesson from Adam's story?",
          options: [
            "Humans have no responsibility",
            "Repentance and obedience to Allah",
            "Prayer should be avoided",
            "Angels are inferior to humans",
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      id: "prophet-nuh",
      order: 2,
      title: "Nuh",
      subtitle: "Patience over centuries",
      nameAr: "نوح",
      sections: [
        {
          heading: "A long, patient call",
          body: "Nuh (peace be upon him) called his people to worship Allah alone for many years. Few believed; he remained firm despite mockery and rejection.",
        },
        {
          heading: "The ark and the flood",
          body: "Allah ordered Nuh to build an ark. A flood drowned the wrongdoers; the believers were saved. This event reminds us of divine punishment and mercy.",
        },
        {
          heading: "Lesson",
          body: "Nuh teaches perseverance in da'wa, trust in Allah, and that final victory belongs to the righteous.",
        },
      ],
      quiz: [
        {
          id: "nuh-1",
          question: "Which quality is Nuh especially known for?",
          options: ["Anger", "Patience", "Pride", "Laziness"],
          correctIndex: 1,
        },
        {
          id: "nuh-2",
          question: "What did Nuh build by Allah's command?",
          options: ["A mosque", "An ark", "A palace", "A tower"],
          correctIndex: 1,
        },
        {
          id: "nuh-3",
          question: "Who was saved during the flood?",
          options: [
            "Everyone without distinction",
            "The believers with Nuh",
            "No one",
            "Only the angels",
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      id: "prophet-ibrahim",
      order: 3,
      title: "Ibrahim",
      subtitle: "Father of the prophets and submission",
      nameAr: "إبراهيم",
      sections: [
        {
          heading: "Rejecting idolatry",
          body: "Ibrahim (peace be upon him) sought the One Creator and rejected his people's idols. He was thrown into fire; Allah saved him, showing that truth prevails with trust in Him.",
        },
        {
          heading: "Trials and trust",
          body: "He left his homeland, rebuilt the Kaaba with Isma'il, and was tested by a dream of sacrifice. Allah replaced it with a ram: a lesson of complete submission (islam).",
        },
        {
          heading: "Lesson",
          body: "Ibrahim is a model of tawhid, courage, and generosity. Muslims relive his journey during Hajj and Eid al-Adha.",
        },
      ],
      quiz: [
        {
          id: "ibrahim-1",
          question: "What central message did Ibrahim preach?",
          options: [
            "Worship of idols",
            "The oneness of Allah (tawhid)",
            "Rejection of all prayer",
            "Wealth alone",
          ],
          correctIndex: 1,
        },
        {
          id: "ibrahim-2",
          question: "Which sacred site did Ibrahim help establish?",
          options: ["The Kaaba", "The Taj Mahal", "The Colosseum", "The Eiffel Tower"],
          correctIndex: 0,
        },
        {
          id: "ibrahim-3",
          question: "Why do we commemorate Eid al-Adha?",
          options: [
            "End of Ramadan fasting",
            "Ibrahim's trust and sacrifice",
            "The Prophet's ﷺ birth",
            "The new year",
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      id: "prophet-musa",
      order: 4,
      title: "Musa",
      subtitle: "Liberation and guidance of Bani Isra'il",
      nameAr: "موسى",
      sections: [
        {
          heading: "Birth and protection",
          body: "Musa (peace be upon him) was born under tyranny; Allah saved him from the water and raised him in Pharaoh's palace, preparing his future mission.",
        },
        {
          heading: "Mission against Pharaoh",
          body: "Allah spoke to him at Mount Sinai and sent him to Pharaoh with miracles. He called for justice; Pharaoh refused and drowned with his army.",
        },
        {
          heading: "Lesson",
          body: "Musa illustrates struggle against oppression, the importance of divine guidance (Torah), and trust in Allah against tyrants.",
        },
      ],
      quiz: [
        {
          id: "musa-1",
          question: "Against whom was Musa sent?",
          options: ["Romulus", "Pharaoh", "Nimrod only", "No one"],
          correctIndex: 1,
        },
        {
          id: "musa-2",
          question: "Where did Allah speak to Musa?",
          options: [
            "Mount Sinai",
            "The Pacific Ocean",
            "The moon",
            "Makkah only",
          ],
          correctIndex: 0,
        },
        {
          id: "musa-3",
          question: "Which scripture is associated with Musa?",
          options: ["The Gospel", "The Torah", "The Quran only", "No scripture"],
          correctIndex: 1,
        },
      ],
    },
    {
      id: "prophet-isa",
      order: 5,
      title: "Isa",
      subtitle: "Miracles and a pure message",
      nameAr: "عيسى",
      sections: [
        {
          heading: "Miraculous birth",
          body: "Isa (peace be upon him) was born to Maryam without a father, by Allah's word 'Be.' This miracle affirms the Creator's power, not divinity for Isa.",
        },
        {
          heading: "Miracles and call",
          body: "He healed the sick and revived the dead by Allah's permission. He called to tawhid and was supported by sincere disciples.",
        },
        {
          heading: "Lesson",
          body: "Muslims honor Isa as a prophet and messenger. He is not the son of Allah; Allah raised him and protected him from his people's plots.",
        },
      ],
      quiz: [
        {
          id: "isa-1",
          question: "How do Muslims regard Isa?",
          options: [
            "As a prophet and messenger",
            "As a deity besides Allah",
            "As an angel without a message",
            "As a poet only",
          ],
          correctIndex: 0,
        },
        {
          id: "isa-2",
          question: "Who is Isa's mother in the Quran?",
          options: ["Sarah", "Maryam", "Asiya", "Hawwa"],
          correctIndex: 1,
        },
        {
          id: "isa-3",
          question: "What does Islam say about Isa's birth?",
          options: [
            "It is a miracle by Allah's will",
            "It is impossible",
            "It is not mentioned",
            "It proves he is God",
          ],
          correctIndex: 0,
        },
      ],
    },
  ],
};
