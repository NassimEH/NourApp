import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";

import { PreferenceScreenLayout } from "@/components/PreferenceScreenLayout";
import { useAppPreferences } from "@/lib/app-preferences";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { useTranslation } from "@/lib/i18n";
import {
  deleteOfflineDownload,
  downloadSuraAudio,
  getOfflineRecitationsEnabled,
  listOfflineDownloads,
  setOfflineRecitationsEnabled,
  type OfflineDownload,
} from "@/lib/quran/offline-downloads";

const QUICK_SURAS = [1, 18, 36, 55, 67, 112];

export default function OfflineRecitationsScreen() {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const { t } = useTranslation();
  const { quranReciter } = useAppPreferences();
  const [enabled, setEnabled] = useState(false);
  const [downloads, setDownloads] = useState<OfflineDownload[]>([]);
  const [suraInput, setSuraInput] = useState("1");
  const [downloading, setDownloading] = useState(false);

  const refresh = useCallback(async () => {
    const [isEnabled, items] = await Promise.all([
      getOfflineRecitationsEnabled(),
      listOfflineDownloads(),
    ]);
    setEnabled(isEnabled);
    setDownloads(items);
  }, []);

  useFocusEffect(useCallback(() => void refresh(), [refresh]));

  const onToggle = async (value: boolean) => {
    setEnabled(value);
    await setOfflineRecitationsEnabled(value);
  };

  const onDownload = async () => {
    const suraNumber = Number(suraInput);
    if (!Number.isInteger(suraNumber) || suraNumber < 1 || suraNumber > 114) {
      Alert.alert(t("offline.manageTitle"), `${t("offline.suraLabel")} 1–114`);
      return;
    }
    setDownloading(true);
    try {
      await downloadSuraAudio(suraNumber, quranReciter);
      await refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      Alert.alert(
        t("offline.manageTitle"),
        message === "MAX_DOWNLOADS_3" ? t("offline.maxReached") : message
      );
    } finally {
      setDownloading(false);
    }
  };

  const onDelete = async (item: OfflineDownload) => {
    await deleteOfflineDownload(item.suraNumber, item.reciterId);
    await refresh();
  };

  return (
    <PreferenceScreenLayout
      title={t("offline.manageTitle")}
      subtitle={t("offline.subtitle")}
    >
      <View style={[styles.toggleRow, { borderColor: colors.border }]}>
        <View style={styles.flex}>
          <Text
            style={[
              styles.label,
              { color: colors.text, fontSize: typography.body },
            ]}
          >
            {t("offline.enableLabel")}
          </Text>
          <Text style={[styles.hint, { color: colors.textMuted }]}>
            {t("offline.enableHint")}
          </Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={(value) => void onToggle(value)}
          trackColor={{ false: colors.border, true: colors.accent }}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {t("offline.downloadsTitle")}
      </Text>
      {downloads.length === 0 ? (
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          {t("offline.empty")}
        </Text>
      ) : (
        downloads.map((item) => (
          <View
            key={`${item.reciterId}-${item.suraNumber}`}
            style={[styles.downloadRow, { borderColor: colors.border }]}
          >
            <Text style={[styles.downloadText, { color: colors.text }]}>
              {t("offline.suraLabel")} {item.suraNumber} · {item.reciterId}
            </Text>
            <Pressable onPress={() => void onDelete(item)} hitSlop={8}>
              <Text style={[styles.action, { color: colors.danger }]}>
                {t("offline.deleteAction")}
              </Text>
            </Pressable>
          </View>
        ))
      )}

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {t("offline.downloadAction")}
      </Text>
      <Text
        style={[
          styles.hint,
          {
            color: colors.textMuted,
            fontSize: typography.caption,
            marginBottom: 10,
          },
        ]}
      >
        {t("offline.quickPickHint")}
      </Text>
      <View style={styles.chips}>
        {QUICK_SURAS.map((number) => (
          <Pressable
            key={number}
            onPress={() => setSuraInput(String(number))}
            accessibilityRole="button"
            accessibilityLabel={`${t("offline.suraLabel")} ${number}`}
            accessibilityState={{ selected: suraInput === String(number) }}
            style={[
              styles.chip,
              {
                borderColor: colors.border,
                backgroundColor:
                  suraInput === String(number)
                    ? colors.accentSurface
                    : "transparent",
              },
            ]}
          >
            <Text style={{ color: colors.text }}>{number}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.downloadForm}>
        <TextInput
          value={suraInput}
          onChangeText={setSuraInput}
          keyboardType="number-pad"
          maxLength={3}
          accessibilityLabel={t("offline.customSuraLabel")}
          placeholder={t("offline.customSuraPlaceholder")}
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border },
          ]}
        />
        <Pressable
          disabled={downloading}
          onPress={() => void onDownload()}
          style={[
            styles.button,
            { backgroundColor: colors.accent },
            downloading && styles.disabled,
          ]}
        >
          {downloading ? (
            <ActivityIndicator color={colors.onAccent} />
          ) : (
            <Text style={[styles.buttonText, { color: colors.onAccent }]}>
              {t("offline.downloadAction")}
            </Text>
          )}
        </Pressable>
      </View>
      {downloading ? (
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          {t("offline.downloading")}
        </Text>
      ) : null}
    </PreferenceScreenLayout>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: { fontFamily: "PlusJakartaSans-Medium" },
  hint: {
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "PlusJakartaSans-Regular",
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 10,
    fontSize: 17,
    fontFamily: "PlusJakartaSans-Bold",
  },
  downloadRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  downloadText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium",
  },
  action: { fontSize: 13, fontFamily: "PlusJakartaSans-SemiBold" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  chip: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  downloadForm: { flexDirection: "row", gap: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 48,
  },
  button: {
    borderRadius: 12,
    minHeight: 48,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { fontFamily: "PlusJakartaSans-SemiBold" },
  disabled: { opacity: 0.65 },
});
