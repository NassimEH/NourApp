import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { useGlobalContext } from "@/lib/global-provider";
import { useTranslation } from "@/lib/i18n";
import { bodyLineHeight } from "@/lib/ui/typography";
import { updateUserPassword } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { ScreenBackground } from "@/components/ScreenBackground";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";

const MIN_PASSWORD_LENGTH = 8;

export default function SecurityScreen() {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const { t } = useTranslation();
  const { isLogged } = useGlobalContext();
  const lh = bodyLineHeight(typography.body);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    const newP = newPassword.trim();
    const confirm = confirmPassword.trim();

    if (!newP) {
      Alert.alert(t("auth.validationTitle"), t("auth.validationPassword", { min: MIN_PASSWORD_LENGTH }));
      return;
    }
    if (newP.length < MIN_PASSWORD_LENGTH) {
      Alert.alert(
        t("auth.validationTitle"),
        t("auth.validationPassword", { min: MIN_PASSWORD_LENGTH })
      );
      return;
    }
    if (newP !== confirm) {
      Alert.alert(t("auth.validationTitle"), t("auth.validationPasswordMatch"));
      return;
    }

    setLoading(true);
    try {
      const ok = await updateUserPassword(newP);
      if (ok) {
        Alert.alert(t("profile.passwordChangedTitle"), t("profile.passwordChangedBody"), [
          { text: "OK", onPress: () => router.back() },
        ]);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        Alert.alert(t("profile.logoutError"), t("profile.passwordChangeFailed"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={t("screens.securityTitle")}
          subtitle={t("screens.securitySubtitle")}
          onBack={() => router.back()}
        />
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {!isSupabaseConfigured ? (
            <Text
              style={[
                styles.paragraph,
                { color: colors.danger, fontSize: typography.body, lineHeight: lh },
              ]}
            >
              {t("auth.errors.notConfigured")}
            </Text>
          ) : !isLogged ? (
            <Text
              style={[
                styles.paragraph,
                { color: colors.textMuted, fontSize: typography.body, lineHeight: lh },
              ]}
            >
              {t("profile.securitySignInRequired")}
            </Text>
          ) : (
            <>
              <Text
                style={[
                  styles.paragraph,
                  { color: colors.textMuted, fontSize: typography.body, lineHeight: lh },
                ]}
              >
                {t("profile.securityPasswordHint")}
              </Text>

              <Text style={[styles.inputLabel, { color: colors.text }]}>
                {t("auth.password")}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                  },
                ]}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                editable={!loading}
              />

              <Text style={[styles.inputLabel, { color: colors.text }]}>
                {t("auth.confirmPassword")}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                  },
                ]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                editable={!loading}
              />

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { backgroundColor: colors.accent },
                  loading && styles.submitButtonDisabled,
                ]}
                onPress={handleChangePassword}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitLabel}>{t("profile.changePassword")}</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  content: {
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 40,
  },
  paragraph: {
    fontFamily: "PlusJakartaSans-Regular",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Regular",
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
    minHeight: 52,
  },
  submitButtonDisabled: { opacity: 0.7 },
  submitLabel: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#fff",
  },
});
