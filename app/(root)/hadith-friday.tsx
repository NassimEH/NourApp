import { StyleSheet, Text, TouchableOpacity, Share, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { AppIcon } from "@/components/AppIcon";
import { PreferenceScreenLayout } from "@/components/PreferenceScreenLayout";
import { getHadithVendrediDuJour } from "@/constants/hadithsVendredi";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

export default function HadithFridayScreen() {
  const { t, rtlTextStyle } = useTranslation();
  const colors = useAppTheme();
  const hadith = getHadithVendrediDuJour();

  if (!hadith) {
    return (
      <PreferenceScreenLayout
        title={t("screens.hadithFridayScreenTitle")}
        subtitle={t("home.hadithFridayLabel")}
      >
        <Text style={[styles.empty, { color: colors.textMuted }, rtlTextStyle]}>
          {t("screens.hadithFridayNotFriday")}
        </Text>
      </PreferenceScreenLayout>
    );
  }

  const onShare = () => {
    void Share.share({
      message: `${hadith.text}\n\n— ${hadith.source}`,
    });
  };

  const onCopy = async () => {
    await Clipboard.setStringAsync(`${hadith.text}\n\n— ${hadith.source}`);
    Alert.alert(t("quran.copied"));
  };

  return (
    <PreferenceScreenLayout
      title={t("screens.hadithFridayScreenTitle")}
      subtitle={t("home.hadithFridayLabel")}
    >
      <Text style={[styles.hadithText, { color: colors.text }, rtlTextStyle]}>
        {hadith.text}
      </Text>
      <Text style={[styles.source, { color: colors.textMuted }, rtlTextStyle]}>
        {hadith.source}
      </Text>

      <TouchableOpacity
        style={[styles.actionBtn, { borderColor: colors.border }]}
        onPress={onShare}
        activeOpacity={0.85}
      >
        <AppIcon name="share-2" size={20} color={colors.accent} />
        <Text style={[styles.actionLabel, { color: colors.text }]}>{t("quran.shareVerse")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionBtn, { borderColor: colors.border }]}
        onPress={() => void onCopy()}
        activeOpacity={0.85}
      >
        <AppIcon name="copy" size={20} color={colors.accent} />
        <Text style={[styles.actionLabel, { color: colors.text }]}>{t("quran.copyVerse")}</Text>
      </TouchableOpacity>
    </PreferenceScreenLayout>
  );
}

const styles = StyleSheet.create({
  hadithText: {
    fontSize: 17,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 26,
    marginBottom: 12,
  },
  source: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 20,
    marginBottom: 20,
  },
  empty: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 22,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
  actionLabel: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Medium",
  },
});
