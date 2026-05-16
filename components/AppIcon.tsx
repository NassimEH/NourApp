import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { StyleProp, TextStyle } from "react-native";

import { getIoniconsNameForFeather, type FeatherIconName } from "@/lib/app-icons";
import { useAppPreferences } from "@/lib/app-preferences";

export type AppIconName = FeatherIconName;

export interface AppIconProps {
  name: AppIconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

/** Icône respectant Profil → Style des icônes (Contour = Feather, Rempli = Ionicons). */
export function AppIcon({ name, size = 24, color, style }: AppIconProps) {
  const { iconStyle } = useAppPreferences();

  if (iconStyle === "filled") {
    return (
      <Ionicons
        name={getIoniconsNameForFeather(name)}
        size={size}
        color={color}
        style={style}
      />
    );
  }

  return <Feather name={name} size={size} color={color} style={style} />;
}
