import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppIcon } from "@/components/AppIcon";
import { router } from "expo-router";

import { useGlobalContext } from "@/lib/global-provider";
import { ScreenBackground } from "@/components/ScreenBackground";
import {
  SCREEN_EDGE_PADDING,
  screenPageHeaderSpacing,
  screenScrollContent,
} from "@/constants/screen-layout";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { useTranslation } from "@/lib/i18n";

const H_PADDING = SCREEN_EDGE_PADDING;
const ICON_COLOR = "#191D31";
const ACCENT = "#3d6b47";
const TEXT_MUTED = "rgba(0,0,0,0.5)";

const WEEK_DAYS = ["D", "L", "M", "M", "J", "V", "S"];
const TODAY_INDEX = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

const PROGRESS_LEVELS = [
  { label: "D?butant", pct: 45, color: "#3d6b47" },
  { label: "Avanc?", pct: 45, color: "#6b9b5c" },
  { label: "Interm?diaire", pct: 25, color: "#c45c3e" },
  { label: "Expert", pct: 20, color: "#d4a84b" },
];

export default function ApprendreStatsScreen() {
  const { user } = useGlobalContext();
  const { t } = useTranslation();

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={user?.name ?? t("home.defaultUser")}
          subtitle={t("screens.learnStatsSubtitle")}
          style={screenPageHeaderSpacing}
          onBack={() => router.back()}
          headerActions={
            <TouchableOpacity
              onPress={() => router.push("/(root)/(tabs)/profile")}
              style={styles.headerButton}
              activeOpacity={0.7}
            >
              <AppIcon name="settings" size={24} color={ICON_COLOR} />
            </TouchableOpacity>
          }
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Carte R?sum? hebdo */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>R?sum? hebdo</Text>

            <Text style={styles.sectionLabel}>Activit?</Text>
            <View style={styles.daysRow}>
              {WEEK_DAYS.map((day, i) => (
                <View key={i} style={styles.dayCol}>
                  <Text
                    style={[
                      styles.dayLetter,
                      i === TODAY_INDEX && styles.dayLetterActive,
                    ]}
                  >
                    {day}
                  </Text>
                  <Text
                    style={[
                      styles.dayValue,
                      i === TODAY_INDEX && styles.dayValueActive,
                    ]}
                  >
                    0
                  </Text>
                  {i === TODAY_INDEX && <View style={styles.dayUnderline} />}
                </View>
              ))}
            </View>

            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>
              Objectifs hebdo
            </Text>
            <View style={styles.goalsRow}>
              <AppIcon name="flag" size={20} color={ICON_COLOR} />
              <View style={styles.goalsTextWrap}>
                <Text style={styles.goalsTitle}>Objectifs hebdo</Text>
                <Text style={styles.goalsSubtitle}>Pr?ts, partez, objectif</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.setGoalButton}
              activeOpacity={0.8}
            >
              <Text style={styles.setGoalButtonText}>D?finir ton objectif</Text>
            </TouchableOpacity>
          </View>

          {/* Carte Progression */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Progression</Text>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>3/7</Text>
            </View>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressSegment,
                  { flex: 45, backgroundColor: "#3d6b47" },
                ]}
              />
              <View
                style={[
                  styles.progressSegment,
                  { flex: 45, backgroundColor: "#6b9b5c" },
                ]}
              />
              <View
                style={[
                  styles.progressSegment,
                  { flex: 25, backgroundColor: "#c45c3e" },
                ]}
              />
              <View
                style={[
                  styles.progressSegment,
                  { flex: 20, backgroundColor: "#d4a84b" },
                ]}
              />
            </View>

            <View style={styles.levelsList}>
              {PROGRESS_LEVELS.map((level, i) => (
                <View key={i} style={styles.levelRow}>
                  <View
                    style={[
                      styles.levelDot,
                      { backgroundColor: level.color },
                    ]}
                  />
                  <Text style={styles.levelText}>
                    {level.label} ({level.pct}%)
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  scroll: { flex: 1 },
  scrollContent: {
    ...screenScrollContent,
    paddingTop: 8,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    paddingVertical: 12,
    marginBottom: 16,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: "PlusJakartaSans-Bold",
    color: ICON_COLOR,
    textAlign: "center",
    marginHorizontal: 8,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    color: ICON_COLOR,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Bold",
    color: ICON_COLOR,
    marginBottom: 12,
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayCol: {
    alignItems: "center",
    flex: 1,
  },
  dayLetter: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: TEXT_MUTED,
    marginBottom: 6,
  },
  dayLetterActive: {
    color: ACCENT,
  },
  dayValue: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Bold",
    color: TEXT_MUTED,
  },
  dayValueActive: {
    color: ACCENT,
  },
  dayUnderline: {
    width: 18,
    height: 2,
    backgroundColor: ACCENT,
    borderRadius: 1,
    marginTop: 4,
  },
  goalsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  goalsTextWrap: {},
  goalsTitle: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Bold",
    color: ICON_COLOR,
  },
  goalsSubtitle: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: TEXT_MUTED,
    marginTop: 2,
  },
  setGoalButton: {
    backgroundColor: ICON_COLOR,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  setGoalButtonText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#fff",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: ICON_COLOR,
  },
  totalValue: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-Bold",
    color: ICON_COLOR,
  },
  progressBar: {
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressSegment: {
    minWidth: 4,
  },
  levelsList: {
    gap: 12,
  },
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  levelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  levelText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Medium",
    color: ICON_COLOR,
  },

  bottomSpacer: { height: 24 },
});
