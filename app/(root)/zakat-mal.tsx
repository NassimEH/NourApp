import { useMemo, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { ToolScreenLayout } from "@/components/ToolScreenLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { createToolScreenStyles } from "@/lib/tool-screen-styles";

const ZAKAT_RATE = 0.025;

function parseAmount(value: string): number {
  const normalized = value.replace(",", ".").trim();
  const n = parseFloat(normalized);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export default function ZakatMalScreen() {
  const colors = useAppTheme();
  const styles = useMemo(() => createToolScreenStyles(colors), [colors]);
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
    <ToolScreenLayout
      title={t("tools.zakatMal.title")}
      subtitle={t("tools.zakatMal.subtitle")}
    >
      <Field
        label={t("tools.zakatMal.assets")}
        value={assets}
        onChangeText={setAssets}
        styles={styles}
        rtlTextStyle={rtlTextStyle}
        colors={colors}
      />
      <Field
        label={t("tools.zakatMal.gold")}
        value={gold}
        onChangeText={setGold}
        styles={styles}
        rtlTextStyle={rtlTextStyle}
        colors={colors}
      />
      <Field
        label={t("tools.zakatMal.debts")}
        value={debts}
        onChangeText={setDebts}
        styles={styles}
        rtlTextStyle={rtlTextStyle}
        colors={colors}
      />

      <View style={styles.highlight}>
        <Text style={[styles.highlightLabel, rtlTextStyle]}>
          {t("tools.zakatMal.netWealth")}
        </Text>
        <Text style={[styles.highlightValue, { color: colors.text, fontSize: 26 }]}>
          {netWealth.toLocaleString()}
        </Text>
        <Text style={[styles.highlightLabel, rtlTextStyle, { marginTop: 12 }]}>
          {t("tools.zakatMal.zakatDue")}
        </Text>
        <Text style={styles.highlightValue}>{formattedZakat}</Text>
      </View>

      <Text style={[styles.note, rtlTextStyle]}>
        {t("tools.zakatMal.disclaimer")}
      </Text>
    </ToolScreenLayout>
  );
}

function Field({
  label,
  value,
  onChangeText,
  styles,
  rtlTextStyle,
  colors,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  styles: ReturnType<typeof createToolScreenStyles>;
  rtlTextStyle: object;
  colors: ReturnType<typeof useAppTheme>;
}) {
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, rtlTextStyle]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        placeholder="0"
        placeholderTextColor={colors.textMuted}
        style={[styles.input, styles.inputMuted, rtlTextStyle]}
      />
    </View>
  );
}
