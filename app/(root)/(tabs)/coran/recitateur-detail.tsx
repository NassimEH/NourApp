import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { AppIcon } from "@/components/AppIcon";
import { ScreenStackLayout } from "@/components/ScreenStackLayout";
import { useAppPreferences } from "@/lib/app-preferences";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { useQuranAudioContext } from "@/lib/quran/QuranAudioContext";
import { AVAILABLE_RECITERS } from "@/lib/quran/types";

export default function RecitateurDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { t } = useTranslation();
  const colors = useAppTheme();
  const audio = useQuranAudioContext();
  const { quranReciter, setQuranReciter } = useAppPreferences();

  const reciter = AVAILABLE_RECITERS.find((r) => r.id === id) ?? AVAILABLE_RECITERS[0];
  const isFavorite = quranReciter === reciter.id;

  const onPlay = () => {
    void audio.setReciter(reciter.id);
    audio.playSura(1);
    router.push("/(root)/(tabs)/explore");
  };

  const onSetFavorite = () => {
    setQuranReciter(reciter.id);
    void audio.setReciter(reciter.id);
  };

  return (
    <ScreenStackLayout
      title={reciter.name}
      subtitle={reciter.style}
    >
      <View
        style={[
          styles.hero,
          { backgroundColor: colors.accentSurface, borderColor: colors.accentBorder },
        ]}
      >
        <AppIcon name="mic" size={40} color={colors.accent} />
        <Text style={[styles.styleLabel, { color: colors.textMuted }]}>{reciter.style}</Text>
      </View>

      <TouchableOpacity
        style={[styles.primaryBtn, { backgroundColor: colors.accent }]}
        onPress={onPlay}
        activeOpacity={0.85}
      >
        <AppIcon name="play" size={22} color="#fff" />
        <Text style={styles.primaryBtnText}>{t("screens.reciterPlaySample")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.secondaryBtn,
          { borderColor: colors.border, backgroundColor: colors.cardElevated },
        ]}
        onPress={onSetFavorite}
        activeOpacity={0.85}
      >
        <AppIcon name={isFavorite ? "check" : "star"} size={20} color={colors.accent} />
        <Text style={[styles.secondaryBtnText, { color: colors.text }]}>
          {isFavorite ? t("screens.reciterFavoriteDone") : t("screens.reciterSetFavorite")}
        </Text>
      </TouchableOpacity>
    </ScreenStackLayout>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 28,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 20,
  },
  styleLabel: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Medium",
  },
});
