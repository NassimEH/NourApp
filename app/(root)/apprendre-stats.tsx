import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";

import { useGlobalContext } from "@/lib/global-provider";

const homeBackground = require("@/assets/images/home-background.png");

const H_PADDING = 20;
const ICON_COLOR = "#191D31";
const ACCENT = "#3d6b47";
const TEXT_MUTED = "rgba(0,0,0,0.5)";

const WEEK_DAYS = ["D", "L", "M", "M", "J", "V", "S"];
const TODAY_INDEX = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

const PROGRESS_LEVELS = [
  { label: "Débutant", pct: 45, color: "#3d6b47" },
  { label: "Avancé", pct: 45, color: "#6b9b5c" },
  { label: "Intermédiaire", pct: 25, color: "#c45c3e" },
  { label: "Expert", pct: 20, color: "#d4a84b" },
];

export default function ApprendreStatsScreen() {
  const { user } = useGlobalContext();

  return (
    <ImageBackground
      source={homeBackground}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        {/* Header: retour à gauche, nom au centre, paramètres à droite */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerButton}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={26} color={ICON_COLOR} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {user?.name ?? "Utilisateur"}
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(root)/(tabs)/profile")}
            style={styles.headerButton}
            activeOpacity={0.7}
          >
            <Feather name="settings" size={24} color={ICON_COLOR} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Carte Résumé hebdo */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Résumé hebdo</Text>

            <Text style={styles.sectionLabel}>Activité</Text>
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
              <Feather name="flag" size={20} color={ICON_COLOR} />
              <View style={styles.goalsTextWrap}>
                <Text style={styles.goalsTitle}>Objectifs hebdo</Text>
                <Text style={styles.goalsSubtitle}>Prêts, partez, objectif</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.setGoalButton}
              activeOpacity={0.8}
            >
              <Text style={styles.setGoalButtonText}>Définir ton objectif</Text>
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: H_PADDING, paddingBottom: 120 },

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
