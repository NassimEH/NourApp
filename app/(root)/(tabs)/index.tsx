import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useMemo } from "react";
import { router, type Href } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { toHijri } from "hijri-converter";

import { AppIcon } from "@/components/AppIcon";
import {
  isVendredi,
  getHadithVendrediDuJour,
} from "@/constants/hadithsVendredi";
import { HomeContinueSection } from "@/components/home/HomeContinueSection";
import { HomePrayerWeatherCarousel } from "@/components/home/HomePrayerWeatherCarousel";
import { HomeToolsSection } from "@/components/home/HomeToolsSection";
import { HomeHadithDuJourSection } from "@/components/home/HomeHadithDuJourSection";
import { HomeRamadanBanner } from "@/components/home/HomeRamadanBanner";
import { rescheduleNextPrayerNotification } from "@/lib/notifications/prayer-notifications";
import { useGlobalContext } from "@/lib/global-provider";
import { usePrayerTimes, type PrayerTimes } from "@/lib/usePrayerTimes";
import { ScreenBackground } from "@/components/ScreenBackground";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { useAppTypography } from "@/lib/app-typography";
import { useAppTheme } from "@/lib/app-theme";
import { createHomeStyles } from "@/lib/home-screen-styles";
import { addActivityLog } from "@/lib/activity-log";
import { useTranslation, getLocaleDateString, TRANSLATIONS } from "@/lib/i18n";

function useTodayDates(locale: "fr" | "en" | "ar") {
  return useMemo(() => {
    const now = new Date();
    const gy = now.getFullYear();
    const gm = now.getMonth() + 1;
    const gd = now.getDate();
    const gregorian = getLocaleDateString(locale, now);
    const hijriMonths = TRANSLATIONS[locale].home.hijriMonths;
    try {
      const { hy, hm, hd } = toHijri(gy, gm, gd);
      const hijri = `${hijriMonths[hm - 1] ?? ""} ${hd}, ${hy}`;
      return { gregorian, hijri };
    } catch {
      return { gregorian, hijri: "" };
    }
  }, [locale]);
}

const HeaderBell = React.memo(function HeaderBell({
  onBellPress,
  bellLabel,
}: {
  onBellPress: () => void;
  bellLabel: string;
}) {
  const colors = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onBellPress}
      accessibilityRole="button"
      accessibilityLabel={bellLabel}
      hitSlop={12}
      className="mt-2"
    >
      <AppIcon name="bell" size={32} color={colors.icon} />
    </TouchableOpacity>
  );
});

type HomeListHeaderProps = {
  user: { name?: string; avatar?: string } | null;
  gregorian: string;
  hijri: string;
  todayIndex: number;
  prayerLoading: boolean;
  prayerTimes: PrayerTimes | null;
  prayerCity: string | null;
  prayerCoords: { latitude: number; longitude: number } | null;
  onRequestLocation: () => void;
  onBellPress: () => void;
  bellLabel: string;
};

const HomeListHeader = React.memo(function HomeListHeader({
  user,
  gregorian,
  hijri,
  todayIndex,
  prayerLoading,
  prayerTimes,
  prayerCity,
  prayerCoords,
  onRequestLocation,
  onBellPress,
  bellLabel,
}: HomeListHeaderProps) {
  const vendredi = isVendredi();
  const hadithVendredi = getHadithVendrediDuJour();

  const typography = useAppTypography();
  const colors = useAppTheme();
  const themed = useMemo(() => createHomeStyles(colors), [colors]);
  const { t, locale, rtlTextStyle, rtlViewStyle } = useTranslation();
  const weekDays = TRANSLATIONS[locale].home.weekDays;
  return (
    <View>
      <View style={[styles.homeHeaderBlock, rtlViewStyle]}>
        <ScreenPageHeader
          title={t("home.title")}
          subtitle={
            vendredi
              ? `${t("home.goodFriday")} · ${t("screens.homeSubtitle")}`
              : t("screens.homeSubtitle")
          }
          rightElement={
            <HeaderBell
              onBellPress={onBellPress}
              bellLabel={bellLabel}
            />
          }
        />
      </View>
      <View style={[styles.homeBody, rtlViewStyle]}>
      <View className="flex flex-col items-start mt-1.5">
        <Text
          style={[
            themed.welcomeTitle,
            rtlTextStyle,
            { fontSize: typography.title, lineHeight: typography.title * 1.25 },
          ]}
        >
          {t("home.welcome")}
          {user?.name ? ` ${user.name}` : ` ${t("home.defaultUser")}`}
        </Text>
        <Text
          style={[
            themed.welcomeDate,
            rtlTextStyle,
            {
              fontSize: typography.subtitle,
              lineHeight: typography.subtitle * 1.35,
            },
          ]}
        >
          {gregorian}
        </Text>
        {hijri ? (
          <Text
            style={[
              themed.welcomeHijri,
              rtlTextStyle,
              { fontSize: typography.body, lineHeight: typography.body * 1.4 },
            ]}
          >
            {hijri}
          </Text>
        ) : null}
      </View>

      <View className="flex flex-row justify-between mt-6 mb-2">
        {weekDays.map((day, index) => {
          const isToday = index === todayIndex;
          const isPassed = index <= todayIndex;
          return (
            <View key={day} className="flex-1 items-center">
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: isToday
                    ? "PlusJakartaSans-Bold"
                    : "PlusJakartaSans-Regular",
                  color: isToday ? colors.text : colors.textMuted,
                }}
              >
                {day}
              </Text>
              <View
                style={[
                  styles.dayPill,
                  isPassed
                    ? { backgroundColor: colors.accent }
                    : {
                        backgroundColor: "transparent",
                        borderWidth: 2,
                        borderColor: colors.border,
                      },
                ]}
              />
            </View>
          );
        })}
      </View>
      <HomePrayerWeatherCarousel
        prayerLoading={prayerLoading}
        prayerCoords={prayerCoords}
        onRequestLocation={onRequestLocation}
      />

      <HomeRamadanBanner />

      {vendredi && hadithVendredi && (
        <Pressable
          onPress={() => router.push("/(root)/hadith-friday" as Href)}
          style={({ pressed }) => [
            themed.hadithVendrediBlock,
            pressed && { opacity: 0.92 },
          ]}
          accessibilityRole="button"
          accessibilityLabel={t("home.hadithFridayLabel")}
        >
          <Text style={themed.hadithVendrediLabel}>{t("home.hadithFridayLabel")}</Text>
          <Text style={themed.hadithVendrediText}>{hadithVendredi.text}</Text>
          <Text style={themed.hadithVendrediSource}>{hadithVendredi.source}</Text>
        </Pressable>
      )}

      <HomeHadithDuJourSection />
      <HomeToolsSection />
      <HomeContinueSection />
      </View>
    </View>
  );
});

const Home = () => {
  const { user } = useGlobalContext();
  const { locale } = useTranslation();
  const { gregorian, hijri } = useTodayDates(locale);
  const todayIndex = useMemo(() => (new Date().getDay() + 6) % 7, []);
  const {
    timings: prayerTimes,
    loading: prayerLoading,
    cityName: prayerCity,
    coords: prayerCoords,
    refetch: refetchLocation,
  } = usePrayerTimes();
  const { t: tHome } = useTranslation();

  useEffect(() => {
    if (prayerTimes) {
      void rescheduleNextPrayerNotification(prayerTimes);
    }
  }, [prayerTimes]);

  const handleBellPress = () => {
    Alert.alert(
      tHome("home.bellMenuTitle"),
      tHome("home.bellMenuBody"),
      [
        { text: tHome("common.cancel"), style: "cancel" },
        {
          text: tHome("home.bellMenuReminders"),
          onPress: () => {
            void addActivityLog(tHome("home.bellMenuReminders"));
            router.push("/(root)/reminders");
          },
        },
        {
          text: tHome("home.bellMenuNotifications"),
          onPress: () => {
            void addActivityLog(tHome("home.bellMenuNotifications"));
            router.push("/(root)/(tabs)/profile");
          },
        },
      ]
    );
  };

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView className="h-full bg-transparent" edges={["top", "left", "right"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <HomeListHeader
            user={user}
            gregorian={gregorian}
            hijri={hijri}
            todayIndex={todayIndex}
            prayerLoading={prayerLoading}
            prayerTimes={prayerTimes}
            prayerCity={prayerCity}
            prayerCoords={prayerCoords}
            onRequestLocation={refetchLocation}
            onBellPress={handleBellPress}
            bellLabel={tHome("reminders.title")}
          />
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  homeHeaderBlock: { paddingTop: 12, marginTop: 8 },
  homeBody: { paddingHorizontal: SCREEN_EDGE_PADDING },
  scrollContent: { paddingBottom: 120 },
  dayPill: {
    width: 24,
    height: 36,
    borderRadius: 12,
    marginTop: 6,
  },
});

export default Home;
