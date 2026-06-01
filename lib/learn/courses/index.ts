import type { LanguageLocale } from "@/lib/app-preferences";

import type { LearnCourse, LearnLesson } from "../types";
import { PROPHETS_COURSE as PROPHETS_COURSE_FR } from "./prophets.fr";
import { PROPHETS_COURSE_EN } from "./prophets.en";
import { PROPHETS_COURSE_AR } from "./prophets.ar";
import { PILLARS_COURSE, PILLARS_COURSE_ID } from "./pillars.fr";
import { PILLARS_COURSE_EN } from "./pillars.en";
import { PILLARS_COURSE_AR } from "./pillars.ar";

export const PROPHETS_COURSE_ID = "prophets-life";
export { PILLARS_COURSE_ID };

export function getProphetsCourse(locale: LanguageLocale): LearnCourse {
  switch (locale) {
    case "en":
      return PROPHETS_COURSE_EN;
    case "ar":
      return PROPHETS_COURSE_AR;
    default:
      return PROPHETS_COURSE_FR;
  }
}

export function getPillarsCourse(locale: LanguageLocale): LearnCourse {
  switch (locale) {
    case "en":
      return PILLARS_COURSE_EN;
    case "ar":
      return PILLARS_COURSE_AR;
    default:
      return PILLARS_COURSE;
  }
}

export function getLearnCourses(locale: LanguageLocale): LearnCourse[] {
  return [getProphetsCourse(locale), getPillarsCourse(locale)];
}

export function getLearnCourse(
  courseId: string,
  locale: LanguageLocale
): LearnCourse | undefined {
  return getLearnCourses(locale).find((c) => c.id === courseId);
}

export function getLearnLesson(
  id: string,
  locale: LanguageLocale
): { lesson: LearnLesson; course: LearnCourse } | undefined {
  for (const course of getLearnCourses(locale)) {
    const lesson = course.lessons.find((l) => l.id === id);
    if (lesson) return { lesson, course };
  }
  return undefined;
}

export function getProphetsLesson(
  id: string,
  locale: LanguageLocale
): LearnLesson | undefined {
  return getProphetsCourse(locale).lessons.find((l) => l.id === id);
}

/** @deprecated Utiliser getProphetsCourse(locale) */
export { PROPHETS_COURSE_FR as PROPHETS_COURSE };
