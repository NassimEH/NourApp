import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { ToolScreenLayout } from "@/components/ToolScreenLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { createToolScreenStyles } from "@/lib/tool-screen-styles";
import { ZAKAT_COUNTRY_PRESETS } from "@/lib/zakat/presets";

function parseAmount(value: string): number {
  const normalized = value.replace(",", ".").trim();
  const n = parseFloat(normalized);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export default function ZakatFitrScreen() {
  const colors = useAppTheme();
  const styles = useMemo(() => createToolScreenStyles(colors), [colors]);
  const { t, rtlTextStyle } = useTranslation();
  const [persons, setPersons] = useState(1);
  const [amountPerPerson, setAmountPerPerson] = useState("7");

  const perPerson = parseAmount(amountPerPerson);
  const total = useMemo(() => persons * perPerson, [persons, perPerson]);

  const formattedTotal = useMemo(() => {
    if (total <= 0) return "—";
    return total.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }, [total]);

  return (
    <ToolScreenLayout
      title={t("zakatFitr.title")}
      subtitle={t("zakatFitr.subtitle")}
    >
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, rtlTextStyle]}>
          {t("zakatFitr.persons")}
        </Text>
        <View style={styles.stepper}>
          <Pressable
            onPress={() => setPersons((p) => Math.max(1, p - 1))}
            style={styles.stepBtn}
            accessibilityLabel={t("zakatFitr.decrease")}
          >
            <Text style={styles.stepBtnText}>−</Text>
          </Pressable>
          <Text style={styles.stepValue}>{persons}</Text>
          <Pressable
            onPress={() => setPersons((p) => p + 1)}
            style={styles.stepBtn}
            accessibilityLabel={t("zakatFitr.increase")}
          >
            <Text style={styles.stepBtnText}>+</Text>
          </Pressable>
        </View>
      </View>

      <Text style={[styles.sectionLabel, rtlTextStyle]}>
        {t("zakatFitr.countrySection")}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingBottom: 8, marginBottom: 16 }}
      >
        {ZAKAT_COUNTRY_PRESETS.map((preset) => (
          <Pressable
            key={preset.id}
            onPress={() => setAmountPerPerson(String(preset.amountPerPerson))}
            style={styles.presetChip}
          >
            <Text style={[styles.chipText, { color: colors.text }]}>
              {t(preset.labelKey)}
            </Text>
            <Text
              style={[
                styles.fieldLabel,
                { color: colors.accent, marginTop: 2, marginBottom: 0 },
              ]}
            >
              {preset.amountPerPerson} {preset.currency}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.field}>
        <Text style={[styles.fieldLabel, rtlTextStyle]}>
          {t("zakatFitr.amountPerPerson")}
        </Text>
        <TextInput
          value={amountPerPerson}
          onChangeText={setAmountPerPerson}
          keyboardType="decimal-pad"
          placeholder="7"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, rtlTextStyle]}
        />
      </View>

      <View style={styles.highlight}>
        <Text style={[styles.highlightLabel, rtlTextStyle]}>
          {t("zakatFitr.total")}
        </Text>
        <Text style={styles.highlightValue}>{formattedTotal}</Text>
      </View>

      <Text style={[styles.note, rtlTextStyle]}>{t("zakatFitr.disclaimer")}</Text>
    </ToolScreenLayout>
  );
}
