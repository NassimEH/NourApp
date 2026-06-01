import type { AppIconName } from "@/components/AppIcon";

export type ToolId =
  | "zakat-fitr"
  | "zakat-mal"
  | "dhikr"
  | "date-converter"
  | "prayer-summary"
  | "sadaqa"
  | "asma-names"
  | "qibla-shortcut"
  | "inheritance-guide";

export interface ToolDefinition {
  id: ToolId;
  icon: AppIconName;
  titleKey: string;
  subtitleKey: string;
  /** Route expo-router sous (root) */
  route: string;
}

export const TOOLS_REGISTRY: ToolDefinition[] = [
  {
    id: "zakat-fitr",
    icon: "gift",
    titleKey: "zakatFitr.toolTitle",
    subtitleKey: "zakatFitr.toolSubtitle",
    route: "/(root)/zakat-fitr",
  },
  {
    id: "zakat-mal",
    icon: "dollar-sign",
    titleKey: "tools.zakatMal.toolTitle",
    subtitleKey: "tools.zakatMal.toolSubtitle",
    route: "/(root)/zakat-mal",
  },
  {
    id: "dhikr",
    icon: "repeat",
    titleKey: "tools.dhikr.toolTitle",
    subtitleKey: "tools.dhikr.toolSubtitle",
    route: "/(root)/dhikr",
  },
  {
    id: "date-converter",
    icon: "calendar",
    titleKey: "tools.dateConverter.toolTitle",
    subtitleKey: "tools.dateConverter.toolSubtitle",
    route: "/(root)/date-converter",
  },
  {
    id: "prayer-summary",
    icon: "clock",
    titleKey: "tools.prayerSummary.toolTitle",
    subtitleKey: "tools.prayerSummary.toolSubtitle",
    route: "/(root)/prayer-summary",
  },
  {
    id: "sadaqa",
    icon: "heart",
    titleKey: "tools.sadaqa.toolTitle",
    subtitleKey: "tools.sadaqa.toolSubtitle",
    route: "/(root)/sadaqa-goal",
  },
  {
    id: "asma-names",
    icon: "star",
    titleKey: "tools.asmaNames.toolTitle",
    subtitleKey: "tools.asmaNames.toolSubtitle",
    route: "/(root)/asma-names",
  },
  {
    id: "qibla-shortcut",
    icon: "compass",
    titleKey: "tools.qiblaShortcut.toolTitle",
    subtitleKey: "tools.qiblaShortcut.toolSubtitle",
    route: "/(root)/(tabs)/qibla",
  },
  {
    id: "inheritance-guide",
    icon: "book",
    titleKey: "tools.inheritance.toolTitle",
    subtitleKey: "tools.inheritance.toolSubtitle",
    route: "/(root)/inheritance-guide",
  },
];
