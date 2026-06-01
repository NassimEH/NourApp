import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { AppIcon } from "@/components/AppIcon";
import { ScreenStackLayout } from "@/components/ScreenStackLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { getLastRead } from "@/lib/quran/storage";
import { useSuraList } from "@/lib/quran/hooks/useSuraList";

export default function MemorisationScreen() {
  const colors = useAppTheme();
  const { t, rtlTextStyle } = useTranslation();
  const { list: suras } = useSuraList();
  const [lastSuraNumber, setLastSuraNumber] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      getLastRead().then((read) => {
        setLastSuraNumber(read?.suraNumber ?? null);
      });
    }, [])
  );

  const lastSura = lastSuraNumber
    ? suras.find((s) => s.number === lastSuraNumber)
    : null;

  return (
    <ScreenStackLayout
      title={t("screens.memorisationTitle")}
      subtitle={t("screens.memorisationSubtitle")}
    >
      <Text style={[styles.intro, { color: colors.textMuted }, rtlTextStyle]}>
        {t("memorisation.intro")}
      </Text>

      {lastSura ? (
        <Pressable
          onPress={() =>
            router.push(`/(root)/(tabs)/coran/${lastSura.number}` as const)
          }
          style={({ pressed }) => [
            styles.card,
            {
              backgroundColor: colors.accentSurface,
              borderColor: colors.accent,
            },
            pressed && styles.pressed,
          ]}
        >
          <AppIcon name="book-open" size={28} color={colors.accent} />
          <View style={styles.cardText}>
            <Text style={[styles.cardLabel, { color: colors.textMuted }]}>
              {t("memorisation.resumeRead")}
            </Text>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {lastSura.englishName}
            </Text>
            <Text style={[styles.cardSub, { color: colors.textMuted }]}>
              {t("memorisation.ayahCount", { count: lastSura.numberOfAyahs })}
            </Text>
          </View>
          <AppIcon name="chevron-right" size={22} color={colors.iconMuted} />
        </Pressable>
      ) : (
        <View
          style={[
            styles.empty,
            { backgroundColor: colors.cardElevated, borderColor: colors.border },
          ]}
        >
          <AppIcon name="book-open" size={32} color={colors.iconMuted} />
          <Text style={[styles.emptyText, { color: colors.textMuted }, rtlTextStyle]}>
            {t("memorisation.noLastRead")}
          </Text>
        </View>
      )}

      <Pressable
        onPress={() => router.push("/(root)/(tabs)/coran/sourates")}
        style={({ pressed }) => [
          styles.secondaryBtn,
          { borderColor: colors.border },
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.secondaryBtnText, { color: colors.accent }]}>
          {t("memorisation.browseSuras")}
        </Text>
      </Pressable>
    </ScreenStackLayout>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
    fontFamily: "PlusJakartaSans-Regular",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardText: { flex: 1, gap: 2 },
  cardLabel: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-SemiBold",
    textTransform: "uppercase",
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-Bold",
  },
  cardSub: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
  },
  empty: {
    alignItems: "center",
    gap: 12,
    padding: 24,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    fontFamily: "PlusJakartaSans-Regular",
  },
  secondaryBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
  },
  secondaryBtnText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  pressed: { opacity: 0.88 },
});
