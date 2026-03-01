import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

import { updateUserPassword } from "@/lib/appwrite";

const ICON_COLOR = "#191D31";
const homeBackground = require("@/assets/images/home-background.png");

const MIN_PASSWORD_LENGTH = 8;

export default function SecurityScreen() {
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
    <ImageBackground source={homeBackground} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <Text style={styles.title}>Sécurité</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
            <Feather name="chevron-left" size={28} color={ICON_COLOR} />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionLabel}>Changer le mot de passe</Text>
          <Text style={styles.hint}>
            Saisissez votre mot de passe actuel puis le nouveau (min. {MIN_PASSWORD_LENGTH} caractères).
          </Text>

          <Text style={styles.inputLabel}>Mot de passe actuel</Text>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="••••••••"
            placeholderTextColor="rgba(0,0,0,0.4)"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <Text style={styles.inputLabel}>Nouveau mot de passe</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="••••••••"
            placeholderTextColor="rgba(0,0,0,0.4)"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <Text style={styles.inputLabel}>Confirmer le nouveau mot de passe</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••"
            placeholderTextColor="rgba(0,0,0,0.4)"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
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
    </ImageBackground>
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
    color: ICON_COLOR,
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
    color: ICON_COLOR,
    marginBottom: 6,
  },
  hint: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: "rgba(0,0,0,0.6)",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium",
    color: ICON_COLOR,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.14)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Regular",
    color: ICON_COLOR,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  submitButton: {
    backgroundColor: "#3d6b47",
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
