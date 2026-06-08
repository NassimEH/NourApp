import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { router } from "expo-router";

import { PreferenceScreenLayout } from "@/components/PreferenceScreenLayout";
import { useAppTheme } from "@/lib/app-theme";
import { getMosqueName, setMosqueName } from "@/lib/home/mosque-preference";
import { useTranslation } from "@/lib/i18n";

export default function MosqueSettingsScreen() {
  const colors = useAppTheme();
  const { t, rtlTextStyle } = useTranslation();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMosqueName().then((saved) => {
      setName(saved ?? "");
      setLoading(false);
    });
  }, []);

  const save = async () => {
    await setMosqueName(name);
    router.back();
  };

  const reset = async () => {
    await setMosqueName("");
    router.back();
  };

  return (
    <PreferenceScreenLayout
      title={t("home.mosqueSettingsTitle")}
      subtitle={t("home.mosqueSettingsSubtitle")}
    >
      <Text style={[styles.label, { color: colors.textMuted }, rtlTextStyle]}>
        {t("home.mosqueNameLabel")}
      </Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder={t("home.defaultMosqueName")}
        placeholderTextColor={colors.textMuted}
        editable={!loading}
        style={[
          styles.input,
          {
            color: colors.text,
            borderColor: colors.border,
            backgroundColor: colors.backgroundSecondary,
          },
        ]}
      />
      <Pressable
        onPress={save}
        style={({ pressed }) => [
          styles.btn,
          { backgroundColor: colors.accent },
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.btnText, { color: colors.onAccent }]}>
          {t("common.save")}
        </Text>
      </Pressable>
      <Pressable onPress={reset} style={styles.resetBtn}>
        <Text style={[styles.resetText, { color: colors.textMuted }]}>
          {t("home.mosqueReset")}
        </Text>
      </Pressable>
    </PreferenceScreenLayout>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-SemiBold",
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Medium",
    padding: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 20,
  },
  btn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  pressed: { opacity: 0.9 },
  resetBtn: { marginTop: 16, alignItems: "center" },
  resetText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium",
  },
});
