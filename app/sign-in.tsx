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
import { resolveAuthErrorKey, type AuthErrorKey } from "@/lib/auth-errors";
import { isValidEmail, isValidPassword } from "@/lib/auth-validation";
import { useAppTheme } from "@/lib/app-theme";
import { useGlobalContext } from "@/lib/global-provider";
import { useTranslation } from "@/lib/i18n";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  loginWithEmailPassword,
  loginWithGoogle,
} from "@/lib/supabase/auth";

export default function SignInScreen() {
  const colors = useAppTheme();
  const { t } = useTranslation();
  const { refetch, loading, isLogged, isGuest, enterAsGuest } = useGlobalContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && isLogged) return <Redirect href="/" />;
  if (!loading && isGuest) return <Redirect href="/(root)/(tabs)/explore" />;

  const showAuthError = (key: AuthErrorKey) => {
    Alert.alert(
      t("auth.loginErrorTitle"),
      t(`auth.errors.${key}` as "auth.errors.unknown")
    );
  };

  const handleSignIn = async () => {
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
    setBusy(true);
    try {
      await loginWithEmailPassword(email, password);
      await refetch();
      router.replace("/(root)/(tabs)" as const);
    } catch (e) {
      showAuthError(resolveAuthErrorKey(e));
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    try {
      const user = await loginWithGoogle();
      if (user) {
        await refetch();
        router.replace("/(root)/(tabs)" as const);
      }
    } catch (e) {
      showAuthError(resolveAuthErrorKey(e));
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
          <Text style={[styles.brand, { color: colors.text }]}>
            {t("auth.brand")}
          </Text>
          <Text style={[styles.tagline, { color: colors.textMuted }]}>
            {t("auth.tagline")}
          </Text>
          <Text style={[styles.hint, { color: colors.textMuted }]}>
            {t("auth.loginPrompt")}
          </Text>

          {!isSupabaseConfigured ? (
            <Text style={[styles.configWarning, { color: colors.danger }]}>
              {t("auth.errors.notConfigured")}
            </Text>
          ) : null}

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

          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.accent }]}
            onPress={handleSignIn}
            disabled={busy}
            activeOpacity={0.85}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>{t("auth.signIn")}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textMuted }]}>
              {t("auth.orDivider")}
            </Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>

          <TouchableOpacity
            style={[styles.secondaryBtn, { borderColor: colors.border }]}
            onPress={handleGoogle}
            disabled={busy}
            activeOpacity={0.85}
          >
            <Text style={[styles.secondaryBtnText, { color: colors.text }]}>
              {t("auth.loginGoogle")}
            </Text>
          </TouchableOpacity>

          <Pressable
            onPress={() => {
              enterAsGuest();
              router.replace("/(root)/(tabs)/explore");
            }}
            disabled={busy}
            style={styles.guestLink}
          >
            <Text style={[styles.guestText, { color: colors.accent }]}>
              {t("auth.guest")}
            </Text>
          </Pressable>

          <View style={styles.footerRow}>
            <Text style={{ color: colors.textMuted }}>{t("auth.noAccount")} </Text>
            <Pressable onPress={() => router.push("/sign-up")} disabled={busy}>
              <Text style={{ color: colors.accent, fontFamily: "PlusJakartaSans-SemiBold" }}>
                {t("auth.signUpLink")}
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
  brand: {
    fontSize: 32,
    fontFamily: "PlusJakartaSans-Bold",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Regular",
    marginBottom: 20,
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
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 20,
  },
  divider: { flex: 1, height: StyleSheet.hairlineWidth },
  dividerText: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
  },
  secondaryBtn: {
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  guestLink: {
    alignSelf: "center",
    marginTop: 24,
    paddingVertical: 8,
  },
  guestText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
    flexWrap: "wrap",
  },
});
