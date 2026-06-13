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

import { AuthFeatureList } from "@/components/auth/AuthFeatureList";
import { AuthHero } from "@/components/auth/AuthHero";
import { authSharedStyles, getAuthPrimaryButtonColors } from "@/components/auth/auth-styles";
import { AuthTextField } from "@/components/auth/AuthTextField";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { ScreenBackground } from "@/components/ScreenBackground";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { SPACE } from "@/lib/ui/spacing";
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
  const primaryButton = getAuthPrimaryButtonColors(colors);

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
          contentContainerStyle={[styles.scroll, authSharedStyles.scrollContent]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthHero headline={t("auth.intro")} subtitle={t("auth.tagline")} />

          <AuthFeatureList />

          <View
            style={[authSharedStyles.sectionDivider, { backgroundColor: colors.divider }]}
          />

          {!isSupabaseConfigured ? (
            <Text style={[styles.configWarning, { color: colors.danger }]}>
              {t("auth.errors.notConfigured")}
            </Text>
          ) : null}

          <View style={authSharedStyles.formBlock}>
            <AuthTextField
              label={t("auth.email")}
              icon="mail"
              variant="flat"
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
              variant="flat"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!busy}
            />
          </View>

          <TouchableOpacity
            style={[
              authSharedStyles.pillButton,
              { backgroundColor: primaryButton.backgroundColor },
            ]}
            onPress={handleSignIn}
            disabled={busy}
            activeOpacity={0.88}
          >
            {busy ? (
              <ActivityIndicator color={primaryButton.spinnerColor} />
            ) : (
              <Text
                style={[
                  authSharedStyles.pillButtonText,
                  { color: primaryButton.labelColor },
                ]}
              >
                {t("auth.signIn")}
              </Text>
            )}
          </TouchableOpacity>

          <View style={authSharedStyles.orDividerRow}>
            <View
              style={[
                authSharedStyles.orDividerLine,
                { backgroundColor: colors.divider },
              ]}
            />
            <Text
              style={[
                authSharedStyles.orDividerLabel,
                { color: colors.textMuted },
              ]}
            >
              {t("auth.orDivider")}
            </Text>
            <View
              style={[
                authSharedStyles.orDividerLine,
                { backgroundColor: colors.divider },
              ]}
            />
          </View>

          <GoogleSignInButton
            label={t("auth.loginGoogle")}
            onPress={handleGoogle}
            disabled={busy}
          />

          <View style={authSharedStyles.authFooter}>
            <Text
              style={[
                authSharedStyles.authFooterPrompt,
                { color: colors.textMuted },
              ]}
            >
              {t("auth.noAccount")}
            </Text>

            <TouchableOpacity
              style={[
                authSharedStyles.pillButton,
                authSharedStyles.pillButtonInverted,
                { borderColor: colors.text },
              ]}
              onPress={() => router.push("/sign-up")}
              disabled={busy}
              activeOpacity={0.88}
            >
              <Text
                style={[
                  authSharedStyles.pillButtonInvertedText,
                  { color: colors.text },
                ]}
              >
                {t("auth.signUpLink")}
              </Text>
            </TouchableOpacity>

            <Pressable
              onPress={() => {
                enterAsGuest();
                router.replace("/(root)/(tabs)/explore");
              }}
              disabled={busy}
              style={authSharedStyles.guestLink}
            >
              <Text
                style={[
                  authSharedStyles.guestLinkLabel,
                  { color: colors.textMuted },
                ]}
              >
                {t("auth.guest")}
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
  },
  configWarning: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
    marginBottom: SPACE.md,
    lineHeight: 20,
  },
});
