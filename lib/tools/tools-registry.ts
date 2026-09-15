import type { AppIconName } from "@/components/AppIcon";

export type ToolId =
  | "qibla-shortcut"
  | "dhikr"
  | "asma-names"
  | "date-converter"
  | "zakat-mal"
  | "zakat-fitr"
  | "sadaqa"
  | "inheritance-guide";

export interface ToolDefinition {
  id: ToolId;
  /** Icône Feather stroke flat */
  icon: AppIconName;
  titleKey: string;
  subtitleKey: string;
  route: string;
}

/** Ordre UX : rituels quotidiens → spirituel → calendrier → calculs. */
export const TOOLS_REGISTRY: ToolDefinition[] = [
  {
    id: "dhikr",
    icon: "repeat",
    titleKey: "tools.dhikr.toolTitle",
    subtitleKey: "tools.dhikr.toolSubtitle",
    route: "/(root)/dhikr",
  },
  {
    id: "qibla-shortcut",
    icon: "compass",
    titleKey: "tools.qiblaShortcut.toolTitle",
    subtitleKey: "tools.qiblaShortcut.toolSubtitle",
    route: "/(root)/qibla-compass",
  },
  {
    id: "asma-names",
    icon: "star",
    titleKey: "tools.asmaNames.toolTitle",
    subtitleKey: "tools.asmaNames.toolSubtitle",
    route: "/(root)/asma-names",
  },
  {
    id: "date-converter",
    icon: "calendar",
    titleKey: "tools.dateConverter.toolTitle",
    subtitleKey: "tools.dateConverter.toolSubtitle",
    route: "/(root)/date-converter",
  },
  {
    id: "zakat-mal",
    icon: "percent",
    titleKey: "tools.zakatMal.toolTitle",
    subtitleKey: "tools.zakatMal.toolSubtitle",
    route: "/(root)/zakat-mal",
  },
  {
    id: "zakat-fitr",
    icon: "gift",
    titleKey: "zakatFitr.toolTitle",
    subtitleKey: "zakatFitr.toolSubtitle",
    route: "/(root)/zakat-fitr",
  },
  {
    id: "sadaqa",
    icon: "heart",
    titleKey: "tools.sadaqa.toolTitle",
    subtitleKey: "tools.sadaqa.toolSubtitle",
    route: "/(root)/sadaqa-goal",
  },
  {
    id: "inheritance-guide",
    icon: "file-text",
    titleKey: "tools.inheritance.toolTitle",
    subtitleKey: "tools.inheritance.toolSubtitle",
    route: "/(root)/inheritance-guide",
  },
];
