import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { AppIcon } from "@/components/AppIcon";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

export function HomeToolsSection() {
  const colors = useAppTheme();
  const { t, rtlTextStyle, rtlViewStyle } = useTranslation();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }, rtlTextStyle]}>
        {t("home.tools")}
      </Text>
      <Pressable
        onPress={() => router.push("/(root)/zakat-fitr")}
        style={({ pressed }) => [
          styles.toolCard,
          {
            backgroundColor: colors.usesBackgroundImage
              ? colors.card
              : colors.cardElevated,
            borderColor: colors.border,
          },
          pressed && styles.pressed,
          rtlViewStyle,
        ]}
        accessibilityRole="button"
        accessibilityLabel={t("zakatFitr.toolTitle")}
      >
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: colors.accentSurface },
          ]}
        >
          <AppIcon name="gift" size={22} color={colors.accent} />
        </View>
        <View style={styles.toolText}>
          <Text style={[styles.toolTitle, { color: colors.text }, rtlTextStyle]}>
            {t("zakatFitr.toolTitle")}
          </Text>
          <Text
            style={[styles.toolSubtitle, { color: colors.textMuted }, rtlTextStyle]}
          >
            {t("zakatFitr.toolSubtitle")}
          </Text>
        </View>
        <AppIcon name="chevron-right" size={20} color={colors.iconMuted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    marginBottom: 14,
  },
  toolCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pressed: {
    opacity: 0.85,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  toolText: {
    flex: 1,
    gap: 4,
  },
  toolTitle: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  toolSubtitle: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 18,
  },
});
