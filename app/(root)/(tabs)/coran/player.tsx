import { useState } from "react";
import {
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

const homeBackground = require("@/assets/images/home-background.png");
const ICON_COLOR = "#191D31";

export default function PlayerScreen() {
  const [recitateurSheetVisible, setRecitateurSheetVisible] = useState(false);

  return (
    <ImageBackground source={homeBackground} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <Text style={styles.title}>Lecture immersive</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
            <Feather name="chevron-left" size={28} color={ICON_COLOR} />
          </TouchableOpacity>
        </View>

        <View style={styles.playerArea}>
          <View style={styles.verseCard}>
            <Text style={styles.verseRef}>Al-Fatiha, 1</Text>
            <Text style={styles.verseText}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </Text>
            <Text style={styles.verseTranslation}>
              Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.
            </Text>
          </View>
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlBtn} activeOpacity={0.8}>
              <Feather name="skip-back" size={28} color={ICON_COLOR} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.playBtn} activeOpacity={0.8}>
              <Feather name="play" size={36} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlBtn} activeOpacity={0.8}>
              <Feather name="skip-forward" size={28} color={ICON_COLOR} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.recitateurCta}
            onPress={() => setRecitateurSheetVisible(true)}
            activeOpacity={0.8}
          >
            <Feather name="mic" size={20} color={ICON_COLOR} />
            <Text style={styles.recitateurCtaLabel}>Changer de récitateur</Text>
            <Feather name="chevron-up" size={20} color={ICON_COLOR} />
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
            <Text style={styles.sheetTitle}>Choisir un récitateur</Text>
            <Text style={styles.sheetHint}>
              Liste des récitateurs disponibles. Le bottom sheet sera enrichi avec la liste complète.
            </Text>
            <TouchableOpacity
              style={styles.sheetClose}
              onPress={() => setRecitateurSheetVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.sheetCloseLabel}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: { paddingVertical: 8, paddingLeft: 8 },
  title: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    color: ICON_COLOR,
  },
  playerArea: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  verseCard: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    width: "100%",
  },
  verseRef: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#3d6b47",
    marginBottom: 12,
  },
  verseText: {
    fontSize: 24,
    fontFamily: "PlusJakartaSans-Medium",
    color: ICON_COLOR,
    textAlign: "center",
    marginBottom: 12,
  },
  verseTranslation: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    color: "rgba(0,0,0,0.7)",
    textAlign: "center",
    fontStyle: "italic",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    marginBottom: 24,
  },
  controlBtn: {
    padding: 12,
  },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#3d6b47",
    alignItems: "center",
    justifyContent: "center",
  },
  recitateurCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  recitateurCtaLabel: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Medium",
    color: ICON_COLOR,
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
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 40,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-Bold",
    color: ICON_COLOR,
    marginBottom: 8,
  },
  sheetHint: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: "rgba(0,0,0,0.6)",
    marginBottom: 24,
    lineHeight: 20,
  },
  sheetClose: {
    backgroundColor: "#3d6b47",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  sheetCloseLabel: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#fff",
  },
});
