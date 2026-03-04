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
import { useState } from "react";
import { router } from "expo-router";

import { useGlobalContext } from "@/lib/global-provider";

const homeBackground = require("@/assets/images/home-background.png");

const H_PADDING = 20;
const ICON_COLOR = "#191D31";
const ACCENT = "#3d6b47";
const TEXT_MUTED = "rgba(0,0,0,0.5)";

const TABS = [
  { id: "today" as const, label: "Aujourd'hui" },
  { id: "plan" as const, label: "Parcours" },
];

const LESSON_COLORS = ["#3d6b47", "#2d6a7a", "#a65c3e"] as const;

const LESSONS = [
  { id: "1", title: "Les bases de l'arabe", subtitle: "Partie 1", locked: false },
  { id: "2", title: "Les bases de l'arabe", subtitle: "Partie 2", locked: true },
  { id: "3", title: "Salutations et formules", subtitle: "Partie 1", locked: true },
];

export default function ApprendreScreen() {
  const { user } = useGlobalContext();
  const [activeTab, setActiveTab] = useState<"today" | "plan">("today");

  return (
    <ImageBackground
      source={homeBackground}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header: titre en haut à gauche, Salut etc en dessous ; streak + profil cliquable à droite */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Apprendre</Text>
              <Text style={styles.headerGreeting}>Salut 👋</Text>
              <Text style={styles.headerName}>{user?.name ?? "Utilisateur"}</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.streakBadge}>
                <Feather name="zap" size={28} color={ACCENT} />
                <Text style={styles.streakCount}>0</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/apprendre-stats")}
                activeOpacity={0.8}
                style={styles.avatarTouchable}
              >
                <Image
                  source={{ uri: user?.avatar ?? "https://ui-avatars.com/api/?name=U&size=80" }}
                  style={styles.headerAvatar}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tabs: Aujourd'hui | Parcours */}
          <View style={styles.tabsRow}>
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={styles.tab}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    activeTab === tab.id && styles.tabLabelActive,
                  ]}
                >
                  {tab.label}
                </Text>
                {activeTab === tab.id && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* Objectif hebdo card */}
          <TouchableOpacity
            style={styles.goalCard}
            activeOpacity={0.8}
          >
            <View style={styles.goalIconWrap}>
              <Feather name="plus" size={24} color={TEXT_MUTED} />
            </View>
            <Text style={styles.goalText}>Définir ton objectif hebdo</Text>
          </TouchableOpacity>

          {/* Parcours title */}
          <Text style={styles.courseTitle}>Débutant (A1) – Parcours 1</Text>

          {/* Lesson list - cartes rectangulaires allongées, style unifié, couleur par leçon */}
          {LESSONS.map((lesson, index) => {
            const color = LESSON_COLORS[index % LESSON_COLORS.length];
            const cardColor = lesson.locked
              ? `${color}18`
              : color;
            return (
              <View key={lesson.id} style={styles.lessonCardWrap}>
                {lesson.locked ? (
                  <View
                    style={[
                      styles.lessonCardRect,
                      styles.lessonCardLocked,
                      { backgroundColor: cardColor, borderColor: `${color}40` },
                    ]}
                  >
                    <View style={[styles.lockIconWrap, { backgroundColor: "rgba(255,255,255,0.95)" }]}>
                      <Feather name="lock" size={20} color={ICON_COLOR} />
                    </View>
                    <View style={styles.lessonCardLockedText}>
                      <Text style={styles.lessonLockedTitle} numberOfLines={1}>
                        {lesson.title}
                      </Text>
                      <Text style={styles.lessonLockedSubtitle}>
                        Leçon {lesson.id}
                      </Text>
                    </View>
                    <View style={styles.lessonCardArrow}>
                      <Feather name="chevron-right" size={22} color={ICON_COLOR} />
                    </View>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.lessonCardRect,
                      styles.lessonCardActive,
                      { backgroundColor: cardColor, borderColor: `${color}60` },
                    ]}
                  >
                    <View style={styles.lessonCardActiveContent}>
                      <Text style={styles.lessonActiveBadge}>Leçon {lesson.id}</Text>
                      <Text style={styles.lessonActiveTitle} numberOfLines={2}>
                        {lesson.title} – {lesson.subtitle}
                      </Text>
                      <View style={styles.lessonActiveVisual}>
                        <View style={styles.lessonVisualPlaceholder}>
                          <Feather name="book-open" size={36} color="rgba(255,255,255,0.85)" />
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.startButton}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.startButtonText}>Commencer</Text>
                        <Feather name="chevron-right" size={18} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            );
          })}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  scrollContent: { paddingHorizontal: H_PADDING, paddingBottom: 120 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 8,
    marginBottom: 24,
  },
  headerLeft: {},
  headerTitle: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    color: ICON_COLOR,
    marginBottom: 4,
  },
  headerGreeting: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Medium",
    color: TEXT_MUTED,
    marginBottom: 2,
  },
  headerName: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: ICON_COLOR,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  streakCount: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    color: ICON_COLOR,
  },
  avatarTouchable: {},
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  tabsRow: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 24,
  },
  tab: {
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 17,
    fontFamily: "PlusJakartaSans-Medium",
    color: TEXT_MUTED,
  },
  tabLabelActive: {
    fontFamily: "PlusJakartaSans-Bold",
    color: ICON_COLOR,
  },
  tabUnderline: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundColor: ACCENT,
    borderRadius: 2,
  },

  goalCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 28,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(0,0,0,0.12)",
  },
  goalIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  goalText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: ICON_COLOR,
  },

  courseTitle: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    color: ICON_COLOR,
    marginBottom: 20,
  },

  lessonCardWrap: {
    marginBottom: 16,
  },
  lessonCardRect: {
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    minHeight: 140,
  },
  lessonCardLocked: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  lockIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  lessonCardLockedText: { flex: 1 },
  lessonCardArrow: {
    padding: 8,
  },
  lessonLockedTitle: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: ICON_COLOR,
  },
  lessonLockedSubtitle: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    color: TEXT_MUTED,
    marginTop: 2,
  },

  lessonCardActive: {
    overflow: "hidden",
  },
  lessonCardActiveContent: {
    padding: 20,
    minHeight: 140,
    justifyContent: "space-between",
  },
  lessonActiveBadge: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Medium",
    color: "rgba(255,255,255,0.9)",
    marginBottom: 4,
  },
  lessonActiveTitle: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#fff",
    marginBottom: 10,
  },
  lessonActiveVisual: {
    marginBottom: 12,
  },
  lessonVisualPlaceholder: {
    height: 72,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 12,
  },
  startButtonText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#fff",
  },

  bottomSpacer: { height: 24 },
});
