import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AppIcon } from "@/components/AppIcon";
import { ScreenBackground } from "@/components/ScreenBackground";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { screenScrollContent } from "@/constants/screen-layout";
import { useTranslation } from "@/lib/i18n";

const ICON_COLOR = "#191D31";

export default function RecitateursScreen() {
  const { t } = useTranslation();

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={t("screens.recitersTitle")}
          subtitle={t("screens.recitersSubtitle")}
          onBack={() => router.back()}
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.placeholder}>
            Liste des récitateurs disponibles pour l'écoute du Coran. Appuyez sur un récitateur pour voir son détail et lancer la lecture.
          </Text>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("recitateur-detail")}
            activeOpacity={0.8}
          >
            <AppIcon name="mic" size={24} color={ICON_COLOR} />
            <Text style={styles.cardTitle}>Exemple récitateur</Text>
            <AppIcon name="chevron-right" size={20} color={ICON_COLOR} />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: { paddingVertical: 8, paddingLeft: 8 },
  title: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    color: ICON_COLOR,
  },
  scroll: { flex: 1 },
  content: { ...screenScrollContent, paddingTop: 8, paddingBottom: 40 },
  placeholder: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    color: "rgba(0,0,0,0.7)",
    lineHeight: 22,
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: {
    flex: 1,
    fontSize: 17,
    fontFamily: "PlusJakartaSans-Medium",
    color: ICON_COLOR,
  },
});
