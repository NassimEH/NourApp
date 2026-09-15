import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";

import { AppIcon } from "@/components/AppIcon";
import { HomeSection } from "@/components/home/HomeSection";
import {
  isVendredi,
  getHadithVendrediDuJour,
  getHadithVendrediText,
} from "@/constants/hadithsVendredi";
import { getHadithLocalizedText } from "@/constants/hadithsJour";
import { useAppTheme } from "@/lib/app-theme";
import { createHomeStyles } from "@/lib/home-screen-styles";
import {
  formatHadithFeaturedDate,
  getHadithDuJour,
} from "@/lib/hadith-du-jour";
import { useTranslation } from "@/lib/i18n";

/**
 * Hadith du jour — aligné à gauche comme l’invocation météo.
 */
export function HomeHadithDuJourSection() {
  const { t, locale, rtlTextStyle, rtlViewStyle } = useTranslation();
  const colors = useAppTheme();
  const themed = useMemo(() => createHomeStyles(colors), [colors]);
  const friday = isVendredi();
  const hadithVendredi = friday ? getHadithVendrediDuJour() : null;
  const hadithJour = getHadithDuJour();
  const todayLabel = formatHadithFeaturedDate(new Date(), locale);

  const sectionTitle = friday
    ? t("home.hadithFridayLabel")
    : t("home.hadithDayLabel");
  const body =
    friday && hadithVendredi
      ? getHadithVendrediText(hadithVendredi, locale)
      : getHadithLocalizedText(hadithJour, locale);
  const source =
    friday && hadithVendredi ? hadithVendredi.source : hadithJour.source;
  const href = friday
    ? "/(root)/hadith-friday"
    : "/(root)/(tabs)/coran/hadith-jour";

  return (
    <HomeSection
      title={sectionTitle}
      seeAllLabel={t("library.seeAll")}
      onSeeAll={() => router.push(href as never)}
    >
      <Pressable
        onPress={() => router.push(href as never)}
        style={({ pressed }) => [
          themed.hadithDayCard,
          pressed && { opacity: 0.94 },
        ]}
        accessibilityRole="button"
        accessibilityLabel={sectionTitle}
      >
        <View style={[themed.hadithDayCardInner, rtlViewStyle]}>
          <View style={[themed.hadithDayMetaRow, rtlViewStyle]}>
            <View style={[themed.hadithDayBadge, rtlViewStyle]}>
              <AppIcon name="message-circle" size={14} color={colors.accent} />
              <Text style={[themed.hadithDayBadgeText, rtlTextStyle]}>
                {friday ? t("home.hadithFridayBadge") : todayLabel}
              </Text>
            </View>
          </View>

          <Text style={[themed.hadithDayText, rtlTextStyle]} numberOfLines={4}>
            {body}
          </Text>

          <Text style={[themed.hadithDaySource, rtlTextStyle]} numberOfLines={2}>
            {source}
          </Text>
        </View>
      </Pressable>
    </HomeSection>
  );
}
