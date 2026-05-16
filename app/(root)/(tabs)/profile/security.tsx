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
import { AppIcon } from "@/components/AppIcon";

import { updateUserPassword } from "@/lib/appwrite";
import { useAppTheme } from "@/lib/app-theme";
import { ScreenBackground } from "@/components/ScreenBackground";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { useTranslation } from "@/lib/i18n";

const MIN_PASSWORD_LENGTH = 8;

export default function SecurityScreen() {
  const colors = useAppTheme();
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    const current = currentPassword.trim();
    const newP = newPassword.trim();
    const confirm = confirmPassword.trim();

    if (!current) {
      Alert.alert("Champ requis", "Veuillez saisir votre mot de passe actuel.");
      return;
    }
    if (!newP) {
      Alert.alert("Champ requis", "Veuillez saisir le nouveau mot de passe.");
      return;
    }
    if (newP.length < MIN_PASSWORD_LENGTH) {
      Alert.alert(
        "Mot de passe trop court",
        `Le nouveau mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`
      );
      return;
    }
    if (newP !== confirm) {
      Alert.alert("Erreur", "Le nouveau mot de passe et la confirmation ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const ok = await updateUserPassword(newP, current);
      if (ok) {
        Alert.alert("Mot de passe modifié", "Votre mot de passe a été mis à jour.", [
          { text: "OK", onPress: () => router.back() },
        ]);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        Alert.alert(
          "Erreur",
          "Impossible de modifier le mot de passe. Vérifiez votre mot de passe actuel."
        );
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
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.sectionLabel, { color: colors.text }]}>
            Changer le mot de passe
          </Text>
          <Text style={[styles.hint, { color: colors.textMuted }]}>
            Saisissez votre mot de passe actuel puis le nouveau (min. {MIN_PASSWORD_LENGTH} caractères).
          </Text>

          <Text style={[styles.inputLabel, { color: colors.text }]}>
            Mot de passe actuel
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
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <Text style={[styles.inputLabel, { color: colors.text }]}>
            Nouveau mot de passe
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
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <Text style={[styles.inputLabel, { color: colors.text }]}>
            Confirmer le nouveau mot de passe
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
            autoCapitalize="none"
            autoCorrect={false}
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
              <Text style={styles.submitLabel}>Changer le mot de passe</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
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
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 17,
    fontFamily: "PlusJakartaSans-SemiBold",
    marginBottom: 6,
  },
  hint: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    marginBottom: 20,
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
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitLabel: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#fff",
  },
});
