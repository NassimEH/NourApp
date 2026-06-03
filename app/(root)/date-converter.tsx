import { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { toGregorian, toHijri } from "hijri-converter";

import { ToolScreenLayout } from "@/components/ToolScreenLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { createToolScreenStyles } from "@/lib/tool-screen-styles";

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
  const styles = useMemo(() => createToolScreenStyles(colors), [colors]);
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
    <ToolScreenLayout
      title={t("tools.dateConverter.title")}
      subtitle={t("tools.dateConverter.subtitle")}
    >
      <View style={styles.segmentRow}>
        {(["toHijri", "toGregorian"] as const).map((mde) => {
          const active = mode === mde;
          return (
            <Pressable
              key={mde}
              onPress={() => setMode(mde)}
              style={[styles.segment, active && styles.chipActive]}
            >
              <Text
                style={[styles.chipText, active && styles.chipTextActive]}
              >
                {mde === "toHijri"
                  ? t("tools.dateConverter.toHijri")
                  : t("tools.dateConverter.toGregorian")}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.note, rtlTextStyle, { marginBottom: 16 }]}>
        {mode === "toHijri"
          ? t("tools.dateConverter.gregorianInput")
          : t("tools.dateConverter.hijriInput")}
      </Text>

      <View style={[styles.segmentRow, { marginBottom: 20 }]}>
        <DateField
          label={t("tools.dateConverter.year")}
          value={y}
          onChange={setY}
          styles={styles}
          colors={colors}
        />
        <DateField
          label={t("tools.dateConverter.month")}
          value={m}
          onChange={setM}
          styles={styles}
          colors={colors}
        />
        <DateField
          label={t("tools.dateConverter.day")}
          value={d}
          onChange={setD}
          styles={styles}
          colors={colors}
        />
      </View>

      <View style={styles.highlight}>
        <Text style={[styles.highlightLabel, rtlTextStyle]}>
          {t("tools.dateConverter.result")}
        </Text>
        <Text style={[styles.highlightValueText, rtlTextStyle]}>{result}</Text>
      </View>
    </ToolScreenLayout>
  );
}

function DateField({
  label,
  value,
  onChange,
  styles,
  colors,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  styles: ReturnType<typeof createToolScreenStyles>;
  colors: ReturnType<typeof useAppTheme>;
}) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={[styles.fieldLabel, { marginBottom: 6 }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType="number-pad"
        style={[
          styles.input,
          styles.inputMuted,
          { textAlign: "center", fontSize: 16 },
        ]}
        placeholderTextColor={colors.textMuted}
      />
    </View>
  );
}
