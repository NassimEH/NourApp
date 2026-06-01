import { Text, type TextProps, type TextStyle } from "react-native";

import { useAppTheme } from "@/lib/app-theme";
import {
  useAppTypography,
  type TypographyVariant,
} from "@/lib/app-typography";

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
  const lineHeight =
    variant === "arabic"
      ? fontSize * typography.lineHeightArabic
      : fontSize * typography.lineHeightBody;

  return (
    <Text
      style={[
        {
          fontSize,
          lineHeight,
          color: colors.text,
        } as TextStyle,
        style,
      ]}
      {...rest}
    />
  );
}
