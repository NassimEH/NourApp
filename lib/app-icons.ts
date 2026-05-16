import type { ComponentProps } from "react";
import type Feather from "@expo/vector-icons/Feather";
import type Ionicons from "@expo/vector-icons/Ionicons";

export type FeatherIconName = ComponentProps<typeof Feather>["name"];
type IoniconName = ComponentProps<typeof Ionicons>["name"];

/** Correspondance Feather (contour) → Ionicons (rempli) */
const FEATHER_TO_IONICONS: Partial<Record<FeatherIconName, IoniconName>> = {
  home: "home",
  sunrise: "sunny",
  sunset: "partly-sunny",
  "book-open": "book",
  book: "book",
  award: "ribbon",
  search: "search",
  user: "person",
  "chevron-left": "chevron-back",
  "chevron-right": "chevron-forward",
  "chevron-down": "chevron-down",
  "chevron-up": "chevron-up",
  check: "checkmark",
  x: "close",
  mic: "mic",
  "more-vertical": "ellipsis-vertical",
  "skip-back": "play-skip-back",
  "skip-forward": "play-skip-forward",
  loader: "hourglass",
  play: "play",
  pause: "pause",
  repeat: "repeat",
  heart: "heart",
  "x-circle": "close-circle",
  calendar: "calendar",
  "credit-card": "card",
  sun: "sunny",
  layers: "layers",
  star: "star",
  type: "text",
  droplet: "water",
  shield: "shield-checkmark",
  globe: "globe",
  "help-circle": "help-circle",
  share: "share-social",
  "share-2": "share",
  bell: "notifications",
  "edit-2": "create",
  "map-pin": "location",
  "log-out": "log-out",
  "refresh-cw": "refresh",
  thermometer: "thermometer",
  wind: "leaf",
  activity: "pulse",
  bookmark: "bookmark",
  copy: "copy",
  download: "download",
  "play-circle": "play-circle",
  "volume-2": "volume-high",
  zap: "flash",
  plus: "add",
  lock: "lock-closed",
  moon: "moon",
  "message-circle": "chatbubble",
  "file-text": "document-text",
};

export function getIoniconsNameForFeather(name: FeatherIconName): IoniconName {
  const mapped = FEATHER_TO_IONICONS[name];
  if (mapped) return mapped;
  return name as IoniconName;
}
