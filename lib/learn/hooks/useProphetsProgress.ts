import { PROPHETS_COURSE_ID } from "../courses";
import { useLearnProgress } from "./useLearnProgress";

/** @deprecated Préférer useLearnProgress(PROPHETS_COURSE_ID) */
export function useProphetsProgress() {
  return useLearnProgress(PROPHETS_COURSE_ID);
}
