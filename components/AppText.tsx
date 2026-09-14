import { Text, type TextProps, type TextStyle } from "react-native";

import { useAppTheme } from "@/lib/app-theme";
import {
  useAppTypography,
  type TypographyVariant,
} from "@/lib/app-typography";

/** Famille chargée dans app/_layout.tsx via @expo-google-fonts/amiri */
export const ARABIC_FONT_FAMILY = "Amiri_400Regular";
export const ARABIC_FONT_FAMILY_BOLD = "Amiri_700Bold";

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
}

export function AppText({
  variant = "body",
  style,
  ...rest
}: AppTextProps) {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const fontSize = typography[variant];
  const isArabic = variant === "arabic";
  const lineHeight = isArabic
    ? fontSize * typography.lineHeightArabic
    : fontSize * typography.lineHeightBody;

  return (
    <Text
      style={[
        {
          fontSize,
          lineHeight,
          color: colors.text,
          ...(isArabic
            ? {
                fontFamily: ARABIC_FONT_FAMILY,
                writingDirection: "rtl" as const,
                textAlign: "right" as const,
              }
            : null),
        } as TextStyle,
        style,
      ]}
      {...rest}
    />
  );
}
