import { ActivityIndicator, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { FeaturedListenHero } from "@/components/FeaturedListenHero";
import { HomeSection } from "@/components/home/HomeSection";
import { useAppTheme } from "@/lib/app-theme";
import { useAppPreferences } from "@/lib/app-preferences";
import { useTranslation } from "@/lib/i18n";
import {
  useContinueActivities,
  type ContinueActivity,
} from "@/lib/home/useContinueActivities";
import { useQuranAudioContextOptional } from "@/lib/quran/QuranAudioContext";
import { AVAILABLE_RECITERS } from "@/lib/quran/types";
import { SECTION_GAP } from "@/lib/ui/spacing";

/** Même carte hero que Écoute — uniquement s’il y a une activité récente. */
export function HomeContinueSection() {
  const colors = useAppTheme();
  const { t } = useTranslation();
  const { quranReciter } = useAppPreferences();
  const { items, loading } = useContinueActivities();
  const audio = useQuranAudioContextOptional();

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color={colors.accent} style={styles.loader} />
      </View>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const item = items[0];
  const reciterName =
    AVAILABLE_RECITERS.find((r) => r.id === quranReciter)?.name ??
    AVAILABLE_RECITERS[0]?.name ??
    "";

  const progressLabel =
    item.kind === "listen" && item.progress != null && item.progress > 0
      ? `${Math.round(item.progress * 100)} %`
      : undefined;

  const handlePress = (activity: ContinueActivity) => {
    if (activity.kind === "listen") {
      void audio?.playSura(activity.suraNumber);
      router.push("/(root)/(tabs)/explore");
      return;
    }
    router.push(`/(root)/(tabs)/coran/${activity.suraNumber}` as const);
  };

  return (
    <HomeSection title={t("home.continue")}>
      <FeaturedListenHero
        title={item.suraName}
        reciter={
          item.kind === "listen" ? reciterName : t("home.continueRead")
        }
        progressLabel={progressLabel}
        progress={item.kind === "listen" ? item.progress : undefined}
        onPress={() => handlePress(item)}
      />
    </HomeSection>
  );
}

const styles = StyleSheet.create({
  loadingWrap: {
    marginTop: SECTION_GAP,
  },
  loader: {
    marginVertical: 16,
  },
});
