import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { AppIcon } from "@/components/AppIcon";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { useTranslation } from "@/lib/i18n";
import { CARD_RADIUS, SECTION_GAP } from "@/lib/ui/spacing";
import { isRamadanSeason } from "@/lib/seasonal/ramadan";

export function HomeRamadanBanner() {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const { t } = useTranslation();

  if (!isRamadanSeason()) return null;

  return (
    <Pressable
      onPress={() => router.push("/(root)/(tabs)/profile")}
      style={({ pressed }) => [
        styles.wrap,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={t("ramadan.bannerTitle")}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${colors.accent}22` }]}>
        <AppIcon name="star" size={22} color={colors.accent} />
      </View>
      <View style={styles.text}>
        <Text
          style={[
            styles.title,
            { color: colors.text, fontSize: typography.bodyMedium },
          ]}
        >
          {t("ramadan.bannerTitle")}
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: colors.textMuted, fontSize: typography.caption },
          ]}
        >
          {t("ramadan.bannerSubtitle")}
        </Text>
      </View>
      <AppIcon name="chevron-right" size={20} color={colors.iconMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: SECTION_GAP,
    padding: 14,
    borderRadius: CARD_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { flex: 1, gap: 2 },
  title: { fontFamily: "PlusJakartaSans-SemiBold" },
  subtitle: { fontFamily: "PlusJakartaSans-Regular", lineHeight: 18 },
});
