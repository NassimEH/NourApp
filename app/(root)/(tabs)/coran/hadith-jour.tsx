import { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";

import { AppIcon } from "@/components/AppIcon";
import { ScreenBackground } from "@/components/ScreenBackground";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { useAppTheme, type AppThemeColors } from "@/lib/app-theme";
import {
  buildHadithDuJourCatalog,
  formatHadithFeaturedDate,
  getHadithDuJour,
} from "@/lib/hadith-du-jour";
import { useTranslation } from "@/lib/i18n";

export default function HadithJourScreen() {
  const { t, locale, rtlTextStyle, rtlViewStyle } = useTranslation();
  const colors = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const todayHadith = getHadithDuJour();
  const todayDate = formatHadithFeaturedDate(new Date(), locale);

  const catalog = useMemo(
    () =>
      [...buildHadithDuJourCatalog()]
        .sort((a, b) => b.featuredDate.getTime() - a.featuredDate.getTime()),
    []
  );

  const onShare = (text: string, source: string) => {
    void Share.share({ message: `${text}\n\n— ${source}` });
  };

  const onCopy = async (text: string, source: string) => {
    await Clipboard.setStringAsync(`${text}\n\n— ${source}`);
    Alert.alert(t("quran.copied"));
  };

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={t("screens.hadithDayTitle")}
          subtitle={t("screens.hadithDaySubtitle")}
          onBack={() => router.back()}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.todayCard, rtlViewStyle]}>
            <View style={styles.todayBadgeRow}>
              <Text style={[styles.todayBadge, rtlTextStyle]}>
                {t("screens.hadithDayToday")}
              </Text>
              <Text style={[styles.todayDate, rtlTextStyle]}>{todayDate}</Text>
            </View>
            <Text style={[styles.hadithText, rtlTextStyle]}>{todayHadith.text}</Text>
            <Text style={[styles.source, rtlTextStyle]}>{todayHadith.source}</Text>

            <View style={[styles.actions, rtlViewStyle]}>
              <TouchableOpacity
                style={[styles.actionBtn, { borderColor: colors.border }]}
                onPress={() => onShare(todayHadith.text, todayHadith.source)}
                activeOpacity={0.85}
              >
                <AppIcon name="share-2" size={18} color={colors.accent} />
                <Text style={[styles.actionLabel, { color: colors.text }]}>
                  {t("quran.shareVerse")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { borderColor: colors.border }]}
                onPress={() => void onCopy(todayHadith.text, todayHadith.source)}
                activeOpacity={0.85}
              >
                <AppIcon name="copy" size={18} color={colors.accent} />
                <Text style={[styles.actionLabel, { color: colors.text }]}>
                  {t("quran.copyVerse")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={[styles.historyTitle, rtlTextStyle]}>
            {t("screens.hadithDayHistory")}
          </Text>

          {catalog.map((entry) => {
            const dateLabel = formatHadithFeaturedDate(entry.featuredDate, locale);
            return (
              <View
                key={entry.index}
                style={[
                  styles.historyRow,
                  rtlViewStyle,
                  entry.isToday && styles.historyRowToday,
                  { borderColor: colors.border },
                ]}
              >
                <Text style={[styles.historyText, rtlTextStyle]}>{entry.hadith.text}</Text>
                <Text style={[styles.historySource, rtlTextStyle]}>
                  {entry.hadith.source}
                </Text>
                <Text style={[styles.historyDate, rtlTextStyle]}>
                  {entry.isToday
                    ? t("screens.hadithDayToday")
                    : t("screens.hadithDayFeaturedOn", { date: dateLabel })}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

function createStyles(colors: AppThemeColors) {
  const cardBg = colors.usesBackgroundImage ? "transparent" : colors.card;

  return StyleSheet.create({
    background: { flex: 1 },
    safeArea: { flex: 1, backgroundColor: "transparent" },
    scrollContent: {
      paddingHorizontal: SCREEN_EDGE_PADDING,
      paddingBottom: 120,
    },
    todayCard: {
      borderRadius: 12,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      backgroundColor: cardBg,
      padding: 16,
      marginBottom: 24,
    },
    todayBadgeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
      gap: 8,
    },
    todayBadge: {
      fontSize: 11,
      fontFamily: "PlusJakartaSans-SemiBold",
      color: colors.accent,
      textTransform: "uppercase",
      letterSpacing: 0.4,
    },
    todayDate: {
      fontSize: 12,
      fontFamily: "PlusJakartaSans-Medium",
      color: colors.textMuted,
    },
    hadithText: {
      fontSize: 17,
      fontFamily: "PlusJakartaSans-Regular",
      color: colors.text,
      lineHeight: 26,
      marginBottom: 10,
    },
    source: {
      fontSize: 14,
      fontFamily: "PlusJakartaSans-Regular",
      color: colors.textMuted,
      lineHeight: 20,
      fontStyle: "italic",
      marginBottom: 14,
    },
    actions: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    actionBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: StyleSheet.hairlineWidth,
    },
    actionLabel: {
      fontSize: 14,
      fontFamily: "PlusJakartaSans-Medium",
    },
    historyTitle: {
      fontSize: 13,
      fontFamily: "PlusJakartaSans-SemiBold",
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.4,
      marginBottom: 12,
    },
    historyRow: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      paddingVertical: 14,
      gap: 6,
    },
    historyRowToday: {
      backgroundColor: colors.accentSurface,
      marginHorizontal: -8,
      paddingHorizontal: 8,
      borderRadius: 10,
      borderBottomWidth: 0,
      marginBottom: 4,
    },
    historyText: {
      fontSize: 15,
      fontFamily: "PlusJakartaSans-Regular",
      color: colors.text,
      lineHeight: 22,
    },
    historySource: {
      fontSize: 13,
      fontFamily: "PlusJakartaSans-Regular",
      color: colors.textMuted,
      fontStyle: "italic",
    },
    historyDate: {
      fontSize: 12,
      fontFamily: "PlusJakartaSans-SemiBold",
      color: colors.accent,
      marginTop: 2,
    },
  });
}
