import { PILLARS_COURSE_ID, PROPHETS_COURSE_ID } from "@/lib/learn/courses";

/** Bleu DuolingoClone tracks (HomeHero / primary.blue) pour Les piliers de l'Islam */
export const PILLARS_HERO_BLUE = "#2563EB";

/** Couleur de la card Continuer selon le parcours. */
export function getCourseHeroColor(
  courseId: string,
  appAccent: string
): string {
  if (courseId === PILLARS_COURSE_ID) return PILLARS_HERO_BLUE;
  if (courseId === PROPHETS_COURSE_ID) return appAccent;
  return appAccent;
}
