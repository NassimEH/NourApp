import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";

import { AuthTextField } from "@/components/auth/AuthTextField";
import { ScreenBackground } from "@/components/ScreenBackground";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { resolveAuthErrorKey } from "@/lib/auth-errors";
import {
  isValidEmail,
  isValidPassword,
  passwordsMatch,
} from "@/lib/auth-validation";
import { useAppTheme } from "@/lib/app-theme";
import { useGlobalContext } from "@/lib/global-provider";
import { useTranslation } from "@/lib/i18n";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { registerWithEmail } from "@/lib/supabase/auth";

export default function SignUpScreen() {
  const colors = useAppTheme();
  const { t } = useTranslation();
  const { refetch, loading, isLogged } = useGlobalContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && isLogged) return <Redirect href="/" />;

  const handleSignUp = async () => {
    if (!name.trim()) {
      Alert.alert(t("auth.validationTitle"), t("auth.validationName"));
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert(t("auth.validationTitle"), t("auth.validationEmail"));
      return;
    }
    if (!isValidPassword(password)) {
      Alert.alert(
        t("auth.validationTitle"),
        t("auth.validationPassword", { min: 8 })
      );
      return;
    }
    if (!passwordsMatch(password, confirm)) {
      Alert.alert(t("auth.validationTitle"), t("auth.validationPasswordMatch"));
      return;
    }

    setBusy(true);
    try {
      await registerWithEmail(email, password, name);
      await refetch();
      router.replace("/(root)/(tabs)" as const);
    } catch (e) {
      const key = resolveAuthErrorKey(e);
      Alert.alert(
        t("auth.signUpErrorTitle"),
        t(`auth.errors.${key}` as "auth.errors.unknown")
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            {t("auth.signUpPageTitle")}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {t("auth.signUpPageSubtitle")}
          </Text>
          <Text style={[styles.hint, { color: colors.textMuted }]}>
            {t("auth.signUpHint")}
          </Text>

          {!isSupabaseConfigured ? (
            <Text style={[styles.configWarning, { color: colors.danger }]}>
              {t("auth.errors.notConfigured")}
            </Text>
          ) : null}

          <AuthTextField
            label={t("auth.name")}
            icon="user"
            value={name}
            onChangeText={setName}
            placeholder={t("auth.namePlaceholder")}
            autoComplete="name"
            editable={!busy}
          />
          <AuthTextField
            label={t("auth.email")}
            icon="mail"
            value={email}
            onChangeText={setEmail}
            placeholder={t("auth.emailPlaceholder")}
            keyboardType="email-address"
            autoComplete="email"
            editable={!busy}
          />
          <AuthTextField
            label={t("auth.password")}
            icon="lock"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!busy}
          />
          <AuthTextField
            label={t("auth.confirmPassword")}
            icon="lock"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            editable={!busy}
          />

          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.accent }]}
            onPress={handleSignUp}
            disabled={busy}
            activeOpacity={0.85}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>{t("auth.signUpSubmit")}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={{ color: colors.textMuted }}>{t("auth.hasAccount")} </Text>
            <Pressable onPress={() => router.replace("/sign-in")} disabled={busy}>
              <Text style={{ color: colors.accent, fontFamily: "PlusJakartaSans-SemiBold" }}>
                {t("auth.signInLink")}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  scroll: {
    paddingHorizontal: SCREEN_EDGE_PADDING,
    paddingTop: 32,
    paddingBottom: 48,
  },
  title: {
    fontSize: 26,
    fontFamily: "PlusJakartaSans-Bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    marginBottom: 12,
  },
  hint: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 22,
    marginBottom: 24,
  },
  configWarning: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
    marginBottom: 16,
    lineHeight: 20,
  },
  primaryBtn: {
    borderRadius: 14,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
    flexWrap: "wrap",
  },
});
