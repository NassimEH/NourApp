import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";

import { AppIcon } from "@/components/AppIcon";
import { SignInDecorOrbs } from "@/components/sign-in/SignInDecorOrbs";
import { SignUpAuthPanel } from "@/components/sign-in/SignUpAuthPanel";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import type { AuthErrorKey } from "@/lib/auth-errors";
import {
  isValidEmail,
  isValidPassword,
  MIN_PASSWORD_LENGTH,
} from "@/lib/auth-validation";
import { registerWithEmail } from "@/lib/appwrite";
import { useAppTheme } from "@/lib/app-theme";
import { useGlobalContext } from "@/lib/global-provider";
import { useTranslation } from "@/lib/i18n";
import { useOnboardingGate } from "@/lib/onboarding-gate";

export default function SignUpScreen() {
  const colors = useAppTheme();
  const { t, rtlTextStyle, rtlViewStyle } = useTranslation();
  const { refetch, loading, isLogged } = useGlobalContext();
  const { hydrated, isComplete } = useOnboardingGate();
  const [submitting, setSubmitting] = useState(false);

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

  const handleSignUp = async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (submitting) return;

    const name = data.name.trim();
    const email = data.email.trim();
    const password = data.password;
    const confirm = data.confirmPassword;

    if (!name) {
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
        t("auth.validationPassword", { min: MIN_PASSWORD_LENGTH })
      );
      return;
    }
    if (password !== confirm) {
      Alert.alert(t("auth.validationTitle"), t("auth.validationPasswordMatch"));
      return;
    }

    setSubmitting(true);
    try {
      const result = await registerWithEmail({ name, email, password });
      if (result.ok) {
        refetch();
        router.replace("/");
      } else {
        showAuthError(t("auth.signUpErrorTitle"), result.errorKey);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right", "bottom"]}>
      <SignInDecorOrbs accent={colors.accent} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.topBar, rtlViewStyle]}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backBtn,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
              hitSlop={8}
            >
              <AppIcon name="chevron-left" size={22} color={colors.text} />
            </Pressable>
          </View>

          <View style={styles.header}>
            <Text style={[styles.pageTitle, rtlTextStyle, { color: colors.text }]}>
              {t("auth.signUpPageTitle")}
            </Text>
            <Text
              style={[styles.pageSubtitle, rtlTextStyle, { color: colors.textMuted }]}
            >
              {t("auth.signUpPageSubtitle")}
            </Text>
          </View>

          <SignUpAuthPanel
            panelTitle={t("auth.signUpPanelTitle")}
            hint={t("auth.signUpHint")}
            nameLabel={t("auth.name")}
            namePlaceholder={t("auth.namePlaceholder")}
            emailLabel={t("auth.email")}
            emailPlaceholder={t("auth.emailPlaceholder")}
            passwordLabel={t("auth.password")}
            confirmPasswordLabel={t("auth.confirmPassword")}
            submitLabel={t("auth.signUpSubmit")}
            hasAccountLabel={t("auth.hasAccount")}
            signInLinkLabel={t("auth.signInLink")}
            onSubmit={(data) => void handleSignUp(data)}
            loading={submitting}
            titleStyle={rtlTextStyle}
            hintStyle={rtlTextStyle}
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
    paddingBottom: 36,
  },
  topBar: {
    paddingTop: 8,
    marginBottom: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#191D31",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 32,
    fontFamily: "PlusJakartaSans-ExtraBold",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 22,
  },
});
