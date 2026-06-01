export interface LearnQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface LearnLessonSection {
  heading: string;
  body: string;
}

export interface LearnLesson {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  nameAr?: string;
  sections: LearnLessonSection[];
  quiz: LearnQuizQuestion[];
}

export interface LearnCourse {
  id: string;
  title: string;
  subtitle: string;
  lessons: LearnLesson[];
}

export type LessonStatus = "locked" | "available" | "completed";
