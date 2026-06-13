import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { AppIcon, type AppIconName } from "@/components/AppIcon";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { SPACE } from "@/lib/ui/spacing";

type Props = {
  headline: string;
  subtitle?: string;
  emblem?: AppIconName;
  style?: StyleProp<ViewStyle>;
  showBrand?: boolean;
};

export function AuthHero({
  headline,
  subtitle,
  emblem = "moon",
  style,
  showBrand = true,
}: Props) {
  const colors = useAppTheme();
  const { t, rtlTextStyle } = useTranslation();

  return (
    <View style={[styles.wrap, style]}>
      {showBrand ? (
        <Text style={[styles.brand, rtlTextStyle, { color: colors.text }]}>
          {t("auth.brand")}
        </Text>
      ) : null}
      <View style={styles.emblem}>
        <AppIcon name={emblem} size={22} color={colors.text} />
      </View>
      <Text style={[styles.headline, rtlTextStyle, { color: colors.text }]}>
        {headline}
      </Text>
      {subtitle ? (
        <Text
          style={[styles.subtitle, rtlTextStyle, { color: colors.textMuted }]}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    marginBottom: SPACE.xl,
  },
  brand: {
    fontSize: 28,
    fontFamily: "PlusJakartaSans-ExtraBold",
    letterSpacing: 1.2,
    marginBottom: SPACE.md,
    textAlign: "center",
  },
  emblem: {
    marginBottom: SPACE.lg,
    opacity: 0.92,
  },
  headline: {
    fontSize: 26,
    fontFamily: "PlusJakartaSans-Bold",
    lineHeight: 34,
    textAlign: "center",
    maxWidth: 340,
  },
  subtitle: {
    marginTop: SPACE.sm,
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 320,
  },
});
