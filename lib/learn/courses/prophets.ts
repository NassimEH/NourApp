import type { LearnCourse } from "../types";

export const PROPHETS_COURSE_ID = "prophets-life";

export const PROPHETS_COURSE: LearnCourse = {
  id: PROPHETS_COURSE_ID,
  title: "La vie des prophètes",
  subtitle: "Découvrir les messagers d'Allah (5 leçons)",
  lessons: [
    {
      id: "prophet-adam",
      order: 1,
      title: "Adam",
      subtitle: "Le premier homme et premier prophète",
      nameAr: "آدم",
      sections: [
        {
          heading: "Création et honneur",
          body: "Adam عليه السلام est le premier être humain créé par Allah. Il lui a enseigné les noms de toutes choses et a fait incliner les anges devant lui, signe d'honneur et de responsabilité sur terre.",
        },
        {
          heading: "Le paradis et l'épreuve",
          body: "Allah a placé Adam et Hawwa dans le paradis en leur interdisant un arbre précis. Shaytan les a trompés ; ils ont goûté à cet arbre, demandé pardon et Allah leur a pardonné avant leur descente sur terre.",
        },
        {
          heading: "Enseignement",
          body: "La vie d'Adam rappelle l'origine noble de l'homme, la réalité du repentir (tawba) et que le succès durable passe par l'obéissance à Allah.",
        },
      ],
      quiz: [
        {
          id: "adam-1",
          question: "Qui est le premier prophète selon l'Islam ?",
          options: ["Nuh", "Adam", "Ibrahim", "Musa"],
          correctIndex: 1,
        },
        {
          id: "adam-2",
          question: "Que fit Allah après l'erreur d'Adam et Hawwa ?",
          options: [
            "Il les abandonna sans pardon",
            "Il accepta leur repentir",
            "Il les laissa au paradis",
            "Il effaça leur mémoire",
          ],
          correctIndex: 1,
        },
        {
          id: "adam-3",
          question: "Quel enseignement principal tire-t-on de l'histoire d'Adam ?",
          options: [
            "L'homme n'a aucune responsabilité",
            "Le repentir et l'obéissance à Allah",
            "Il faut éviter toute prière",
            "Les anges sont inférieurs aux hommes",
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      id: "prophet-nuh",
      order: 2,
      title: "Nuh",
      subtitle: "Patience et appel sur des siècles",
      nameAr: "نوح",
      sections: [
        {
          heading: "Un appel long et patient",
          body: "Nuh عليه السلام appela son peuple à adorer Allah seul pendant de très nombreuses années. Peu crurent ; il resta ferme malgré moqueries et rejet.",
        },
        {
          heading: "L'arche et le déluge",
          body: "Allah ordonna à Nuh de construire une arche. Un déluge engloutit les injustes ; les croyants furent sauvés. Cet événement est un rappel du châtiment et de la miséricorde divine.",
        },
        {
          heading: "Enseignement",
          body: "Nuh enseigne la persévérance dans la da'wa, la confiance en Allah et que la victoire finale appartient aux pieux.",
        },
      ],
      quiz: [
        {
          id: "nuh-1",
          question: "Quelle qualité principale associe-t-on à Nuh ?",
          options: ["La colère", "La patience", "L'orgueil", "La paresse"],
          correctIndex: 1,
        },
        {
          id: "nuh-2",
          question: "Que construisit Nuh sur ordre d'Allah ?",
          options: ["Une mosquée", "Une arche", "Un palais", "Une tour"],
          correctIndex: 1,
        },
        {
          id: "nuh-3",
          question: "Qui fut sauvé lors du déluge ?",
          options: [
            "Tout le peuple sans distinction",
            "Les croyants avec Nuh",
            "Personne",
            "Seulement les anges",
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      id: "prophet-ibrahim",
      order: 3,
      title: "Ibrahim",
      subtitle: "Le père des prophètes et de la soumission",
      nameAr: "إبراهيم",
      sections: [
        {
          heading: "Rejet de l'idolâtrie",
          body: "Ibrahim عليه السلام chercha le Créateur unique et rejeta les idoles de son peuple. Il fut jeté au feu ; Allah le sauva — signe que la vérité triomphe avec la confiance en Lui.",
        },
        {
          heading: "Épreuves et confiance",
          body: "Il quitta sa terre, reconstruisit la Kaaba avec Isma'il et fut éprouvé par un rêve concernant le sacrifice. Allah remplaça l'épreuve par un bélier : leçon d'obéissance totale (islam).",
        },
        {
          heading: "Enseignement",
          body: "Ibrahim est un modèle de tawhid, de courage et de générosité. Les musulmans revivent son parcours lors du Hajj et de la 'Id al-Adha.",
        },
      ],
      quiz: [
        {
          id: "ibrahim-1",
          question: "Quel message central porta Ibrahim ?",
          options: [
            "L'adoration d'idoles",
            "L'unicité d'Allah (tawhid)",
            "Le rejet de toute prière",
            "La richesse seule",
          ],
          correctIndex: 1,
        },
        {
          id: "ibrahim-2",
          question: "Quel lieu saint Ibrahim a-t-il aidé à établir ?",
          options: ["La Kaaba", "Le Taj Mahal", "Le Colisée", "La Tour Eiffel"],
          correctIndex: 0,
        },
        {
          id: "ibrahim-3",
          question: "Pourquoi commémore-t-on la 'Id al-Adha ?",
          options: [
            "La fin du jeûne de Ramadan",
            "La confiance et le sacrifice d'Ibrahim",
            "La naissance du Prophète ﷺ",
            "Le début de l'année",
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      id: "prophet-musa",
      order: 4,
      title: "Musa",
      subtitle: "Libération et guidance de Bani Isra'il",
      nameAr: "موسى",
      sections: [
        {
          heading: "Naissance et protection",
          body: "Musa عليه السلام naquit sous une tyrannie ; Allah le sauva des eaux et le fit élever au palais de Pharaon, préparant sa mission future.",
        },
        {
          heading: "Mission contre Pharaon",
          body: "Allah lui parla au Mont Sinaï et l'envoya vers Pharaon avec des miracles. Moïse appela à la justice ; Pharaon refusa et fut noyé avec son armée.",
        },
        {
          heading: "Enseignement",
          body: "Musa illustre la lutte contre l'oppression, l'importance de la guidance divine (Torah) et la confiance en Allah face à l'arrogance des tyrans.",
        },
      ],
      quiz: [
        {
          id: "musa-1",
          question: "Contre qui Musa fut-il envoyé ?",
          options: ["Romulus", "Pharaon", "Nimrod seul", "Personne"],
          correctIndex: 1,
        },
        {
          id: "musa-2",
          question: "Où Allah parla-t-Il à Musa ?",
          options: [
            "Au Mont Sinaï",
            "Dans l'océan Pacifique",
            "Sur la lune",
            "À La Mecque uniquement",
          ],
          correctIndex: 0,
        },
        {
          id: "musa-3",
          question: "Quel livre est associé à Musa ?",
          options: ["L'Évangile", "La Torah", "Le Coran uniquement", "Aucun texte"],
          correctIndex: 1,
        },
      ],
    },
    {
      id: "prophet-isa",
      order: 5,
      title: "'Isa",
      subtitle: "Miracles et message pur",
      nameAr: "عيسى",
      sections: [
        {
          heading: "Naissance miraculeuse",
          body: "'Isa عليه السلام naquit de Maryam sans père, par la parole d'Allah « Sois ». Ce miracle affirme la puissance du Créateur, non une divinité pour 'Isa.",
        },
        {
          heading: "Miracles et appel",
          body: "Il guérissait les malades et ressuscitait les morts avec la permission d'Allah. Il appela au tawhid et fut soutenu par des disciples sincères.",
        },
        {
          heading: "Enseignement",
          body: "Les musulmans honorent 'Isa comme prophète et messager. Il n'est pas le fils d'Allah ; Allah l'éleva vers Lui et le protégea des complots de son peuple.",
        },
      ],
      quiz: [
        {
          id: "isa-1",
          question: "Comment les musulmans considèrent-ils 'Isa ?",
          options: [
            "Comme un prophète et messager",
            "Comme divinité à part Allah",
            "Comme un ange sans message",
            "Comme un poète seulement",
          ],
          correctIndex: 0,
        },
        {
          id: "isa-2",
          question: "Qui est la mère d''Isa dans le Coran ?",
          options: ["Sarah", "Maryam", "Asiya", "Hawwa"],
          correctIndex: 1,
        },
        {
          id: "isa-3",
          question: "Que dit l'Islam sur la naissance d''Isa ?",
          options: [
            "Elle est un miracle par la volonté d'Allah",
            "Elle est impossible",
            "Elle n'est pas mentionnée",
            "Elle prouve qu'il est dieu",
          ],
          correctIndex: 0,
        },
      ],
    },
  ],
};

export function getProphetsLesson(id: string) {
  return PROPHETS_COURSE.lessons.find((l) => l.id === id);
}
