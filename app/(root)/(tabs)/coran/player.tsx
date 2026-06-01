import { useState } from "react";
import {
  Modal,
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
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

export default function PlayerScreen() {
  const [recitateurSheetVisible, setRecitateurSheetVisible] = useState(false);
  const colors = useAppTheme();
  const { t } = useTranslation();

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={t("screens.playerTitle")}
          subtitle={t("screens.playerSubtitle")}
          onBack={() => router.back()}
        />

        <View style={styles.playerArea}>
          <View style={styles.verseCard}>
            <Text style={[styles.verseRef, { color: colors.textMuted }]}>
              Al-Fatiha, 1
            </Text>
            <Text style={[styles.verseText, { color: colors.text }]}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </Text>
            <Text style={[styles.verseTranslation, { color: colors.textMuted }]}>
              {"Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux."}
            </Text>
          </View>
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlBtn} activeOpacity={0.8}>
              <AppIcon name="skip-back" size={28} color={colors.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.playBtn, { backgroundColor: colors.accent }]}
              activeOpacity={0.8}
            >
              <AppIcon name="play" size={36} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlBtn} activeOpacity={0.8}>
              <AppIcon name="skip-forward" size={28} color={colors.icon} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.recitateurCta, { borderColor: colors.border }]}
            onPress={() => setRecitateurSheetVisible(true)}
            activeOpacity={0.8}
          >
            <AppIcon name="mic" size={20} color={colors.icon} />
            <Text style={[styles.recitateurCtaLabel, { color: colors.text }]}>
              Changer de récitateur
            </Text>
            <AppIcon name="chevron-up" size={20} color={colors.icon} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Modal
        visible={recitateurSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRecitateurSheetVisible(false)}
      >
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={() => setRecitateurSheetVisible(false)}
        >
          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            <View style={styles.sheetHandle} />
            <Text style={[styles.sheetTitle, { color: colors.text }]}>
              Choisir un récitateur
            </Text>
            <Text style={[styles.sheetHint, { color: colors.textMuted }]}>
              Liste des récitateurs disponibles. Le bottom sheet sera enrichi avec la liste complète.
            </Text>
            <TouchableOpacity
              style={styles.sheetClose}
              onPress={() => setRecitateurSheetVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={[styles.sheetCloseText, { color: colors.accent }]}>
                Fermer
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  playerArea: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 8,
    paddingBottom: 120,
    justifyContent: "center",
  },
  verseCard: {
    paddingVertical: 24,
    gap: 16,
  },
  verseRef: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium",
  },
  verseText: {
    fontSize: 28,
    fontFamily: "PlusJakartaSans-Regular",
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 44,
  },
  verseTranslation: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 24,
    fontStyle: "italic",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
    marginTop: 32,
  },
  controlBtn: { padding: 8 },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  recitateurCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 40,
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 14,
  },
  recitateurCtaLabel: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Medium",
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.15)",
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    marginBottom: 8,
  },
  sheetHint: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 22,
    marginBottom: 20,
  },
  sheetClose: { alignSelf: "center", paddingVertical: 12 },
  sheetCloseText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
});
