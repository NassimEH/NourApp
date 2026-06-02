import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AppIcon } from "@/components/AppIcon";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { ScreenBackground } from "@/components/ScreenBackground";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

export default function RechercheCoranScreen() {
  const [query, setQuery] = useState("");
  const { t, rtlTextStyle, rtlViewStyle } = useTranslation();
  const colors = useAppTheme();

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={t("screens.searchTitle")}
          subtitle={t("screens.searchSubtitle")}
          onBack={() => router.back()}
        />
        <ScrollView
          style={[styles.scroll, rtlViewStyle]}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.searchWrap}>
            <AppIcon name="search" size={20} color={colors.iconMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              value={query}
              onChangeText={setQuery}
              placeholder={t("screens.searchPlaceholder")}
              placeholderTextColor={colors.textMuted}
              returnKeyType="search"
            />
          </View>
          <Text style={[styles.hint, rtlTextStyle, { color: colors.textMuted }]}>
            {t("screens.searchHint")}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 28, paddingTop: 8, paddingBottom: 40 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.14)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Regular",
    paddingVertical: 0,
  },
  hint: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    marginTop: 12,
    lineHeight: 20,
  },
});
