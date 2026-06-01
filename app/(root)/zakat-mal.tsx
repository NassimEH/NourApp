import { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { PreferenceScreenLayout } from "@/components/PreferenceScreenLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

const ZAKAT_RATE = 0.025;

function parseAmount(value: string): number {
  const normalized = value.replace(",", ".").trim();
  const n = parseFloat(normalized);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export default function ZakatMalScreen() {
  const colors = useAppTheme();
  const { t, rtlTextStyle } = useTranslation();
  const [assets, setAssets] = useState("");
  const [gold, setGold] = useState("");
  const [debts, setDebts] = useState("");

  const totalAssets = parseAmount(assets) + parseAmount(gold);
  const totalDebts = parseAmount(debts);
  const netWealth = Math.max(0, totalAssets - totalDebts);
  const zakatDue = useMemo(() => netWealth * ZAKAT_RATE, [netWealth]);

  const formattedZakat = useMemo(() => {
    if (netWealth <= 0) return "—";
    return zakatDue.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }, [netWealth, zakatDue]);

  return (
    <PreferenceScreenLayout
      title={t("tools.zakatMal.title")}
      subtitle={t("tools.zakatMal.subtitle")}
    >
      <Field
        label={t("tools.zakatMal.assets")}
        value={assets}
        onChangeText={setAssets}
        colors={colors}
        rtlTextStyle={rtlTextStyle}
      />
      <Field
        label={t("tools.zakatMal.gold")}
        value={gold}
        onChangeText={setGold}
        colors={colors}
        rtlTextStyle={rtlTextStyle}
      />
      <Field
        label={t("tools.zakatMal.debts")}
        value={debts}
        onChangeText={setDebts}
        colors={colors}
        rtlTextStyle={rtlTextStyle}
      />

      <View
        style={[
          styles.resultCard,
          {
            backgroundColor: colors.accentSurface,
            borderColor: colors.accentBorder,
          },
        ]}
      >
        <Text style={[styles.resultLabel, { color: colors.textMuted }, rtlTextStyle]}>
          {t("tools.zakatMal.netWealth")}
        </Text>
        <Text style={[styles.resultValue, { color: colors.text }]}>
          {netWealth.toLocaleString()}
        </Text>
        <Text style={[styles.resultLabel, { color: colors.textMuted }, rtlTextStyle]}>
          {t("tools.zakatMal.zakatDue")}
        </Text>
        <Text style={[styles.zakatAmount, { color: colors.accent }]}>
          {formattedZakat}
        </Text>
      </View>

      <Text style={[styles.disclaimer, { color: colors.textMuted }, rtlTextStyle]}>
        {t("tools.zakatMal.disclaimer")}
      </Text>
    </PreferenceScreenLayout>
  );
}

function Field({
  label,
  value,
  onChangeText,
  colors,
  rtlTextStyle,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  colors: ReturnType<typeof useAppTheme>;
  rtlTextStyle: object;
}) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.textMuted }, rtlTextStyle]}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        placeholder="0"
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          {
            color: colors.text,
            borderColor: colors.border,
            backgroundColor: colors.cardElevated,
          },
          rtlTextStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-SemiBold",
    marginBottom: 8,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Regular",
  },
  resultCard: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
    marginBottom: 16,
    gap: 6,
  },
  resultLabel: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Medium",
  },
  resultValue: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans-Bold",
    marginBottom: 12,
  },
  zakatAmount: {
    fontSize: 28,
    fontFamily: "PlusJakartaSans-Bold",
  },
  disclaimer: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 18,
  },
});
