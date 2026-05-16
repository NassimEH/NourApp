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

import { useMemo, useState } from "react";

import { router, useFocusEffect } from "expo-router";

import { useCallback } from "react";



import { useGlobalContext } from "@/lib/global-provider";

import {
  SCREEN_EDGE_PADDING,
  screenPageHeaderSpacing,
  screenScrollContent,
} from "@/constants/screen-layout";
import { ScreenBackground } from "@/components/ScreenBackground";

import { ScreenPageHeader } from "@/components/ScreenPageHeader";

import { useTranslation } from "@/lib/i18n";

import { useSuraList, useRecentSuras } from "@/lib/quran/hooks";

import type { SuraMeta } from "@/lib/quran/types";



const H_PADDING = SCREEN_EDGE_PADDING;

const ICON_COLOR = "#191D31";

const ACCENT = "#3d6b47";

const TEXT_MUTED = "rgba(0,0,0,0.5)";

const HAIRLINE_BORDER = {

  borderWidth: 1,

  borderColor: "rgba(0, 0, 0, 0.88)",

} as const;



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



function RecentSuraCard({

  sura,

  onPress,

}: {

  sura: SuraMeta;

  onPress: () => void;

}) {

  const revelation =

    sura.revelationType === "Meccan" ? "Mecquoise" : "Médinoise";



  return (

    <TouchableOpacity

      style={[styles.recentSuraCard, HAIRLINE_BORDER]}

      onPress={onPress}

      activeOpacity={0.8}

    >

      <View style={[styles.recentSuraNumberWrap, HAIRLINE_BORDER]}>

        <Text style={styles.recentSuraNumber}>{sura.number}</Text>

      </View>

      <Text style={styles.recentSuraTitle} numberOfLines={1}>

        {sura.englishName}

      </Text>

      <Text style={styles.recentSuraSubtitle} numberOfLines={2}>

        {sura.numberOfAyahs} versets · {revelation}

      </Text>

    </TouchableOpacity>

  );

}



export default function ApprendreScreen() {

  const { user } = useGlobalContext();

  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<"today" | "plan">("today");

  const { list: suras } = useSuraList();

  const { recentSuraNumbers, refetch: refetchRecent } = useRecentSuras();



  useFocusEffect(

    useCallback(() => {

      refetchRecent();

    }, [refetchRecent])

  );



  const recentSuras = useMemo(() => {

    const byNumber = new Map(suras.map((s) => [s.number, s]));

    return recentSuraNumbers

      .map((n) => byNumber.get(n))

      .filter((s): s is SuraMeta => s != null);

  }, [suras, recentSuraNumbers]);



  return (

    <ScreenBackground style={styles.background}>

      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={t("screens.learnTitle")}
          subtitle={`${t("screens.learnSubtitle")} · ${user?.name ?? t("home.defaultUser")}`}
          style={screenPageHeaderSpacing}
          rightElement={
            <View style={styles.headerRight}>
              <View style={[styles.streakBadge, HAIRLINE_BORDER]}>
                <AppIcon name="zap" size={28} color={ACCENT} />
                <Text style={styles.streakCount}>0</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/apprendre-stats")}
                activeOpacity={0.8}
                style={styles.avatarTouchable}
              >
                <Image
                  source={{
                    uri:
                      user?.avatar ??
                      "https://ui-avatars.com/api/?name=U&size=80",
                  }}
                  style={[styles.headerAvatar, HAIRLINE_BORDER]}
                />
              </TouchableOpacity>
            </View>
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.tabsRow, HAIRLINE_BORDER]}>

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



          <TouchableOpacity style={[styles.goalCard, HAIRLINE_BORDER]} activeOpacity={0.8}>

            <View style={[styles.goalIconWrap, HAIRLINE_BORDER]}>

              <AppIcon name="plus" size={24} color={TEXT_MUTED} />

            </View>

            <Text style={styles.goalText}>Définir ton objectif hebdo</Text>

          </TouchableOpacity>



          <View style={styles.recentSection}>

            <View style={styles.recentSectionHeader}>

              <Text style={styles.recentSectionTitle}>Mes dernières sourates</Text>

              <TouchableOpacity

                onPress={() => router.push("/(root)/(tabs)/coran/sourates")}

                activeOpacity={0.7}

              >

                <Text style={styles.recentSeeAll}>Tout voir</Text>

              </TouchableOpacity>

            </View>

            {recentSuras.length === 0 ? (

              <View style={[styles.recentEmpty, HAIRLINE_BORDER]}>

                <AppIcon name="book-open" size={22} color={TEXT_MUTED} />

                <Text style={styles.recentEmptyText}>

                  Ouvre une sourate dans le Coran pour la retrouver ici.

                </Text>

              </View>

            ) : (

              <ScrollView

                horizontal

                showsHorizontalScrollIndicator={false}

                contentContainerStyle={styles.recentScroll}

              >

                {recentSuras.map((sura) => (

                  <RecentSuraCard

                    key={sura.number}

                    sura={sura}

                    onPress={() =>

                      router.push(`/(root)/(tabs)/coran/${sura.number}` as const)

                    }

                  />

                ))}

              </ScrollView>

            )}

          </View>



          <Text style={styles.courseTitle}>Débutant (A1) – Parcours 1</Text>



          {LESSONS.map((lesson, index) => {

            const color = LESSON_COLORS[index % LESSON_COLORS.length];

            const cardColor = lesson.locked ? `${color}18` : color;

            return (

              <View key={lesson.id} style={styles.lessonCardWrap}>

                {lesson.locked ? (

                  <View

                    style={[

                      styles.lessonCardRect,

                      styles.lessonCardLocked,

                      HAIRLINE_BORDER,

                      { backgroundColor: cardColor },

                    ]}

                  >

                    <View style={[styles.lockIconWrap, HAIRLINE_BORDER]}>

                      <AppIcon name="lock" size={20} color={ICON_COLOR} />

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

                      <AppIcon name="chevron-right" size={22} color={ICON_COLOR} />

                    </View>

                  </View>

                ) : (

                  <View

                    style={[

                      styles.lessonCardRect,

                      styles.lessonCardActive,

                      HAIRLINE_BORDER,

                      { backgroundColor: cardColor },

                    ]}

                  >

                    <View style={styles.lessonCardActiveContent}>

                      <Text style={styles.lessonActiveBadge}>Leçon {lesson.id}</Text>

                      <Text style={styles.lessonActiveTitle} numberOfLines={2}>

                        {lesson.title} – {lesson.subtitle}

                      </Text>

                      <View style={styles.lessonActiveVisual}>

                        <View style={[styles.lessonVisualPlaceholder, HAIRLINE_BORDER]}>

                          <AppIcon

                            name="book-open"

                            size={36}

                            color="rgba(255,255,255,0.85)"

                          />

                        </View>

                      </View>

                      <TouchableOpacity

                        style={[styles.startButton, HAIRLINE_BORDER]}

                        activeOpacity={0.8}

                      >

                        <Text style={styles.startButtonText}>Commencer</Text>

                        <AppIcon name="chevron-right" size={18} color="#fff" />

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

    </ScreenBackground>

  );

}



const styles = StyleSheet.create({

  background: { flex: 1 },

  safeArea: { flex: 1, backgroundColor: "transparent" },

  scrollContent: {
    ...screenScrollContent,
    paddingTop: 8,
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

    paddingHorizontal: 10,

    paddingVertical: 6,

    borderRadius: 20,

    backgroundColor: "rgba(255,255,255,0.65)",

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

    paddingHorizontal: 12,

    paddingVertical: 8,

    borderRadius: 12,

    backgroundColor: "rgba(255,255,255,0.55)",

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



  recentSection: {

    marginBottom: 28,

  },

  recentSectionHeader: {

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginBottom: 14,

  },

  recentSectionTitle: {

    fontSize: 20,

    fontFamily: "PlusJakartaSans-Bold",

    color: ICON_COLOR,

  },

  recentSeeAll: {

    fontSize: 13,

    fontFamily: "PlusJakartaSans-SemiBold",

    color: TEXT_MUTED,

  },

  recentScroll: {

    flexDirection: "row",

    gap: 12,

    paddingRight: 4,

  },

  recentSuraCard: {

    width: 132,

    padding: 12,

    borderRadius: 12,

    backgroundColor: "rgba(255,255,255,0.72)",

  },

  recentSuraNumberWrap: {

    width: 32,

    height: 32,

    borderRadius: 8,

    alignItems: "center",

    justifyContent: "center",

    marginBottom: 10,

    backgroundColor: "rgba(61, 107, 71, 0.12)",

  },

  recentSuraNumber: {

    fontSize: 14,

    fontFamily: "PlusJakartaSans-Bold",

    color: ACCENT,

  },

  recentSuraTitle: {

    fontSize: 14,

    fontFamily: "PlusJakartaSans-SemiBold",

    color: ICON_COLOR,

    marginBottom: 4,

  },

  recentSuraSubtitle: {

    fontSize: 11,

    fontFamily: "PlusJakartaSans-Regular",

    color: TEXT_MUTED,

    lineHeight: 15,

  },

  recentEmpty: {

    flexDirection: "row",

    alignItems: "center",

    gap: 12,

    padding: 16,

    borderRadius: 12,

    backgroundColor: "rgba(255,255,255,0.55)",

  },

  recentEmptyText: {

    flex: 1,

    fontSize: 14,

    fontFamily: "PlusJakartaSans-Regular",

    color: TEXT_MUTED,

    lineHeight: 20,

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

    backgroundColor: "rgba(255,255,255,0.95)",

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


