import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { router } from "expo-router";

import { AppIcon } from "@/components/AppIcon";
import { HomeSection } from "@/components/home/HomeSection";
import {
  isVendredi,
  getHadithVendrediDuJour,
  getHadithVendrediText,
} from "@/constants/hadithsVendredi";
import { getHadithLocalizedText } from "@/constants/hadithsJour";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { useAppTheme } from "@/lib/app-theme";
import { createHomeStyles } from "@/lib/home-screen-styles";
import {
  formatHadithFeaturedDate,
  getHadithDuJour,
} from "@/lib/hadith-du-jour";
import { useTranslation } from "@/lib/i18n";
import { useRandomAyah } from "@/lib/quran/hooks/useRandomAyah";

const PAGE_COUNT = 2;

/**
 * Accueil — carrousel Hadith du jour ↔ Verset du jour.
 */
export function HomeHadithDuJourSection() {
  const { t, locale, rtlTextStyle, rtlViewStyle } = useTranslation();
  const colors = useAppTheme();
  const themed = useMemo(() => createHomeStyles(colors), [colors]);
  const { width: screenWidth } = useWindowDimensions();
  const pageWidth = Math.round(screenWidth - SCREEN_EDGE_PADDING * 2);

  const [activePage, setActivePage] = useState(0);
  const [pageHeights, setPageHeights] = useState<[number, number]>([0, 0]);

  const friday = isVendredi();
  const hadithVendredi = friday ? getHadithVendrediDuJour() : null;
  const hadithJour = getHadithDuJour();
  const todayLabel = formatHadithFeaturedDate(new Date(), locale);

  const {
    ayah: verseAyah,
    loading: verseLoading,
    error: verseError,
    refetch: refetchVerse,
  } = useRandomAyah();

  const hadithTitle = friday
    ? t("home.hadithFridayLabel")
    : t("home.hadithDayLabel");
  const verseTitle = t("quran.verseOfDay");
  const sectionTitle = activePage === 0 ? hadithTitle : verseTitle;

  const hadithBody =
    friday && hadithVendredi
      ? getHadithVendrediText(hadithVendredi, locale)
      : getHadithLocalizedText(hadithJour, locale);
  const hadithSource =
    friday && hadithVendredi ? hadithVendredi.source : hadithJour.source;
  const hadithHref = friday
    ? "/(root)/hadith-friday"
    : "/(root)/(tabs)/coran/hadith-jour";

  const verseHref = verseAyah
    ? (`/(root)/(tabs)/coran/${verseAyah.suraNumber}` as const)
    : ("/(root)/(tabs)/coran/sourates" as const);

  const verseBody =
    locale === "ar"
      ? verseAyah?.textAr
      : verseAyah?.textFr || verseAyah?.textAr;

  const onSeeAll = () => {
    if (activePage === 0) router.push(hadithHref as never);
    else router.push(verseHref as never);
  };

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const index = Math.round(x / pageWidth);
      const clamped = Math.max(0, Math.min(index, PAGE_COUNT - 1));
      setActivePage((prev) => (prev === clamped ? prev : clamped));
    },
    [pageWidth]
  );

  const onPageLayout = useCallback(
    (index: 0 | 1) =>
      (e: { nativeEvent: { layout: { height: number } } }) => {
        const height = Math.ceil(e.nativeEvent.layout.height);
        if (height <= 0) return;
        setPageHeights((prev) => {
          if (prev[index] === height) return prev;
          const next: [number, number] = [...prev];
          next[index] = height;
          return next;
        });
      },
    []
  );

  const slideHeight = Math.max(pageHeights[0], pageHeights[1]) || undefined;

  return (
    <HomeSection
      title={sectionTitle}
      seeAllLabel={t("library.seeAll")}
      onSeeAll={onSeeAll}
    >
      <View style={slideHeight ? { height: slideHeight } : undefined}>
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={pageWidth}
          snapToAlignment="start"
          disableIntervalMomentum
          onScroll={onScroll}
          scrollEventThrottle={16}
          onMomentumScrollEnd={onScroll}
          contentContainerStyle={[
            styles.carouselContent,
            slideHeight ? { height: slideHeight } : null,
          ]}
          accessibilityLabel={sectionTitle}
          accessibilityHint={`${activePage + 1} / ${PAGE_COUNT}`}
        >
          <View
            style={[
              styles.page,
              { width: pageWidth },
              slideHeight ? { height: slideHeight } : null,
            ]}
          >
            <View onLayout={onPageLayout(0)}>
              <Pressable
                onPress={() => router.push(hadithHref as never)}
                style={({ pressed }) => [
                  themed.hadithDayCard,
                  pressed && { opacity: 0.94 },
                ]}
                accessibilityRole="button"
                accessibilityLabel={hadithTitle}
              >
                <View style={[themed.hadithDayCardInner, rtlViewStyle]}>
                  <View style={[themed.hadithDayMetaRow, rtlViewStyle]}>
                    <View style={[themed.hadithDayBadge, rtlViewStyle]}>
                      <AppIcon
                        name="message-circle"
                        size={14}
                        color={colors.accent}
                      />
                      <Text
                        style={[themed.hadithDayBadgeText, rtlTextStyle]}
                      >
                        {friday ? t("home.hadithFridayBadge") : todayLabel}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={[themed.hadithDayText, rtlTextStyle]}
                    numberOfLines={4}
                  >
                    {hadithBody}
                  </Text>

                  <Text
                    style={[themed.hadithDaySource, rtlTextStyle]}
                    numberOfLines={2}
                  >
                    {hadithSource}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>

          <View
            style={[
              styles.page,
              { width: pageWidth },
              slideHeight ? { height: slideHeight } : null,
            ]}
          >
            <View onLayout={onPageLayout(1)}>
              <Pressable
                onPress={() => router.push(verseHref as never)}
                style={({ pressed }) => [
                  themed.hadithDayCard,
                  pressed && { opacity: 0.94 },
                ]}
                accessibilityRole="button"
                accessibilityLabel={verseTitle}
              >
                <View style={[themed.hadithDayCardInner, rtlViewStyle]}>
                  <View style={[themed.hadithDayMetaRow, rtlViewStyle]}>
                    <View style={[themed.hadithDayBadge, rtlViewStyle]}>
                      <AppIcon name="book-open" size={14} color={colors.accent} />
                      <Text
                        style={[themed.hadithDayBadgeText, rtlTextStyle]}
                      >
                        {todayLabel}
                      </Text>
                    </View>
                  </View>

                  {verseLoading && !verseAyah ? (
                    <ActivityIndicator
                      size="small"
                      color={colors.accent}
                      style={styles.verseLoader}
                    />
                  ) : verseError && !verseAyah ? (
                    <Pressable onPress={() => void refetchVerse()}>
                      <Text style={[themed.hadithDayText, rtlTextStyle]}>
                        {t("home.retry")}
                      </Text>
                    </Pressable>
                  ) : (
                    <>
                      <Text
                        style={[
                          themed.hadithDayText,
                          rtlTextStyle,
                          locale === "ar" && styles.verseArabic,
                        ]}
                        numberOfLines={4}
                      >
                        {verseBody ?? "…"}
                      </Text>
                      {verseAyah ? (
                        <Text
                          style={[themed.hadithDaySource, rtlTextStyle]}
                          numberOfLines={2}
                        >
                          {t("quran.verseReference", {
                            sura:
                              locale === "ar"
                                ? verseAyah.suraNameAr
                                : verseAyah.suraName,
                            ayah: verseAyah.ayahNumber,
                          })}
                        </Text>
                      ) : null}
                    </>
                  )}
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>

      <View
        style={styles.dots}
        accessibilityRole="adjustable"
        accessibilityLabel={`${sectionTitle} ${activePage + 1} / ${PAGE_COUNT}`}
      >
        {Array.from({ length: PAGE_COUNT }).map((_, i) => {
          const active = i === activePage;
          return (
            <View
              key={`hadith-verse-dot-${i}`}
              style={[
                styles.dot,
                {
                  backgroundColor: active
                    ? colors.accent
                    : colors.isDark
                      ? "rgba(255,255,255,0.22)"
                      : "rgba(0,0,0,0.14)",
                },
                active && styles.dotActive,
              ]}
            />
          );
        })}
      </View>
    </HomeSection>
  );
}

const styles = StyleSheet.create({
  carouselContent: {
    alignItems: "flex-start",
  },
  page: {
    justifyContent: "flex-start",
  },
  verseLoader: {
    paddingVertical: 20,
    alignSelf: "flex-start",
  },
  verseArabic: {
    writingDirection: "rtl",
    textAlign: "right",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    minHeight: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 16,
    borderRadius: 3,
  },
});
