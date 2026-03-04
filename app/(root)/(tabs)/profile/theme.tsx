import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

import { useAppPreferences, THEME_LABELS, type ThemeMode } from "@/lib/app-preferences";
import { PreferenceOptionRow } from "@/components/PreferenceOptionRow";

const ICON_COLOR = "#191D31";

const homeBackground = require("@/assets/images/home-background.png");

const OPTIONS: ThemeMode[] = ["light", "dark", "system"];

export default function ThemeScreen() {
  const { theme, setTheme } = useAppPreferences();

  return (
    <ImageBackground source={homeBackground} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <Text style={styles.title}>Thème</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
            <Feather name="chevron-left" size={28} color={ICON_COLOR} />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {OPTIONS.map((opt, index) => (
            <View key={opt} style={[styles.optionWrap, index < OPTIONS.length - 1 && styles.optionBorder]}>
              <PreferenceOptionRow
                label={THEME_LABELS[opt]}
                selected={theme === opt}
                onPress={() => setTheme(opt)}
              />
            </View>
          ))}
        </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: { paddingVertical: 8, paddingLeft: 8 },
  title: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#191D31",
  },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 28, paddingTop: 24, paddingBottom: 40 },
  optionWrap: {},
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
});
