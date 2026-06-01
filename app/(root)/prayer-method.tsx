import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PreferenceScreenLayout } from "@/components/PreferenceScreenLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import {
  getPrayerCalculationMethod,
  setPrayerCalculationMethod,
  type PrayerCalculationMethod,
} from "@/lib/prayer-method-preference";
import { MIN_TOUCH_TARGET } from "@/lib/ui/spacing";

const OPTIONS: PrayerCalculationMethod[] = ["mwl", "uoif"];

export default function PrayerMethodScreen() {
  const colors = useAppTheme();
  const { t, rtlTextStyle } = useTranslation();
  const [selected, setSelected] = useState<PrayerCalculationMethod>("mwl");

  useEffect(() => {
    void getPrayerCalculationMethod().then(setSelected);
  }, []);

  const pick = useCallback((method: PrayerCalculationMethod) => {
    setSelected(method);
    void setPrayerCalculationMethod(method);
  }, []);

  return (
    <PreferenceScreenLayout
      title={t("preferences.prayerMethodTitle")}
      subtitle={t("preferences.prayerMethodSubtitle")}
    >
      {OPTIONS.map((method) => {
        const active = selected === method;
        return (
          <Pressable
            key={method}
            onPress={() => pick(method)}
            style={[
              styles.option,
              {
                borderColor: active ? colors.accent : colors.border,
                backgroundColor: active
                  ? colors.accentSurface
                  : colors.cardElevated,
                minHeight: MIN_TOUCH_TARGET,
              },
            ]}
          >
            <Text style={[styles.optionTitle, { color: colors.text }, rtlTextStyle]}>
              {t(`preferences.prayerMethod.${method}`)}
            </Text>
            <Text
              style={[styles.optionDesc, { color: colors.textMuted }, rtlTextStyle]}
            >
              {t(`preferences.prayerMethod.${method}Desc`)}
            </Text>
          </Pressable>
        );
      })}
      <Text style={[styles.hint, { color: colors.textMuted }, rtlTextStyle]}>
        {t("preferences.prayerMethodHint")}
      </Text>
    </PreferenceScreenLayout>
  );
}

const styles = StyleSheet.create({
  option: {
    padding: 16,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 12,
    justifyContent: "center",
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 18,
  },
  hint: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 18,
    marginTop: 8,
  },
});
