import type { AppIconName } from "@/components/AppIcon";

export const TAB_BAR_ICONS: Record<
  string,
  Extract<
    AppIconName,
    "home" | "sunrise" | "book-open" | "award" | "search" | "user"
  >
> = {
  index: "home",
  qibla: "sunrise",
  coran: "book-open",
  apprendre: "award",
  explore: "search",
  profile: "user",
};
