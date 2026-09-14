import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { useGlobalContext } from "@/lib/global-provider";
import { useTranslation } from "@/lib/i18n";
import { bodyLineHeight } from "@/lib/ui/typography";
import { deleteOwnAccount, updateUserPassword } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { resolveAuthErrorKey } from "@/lib/auth-errors";
import { ScreenBackground } from "@/components/ScreenBackground";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";

const MIN_PASSWORD_LENGTH = 8;

export default function SecurityScreen() {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const { t } = useTranslation();
  const { isLogged } = useGlobalContext();
  const lh = bodyLineHeight(typography.body);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      t("profile.deleteAccountTitle"),
      t("profile.deleteAccountConfirm"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("profile.deleteAccountAction"),
          style: "destructive",
          onPress: () => {
            setDeleting(true);
            void deleteOwnAccount()
              .then(() => router.replace("/sign-in"))
              .catch(() =>
                Alert.alert(
                  t("profile.deleteAccountTitle"),
                  t("auth.errors.deleteFailed")
                )
              )
              .finally(() => setDeleting(false));
          },
        },
      ]
    );
  };

  const handleChangePassword = async () => {
    const current = currentPassword.trim();
    const newP = newPassword.trim();
    const confirm = confirmPassword.trim();

    if (!current) {
      Alert.alert(
        t("auth.validationTitle"),
        t("profile.securityCurrentPasswordRequired")
      );
      return;
    }
    if (!newP) {
      Alert.alert(
        t("auth.validationTitle"),
        t("auth.validationPassword", { min: MIN_PASSWORD_LENGTH })
      );
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
      await updateUserPassword(current, newP);
      Alert.alert(t("profile.passwordChangedTitle"), t("profile.passwordChangedBody"), [
        { text: "OK", onPress: () => router.back() },
      ]);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
                } catch (e) {
      const key = resolveAuthErrorKey(e);
      Alert.alert(
        t("profile.logoutError"),
        t(`auth.errors.${key}`) || t("profile.passwordChangeFailed")
      );
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
                {t("profile.currentPassword")}
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
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                textContentType="password"
                autoComplete="password"
                editable={!loading}
              />

              <Text style={[styles.inputLabel, { color: colors.text }]}>
                {t("profile.newPassword")}
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
                textContentType="newPassword"
                autoComplete="password-new"
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
                textContentType="newPassword"
                autoComplete="password-new"
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
                  <ActivityIndicator size="small" color={colors.onAccent} />
                ) : (
                  <Text style={[styles.submitLabel, { color: colors.onAccent }]}>
                    {t("profile.changePassword")}
                  </Text>
                )}
              </TouchableOpacity>

              <Text style={[styles.dangerTitle, { color: colors.danger }]}>
                {t("profile.deleteAccountTitle")}
              </Text>
              <Text
                style={[
                  styles.paragraph,
                  { color: colors.textMuted, fontSize: typography.body, lineHeight: lh },
                ]}
              >
                {t("profile.deleteAccountHint")}
              </Text>
              <TouchableOpacity
                style={[styles.dangerButton, { borderColor: colors.danger }]}
                onPress={handleDeleteAccount}
                disabled={loading || deleting}
                activeOpacity={0.8}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color={colors.danger} />
                ) : (
                  <Text style={[styles.submitLabel, { color: colors.danger }]}>
                    {t("profile.deleteAccountAction")}
                  </Text>
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
  dangerTitle: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-Bold",
    marginTop: 36,
    marginBottom: 8,
  },
  dangerButton: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  submitLabel: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
});
