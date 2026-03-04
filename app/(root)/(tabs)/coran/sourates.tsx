import {
  ImageBackground,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { useMemo, useState } from "react";

import { useSuraList } from "@/lib/quran/hooks/useSuraList";
import { useRandomAyah } from "@/lib/quran/hooks/useRandomAyah";
import type { SuraMeta } from "@/lib/quran/types";
import { SuraRow } from "@/components/quran/SuraRow";
import { SuraListSkeleton } from "@/components/quran/SuraListSkeleton";

const homeBackground = require("@/assets/images/home-background.png");
const H_PADDING = 20;
const ICON_COLOR = "#191D31";
const ACCENT = "#3d6b47";
const TEXT_MUTED = "rgba(0,0,0,0.5)";

function filterSuras(list: SuraMeta[], query: string): SuraMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.englishName.toLowerCase().includes(q) ||
      String(s.number) === q
  );
}

export default function SouratesScreen() {
  const { list, loading, error, refetch } = useSuraList();
  const { ayah: randomAyah } = useRandomAyah();
  const [search, setSearch] = useState("");
  const [verseOfDayInArabic, setVerseOfDayInArabic] = useState(false);

  const filtered = useMemo(() => filterSuras(list, search), [list, search]);

  const handleSuraPress = (sura: SuraMeta) => {
    router.push(`/(root)/(tabs)/coran/${sura.number}` as const);
  };

  return (
    <ImageBackground source={homeBackground} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
            <Feather name="chevron-left" size={28} color={ICON_COLOR} />
          </TouchableOpacity>
          <Text style={styles.title}>Sourates</Text>
          <TouchableOpacity
            onPress={() => router.push("/(root)/(tabs)/coran/juz")}
            style={styles.juzLink}
            activeOpacity={0.7}
          >
            <Feather name="layers" size={22} color={ACCENT} />
            <Text style={styles.juzLinkText}>Juz</Text>
          </TouchableOpacity>
        </View>

        {loading && list.length === 0 ? (
          <SuraListSkeleton />
        ) : error && list.length === 0 ? (
          <View style={styles.errorBlock}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => refetch()} activeOpacity={0.8}>
              <Feather name="refresh-cw" size={20} color="#fff" />
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.searchWrap}>
              <Feather name="search" size={18} color={TEXT_MUTED} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher…"
                placeholderTextColor={TEXT_MUTED}
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")} hitSlop={12}>
                  <Feather name="x" size={18} color={TEXT_MUTED} />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filtered}
              keyExtractor={(item) => String(item.number)}
              ListHeaderComponent={
                randomAyah ? (
                  <View style={styles.verseOfDayBlock}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => router.push(`/(root)/(tabs)/coran/${randomAyah.suraNumber}` as const)}
                    >
                      <Text style={styles.verseOfDayLabel}>Verset du jour</Text>
                      <Text
                        style={[
                          styles.verseOfDayText,
                          verseOfDayInArabic && styles.verseOfDayTextRtl,
                        ]}
                        numberOfLines={4}
                      >
                        {verseOfDayInArabic ? randomAyah.textAr : randomAyah.textFr || randomAyah.textAr}
                      </Text>
                      <Text style={styles.verseOfDayRef}>
                        Sourate {randomAyah.suraNumber}, verset {randomAyah.ayahNumber}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.verseOfDayToggle}
                      onPress={() => setVerseOfDayInArabic((v) => !v)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.verseOfDayToggleText}>
                        {verseOfDayInArabic ? "Voir en français" : "Voir en arabe"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null
              }
              renderItem={({ item }) => (
                <SuraRow sura={item} onPress={() => handleSuraPress(item)} />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>Aucune sourate trouvée</Text>
                </View>
              }
            />
          </>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: H_PADDING,
    paddingVertical: 12,
  },
  backButton: { paddingVertical: 8, paddingRight: 8 },
  title: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    color: ICON_COLOR,
  },
  juzLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  juzLinkText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: ACCENT,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: H_PADDING,
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    color: ICON_COLOR,
    padding: 0,
  },
  verseOfDayBlock: {
    paddingTop: 20,
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.08)",
    gap: 8,
  },
  verseOfDayLabel: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "rgba(61, 107, 71, 0.9)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  verseOfDayText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Medium",
    color: ICON_COLOR,
    lineHeight: 24,
  },
  verseOfDayRef: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#5b5d5e",
    lineHeight: 20,
    fontStyle: "italic",
  },
  verseOfDayTextRtl: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  verseOfDayToggle: {
    marginTop: 12,
    alignSelf: "flex-start",
  },
  verseOfDayToggleText: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: ACCENT,
  },
  listContent: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 120,
  },
  errorBlock: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Regular",
    color: ICON_COLOR,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: ACCENT,
  },
  retryText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#fff",
  },
  empty: { paddingVertical: 40, alignItems: "center" },
  emptyText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    color: TEXT_MUTED,
  },
});
