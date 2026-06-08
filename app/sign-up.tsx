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

import { AuthGradientBackdrop } from "@/components/auth/AuthGradientBackdrop";
import { AuthHero } from "@/components/auth/AuthHero";
import { authSharedStyles } from "@/components/auth/auth-styles";
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
      <AuthGradientBackdrop />
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthHero
            headline={t("auth.signUpPageTitle")}
            subtitle={t("auth.signUpHint")}
            emblem="user"
          />

          <View
            style={[authSharedStyles.sectionDivider, { backgroundColor: colors.divider }]}
          />

          {!isSupabaseConfigured ? (
            <Text style={[styles.configWarning, { color: colors.danger }]}>
              {t("auth.errors.notConfigured")}
            </Text>
          ) : null}

          <AuthTextField
            label={t("auth.name")}
            icon="user"
            variant="flat"
            value={name}
            onChangeText={setName}
            placeholder={t("auth.namePlaceholder")}
            autoComplete="name"
            editable={!busy}
          />
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
          <AuthTextField
            label={t("auth.confirmPassword")}
            icon="lock"
            variant="flat"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            editable={!busy}
          />

          <TouchableOpacity
            style={[
              authSharedStyles.pillButton,
              styles.primaryBtn,
              { backgroundColor: colors.text },
            ]}
            onPress={handleSignUp}
            disabled={busy}
            activeOpacity={0.88}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={authSharedStyles.pillButtonText}>
                {t("auth.signUpSubmit")}
              </Text>
            )}
          </TouchableOpacity>

          <Pressable
            onPress={() => router.replace("/sign-in")}
            disabled={busy}
            style={authSharedStyles.textLink}
          >
            <Text
              style={[authSharedStyles.textLinkLabel, { color: colors.text }]}
            >
              {t("auth.signInLink")}
            </Text>
          </Pressable>
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
    paddingTop: 20,
    paddingBottom: 48,
  },
  configWarning: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
    marginBottom: 16,
    lineHeight: 20,
  },
  primaryBtn: {
    marginTop: 6,
  },
});
