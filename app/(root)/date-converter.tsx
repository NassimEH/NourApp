import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { toGregorian, toHijri } from "hijri-converter";

import { PreferenceScreenLayout } from "@/components/PreferenceScreenLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabi al-Awwal",
  "Rabi al-Thani",
  "Jumada al-Awwal",
  "Jumada al-Thani",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qi'dah",
  "Dhu al-Hijjah",
];

type Mode = "toHijri" | "toGregorian";

function parseIntField(value: string, fallback: number): number {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

export default function DateConverterScreen() {
  const colors = useAppTheme();
  const { t, rtlTextStyle } = useTranslation();
  const [mode, setMode] = useState<Mode>("toHijri");
  const [y, setY] = useState(String(new Date().getFullYear()));
  const [m, setM] = useState(String(new Date().getMonth() + 1));
  const [d, setD] = useState(String(new Date().getDate()));

  const result = useMemo(() => {
    try {
      const yi = parseIntField(y, 2026);
      const mi = parseIntField(m, 1);
      const di = parseIntField(d, 1);
      if (mode === "toHijri") {
        const { hy, hm, hd } = toHijri(yi, mi, di);
        return `${HIJRI_MONTHS[hm - 1]} ${hd}, ${hy} AH`;
      }
      const { gy, gm, gd } = toGregorian(yi, mi, di);
      const date = new Date(gy, gm - 1, gd);
      return date.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return t("tools.dateConverter.invalid");
    }
  }, [mode, y, m, d, t]);

  return (
    <PreferenceScreenLayout
      title={t("tools.dateConverter.title")}
      subtitle={t("tools.dateConverter.subtitle")}
    >
      <View style={styles.modeRow}>
        {(["toHijri", "toGregorian"] as const).map((mde) => (
          <Pressable
            key={mde}
            onPress={() => setMode(mde)}
            style={[
              styles.modeChip,
              {
                borderColor: colors.border,
                backgroundColor:
                  mode === mde ? colors.accent : colors.cardElevated,
              },
            ]}
          >
            <Text
              style={[
                styles.modeText,
                { color: mode === mde ? colors.onAccent : colors.text },
              ]}
            >
              {mde === "toHijri"
                ? t("tools.dateConverter.toHijri")
                : t("tools.dateConverter.toGregorian")}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.hint, { color: colors.textMuted }, rtlTextStyle]}>
        {mode === "toHijri"
          ? t("tools.dateConverter.gregorianInput")
          : t("tools.dateConverter.hijriInput")}
      </Text>

      <View style={styles.dateRow}>
        <DateField label={t("tools.dateConverter.year")} value={y} onChange={setY} colors={colors} />
        <DateField label={t("tools.dateConverter.month")} value={m} onChange={setM} colors={colors} />
        <DateField label={t("tools.dateConverter.day")} value={d} onChange={setD} colors={colors} />
      </View>

      <View
        style={[
          styles.result,
          { backgroundColor: colors.accentSurface, borderColor: colors.accentBorder },
        ]}
      >
        <Text style={[styles.resultLabel, { color: colors.textMuted }, rtlTextStyle]}>
          {t("tools.dateConverter.result")}
        </Text>
        <Text style={[styles.resultValue, { color: colors.text }, rtlTextStyle]}>
          {result}
        </Text>
      </View>
    </PreferenceScreenLayout>
  );
}

function DateField({
  label,
  value,
  onChange,
  colors,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  colors: ReturnType<typeof useAppTheme>;
}) {
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType="number-pad"
        style={[
          styles.input,
          {
            color: colors.text,
            borderColor: colors.border,
            backgroundColor: colors.cardElevated,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  modeChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  modeText: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-SemiBold",
    textAlign: "center",
  },
  hint: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  field: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-Medium",
    marginBottom: 6,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Regular",
    textAlign: "center",
  },
  result: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
  },
  resultLabel: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Medium",
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 17,
    fontFamily: "PlusJakartaSans-SemiBold",
    lineHeight: 24,
  },
});
