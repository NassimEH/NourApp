import {
  ImageBackground,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

import { JUZ_TO_FIRST_SURA } from "@/lib/quran/juzMapping";

const homeBackground = require("@/assets/images/home-background.png");
const H_PADDING = 24;
const ICON_COLOR = "#191D31";
const ACCENT = "#3d6b47";
const TEXT_MUTED = "rgba(0,0,0,0.5)";

const JUZ_ITEMS = Array.from({ length: 30 }, (_, i) => i + 1);

const JUZ_EXPLANATION =
  "Le Coran est divisé en 30 juz (parties) pour faciliter la lecture sur un mois. Chaque juz regroupe plusieurs sourates ; en touchant un juz, vous accédez au début de cette partie.";

export default function JuzScreen() {
  return (
    <ImageBackground source={homeBackground} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
            <Feather name="chevron-left" size={26} color={ICON_COLOR} />
          </TouchableOpacity>
          <Text style={styles.title}>Par Juz</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.explanationBlock}>
          <Text style={styles.explanationText}>{JUZ_EXPLANATION}</Text>
        </View>

        <FlatList
          data={JUZ_ITEMS}
          keyExtractor={(n) => String(n)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const firstSura = JUZ_TO_FIRST_SURA[item];
            return (
              <TouchableOpacity
                style={styles.juzCard}
                onPress={() => router.push(`/(root)/(tabs)/coran/${firstSura}` as const)}
                activeOpacity={0.7}
              >
                <Text style={styles.juzNumber}>{item}</Text>
                <Text style={styles.juzLabel}>Juz {item}</Text>
                <Feather name="chevron-right" size={20} color={ICON_COLOR} style={styles.juzChevron} />
              </TouchableOpacity>
            );
          }}
        />
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
  backButton: { padding: 8 },
  title: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    color: ICON_COLOR,
  },
  placeholder: { width: 44 },
  explanationBlock: {
    paddingHorizontal: H_PADDING,
    paddingTop: 8,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  explanationText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: TEXT_MUTED,
    lineHeight: 22,
  },
  row: { gap: 12, marginBottom: 12, paddingHorizontal: H_PADDING },
  listContent: { paddingBottom: 120 },
  juzCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  juzNumber: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    color: TEXT_MUTED,
    width: 24,
    textAlign: "right",
  },
  juzLabel: {
    flex: 1,
    fontSize: 17,
    fontFamily: "PlusJakartaSans-Medium",
    color: ICON_COLOR,
  },
  juzChevron: { marginLeft: "auto" },
});
