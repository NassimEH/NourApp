import { useCallback, useState } from "react";
import { Switch, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";

import { PreferenceScreenLayout } from "@/components/PreferenceScreenLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { useTranslation } from "@/lib/i18n";
import {
  getOfflineRecitationsEnabled,
  setOfflineRecitationsEnabled,
} from "@/lib/quran/offline-downloads";

export default function OfflineRecitationsScreen() {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void getOfflineRecitationsEnabled().then(setEnabled);
    }, [])
  );

  const onToggle = async (value: boolean) => {
    setEnabled(value);
    await setOfflineRecitationsEnabled(value);
  };

  return (
    <PreferenceScreenLayout
      title={t("offline.title")}
      subtitle={t("offline.subtitle")}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          paddingVertical: 8,
        }}
      >
        <Text
          style={{
            flex: 1,
            color: colors.text,
            fontSize: typography.body,
            fontFamily: "PlusJakartaSans-Medium",
          }}
        >
          {t("offline.enableLabel")}
        </Text>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.accent }}
        />
      </View>
      <Text
        style={{
          color: colors.textMuted,
          fontSize: typography.body,
          fontFamily: "PlusJakartaSans-Regular",
          lineHeight: 22,
          marginTop: 16,
        }}
      >
        {t("offline.comingSoon")}
      </Text>
    </PreferenceScreenLayout>
  );
}
