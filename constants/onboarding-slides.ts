import type { ComponentType } from "react";

import { CustomizeProfilePreview } from "@/components/onboarding/previews/CustomizeProfilePreview";
import { LibraryCoranPreview } from "@/components/onboarding/previews/LibraryCoranPreview";
import { ListenExplorePreview } from "@/components/onboarding/previews/ListenExplorePreview";
import { PrayersHomePreview } from "@/components/onboarding/previews/PrayersHomePreview";
import type { AppIconName } from "@/components/AppIcon";

export type OnboardingSlideKey = "slide1" | "slide2" | "slide3" | "slide4";

export type OnboardingSlideConfig = {
  key: OnboardingSlideKey;
  icon: AppIconName;
  Preview: ComponentType;
  /** PNG optionnel — généré via `node scripts/capture-onboarding-web.mjs` */
  image?: number;
};

export const ONBOARDING_SLIDES: OnboardingSlideConfig[] = [
  { key: "slide1", icon: "sunrise", Preview: PrayersHomePreview },
  { key: "slide2", icon: "headphones", Preview: ListenExplorePreview },
  { key: "slide3", icon: "book-open", Preview: LibraryCoranPreview },
  { key: "slide4", icon: "sliders", Preview: CustomizeProfilePreview },
];
