import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { ListRow } from "@/components/ListRow";
import { ScreenBackground } from "@/components/ScreenBackground";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { screenScrollContent } from "@/constants/screen-layout";
import { useTranslation } from "@/lib/i18n";
import { AVAILABLE_RECITERS } from "@/lib/quran/types";

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
          {AVAILABLE_RECITERS.map((reciter) => (
            <ListRow
              key={reciter.id}
              icon="mic"
              title={reciter.name}
              subtitle={reciter.style}
              onPress={() =>
                router.push({
                  pathname: "/(root)/(tabs)/coran/recitateur-detail",
                  params: { id: reciter.id },
                })
              }
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  scroll: { flex: 1 },
  content: { ...screenScrollContent, paddingTop: 8, paddingBottom: 40 },
});
