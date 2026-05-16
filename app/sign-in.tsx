import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";

import { SignInAuthPanel } from "@/components/sign-in/SignInAuthPanel";
import { SignInCompactHeader } from "@/components/sign-in/SignInCompactHeader";
import { SignInDecorOrbs } from "@/components/sign-in/SignInDecorOrbs";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import type { AuthErrorKey } from "@/lib/auth-errors";
import {
  isValidEmail,
  isValidPassword,
  MIN_PASSWORD_LENGTH,
} from "@/lib/auth-validation";
import { loginWithEmailPassword, loginWithGoogle } from "@/lib/appwrite";
import { useAppTheme } from "@/lib/app-theme";
import { useGlobalContext } from "@/lib/global-provider";
import { useTranslation } from "@/lib/i18n";
import { useOnboardingGate } from "@/lib/onboarding-gate";

export default function SignInScreen() {
  const colors = useAppTheme();
  const { t, rtlTextStyle } = useTranslation();
  const { refetch, loading, isLogged, enterAsGuest } = useGlobalContext();
  const { hydrated, isComplete } = useOnboardingGate();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  if (!loading && isLogged) return <Redirect href="/" />;

  if (!hydrated) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator size="large" color={colors.accent} style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (!isComplete) return <Redirect href="/onboarding" />;

  const showAuthError = (title: string, errorKey: AuthErrorKey) => {
    Alert.alert(title, t(`auth.errors.${errorKey}`));
  };

  const handleGoogleLogin = async () => {
    if (googleLoading || emailLoading) return;
    setGoogleLoading(true);
    try {
      const result = await loginWithGoogle();
      if (result.ok) {
        refetch();
      } else {
        showAuthError(t("auth.loginErrorTitle"), result.errorKey);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailLogin = async (email: string, password: string) => {
    if (googleLoading || emailLoading) return;

    const trimmedEmail = email.trim();
    if (!isValidEmail(trimmedEmail)) {
      Alert.alert(t("auth.validationTitle"), t("auth.validationEmail"));
      return;
    }
    if (!isValidPassword(password)) {
      Alert.alert(
        t("auth.validationTitle"),
        t("auth.validationPassword", { min: MIN_PASSWORD_LENGTH })
      );
      return;
    }

    setEmailLoading(true);
    try {
      const result = await loginWithEmailPassword(trimmedEmail, password);
      if (result.ok) {
        refetch();
      } else {
        showAuthError(t("auth.loginErrorTitle"), result.errorKey);
      }
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right", "bottom"]}>
      <SignInDecorOrbs accent={colors.accent} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <SignInCompactHeader
            brand={t("auth.brand")}
            tagline={t("auth.tagline")}
            brandStyle={rtlTextStyle}
            taglineStyle={rtlTextStyle}
          />

          <SignInAuthPanel
            sectionTitle={t("auth.panelTitle")}
            emailLabel={t("auth.email")}
            passwordLabel={t("auth.password")}
            emailPlaceholder={t("auth.emailPlaceholder")}
            signInLabel={t("auth.signIn")}
            googleLabel={t("auth.loginGoogle")}
            guestLabel={t("auth.guest")}
            orDivider={t("auth.orDivider")}
            noAccountLabel={t("auth.noAccount")}
            signUpLinkLabel={t("auth.signUpLink")}
            onEmailSignIn={(email, password) => void handleEmailLogin(email, password)}
            onGooglePress={() => void handleGoogleLogin()}
            onGuestPress={() => {
              enterAsGuest();
              router.replace("/");
            }}
            emailLoading={emailLoading}
            googleLoading={googleLoading}
            titleStyle={rtlTextStyle}
            textStyle={rtlTextStyle}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "transparent",
  },
  flex: { flex: 1 },
  loader: {
    flex: 1,
    alignSelf: "center",
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SCREEN_EDGE_PADDING,
    paddingTop: 4,
    paddingBottom: 32,
    justifyContent: "flex-start",
  },
});
