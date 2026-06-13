import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";

import { SectionHeader } from "@/components/SectionHeader";
import { useAppTheme } from "@/lib/app-theme";
import { createHomeStyles } from "@/lib/home-screen-styles";
import {
  formatHadithFeaturedDate,
  getHadithDuJour,
} from "@/lib/hadith-du-jour";
import { useTranslation } from "@/lib/i18n";

export function HomeHadithDuJourSection() {
  const { t, locale, rtlTextStyle, rtlViewStyle } = useTranslation();
  const colors = useAppTheme();
  const themed = useMemo(() => createHomeStyles(colors), [colors]);
  const hadith = getHadithDuJour();
  const todayLabel = formatHadithFeaturedDate(new Date(), locale);

  return (
    <View style={[themed.hadithDayBlock, rtlViewStyle]}>
      <SectionHeader
        title={t("home.hadithDayLabel")}
        seeAllLabel={t("library.seeAll")}
        onSeeAll={() => router.push("/(root)/(tabs)/coran/hadith-jour")}
        style={themed.hadithDayHeader}
      />

      <Pressable
        onPress={() => router.push("/(root)/(tabs)/coran/hadith-jour")}
        style={({ pressed }) => [
          themed.hadithDayCard,
          pressed && { opacity: 0.92 },
        ]}
        accessibilityRole="button"
        accessibilityLabel={t("home.hadithDayLabel")}
      >
        <Text style={[themed.hadithDayDate, rtlTextStyle]}>{todayLabel}</Text>
        <Text style={[themed.hadithDayText, rtlTextStyle]} numberOfLines={4}>
          {hadith.text}
        </Text>
        <Text style={[themed.hadithDaySource, rtlTextStyle]} numberOfLines={2}>
          {hadith.source}
        </Text>
      </Pressable>
    </View>
  );
}
