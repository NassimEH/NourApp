import { useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { PreferenceScreenLayout } from "@/components/PreferenceScreenLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

function parseAmount(value: string): number {
  const normalized = value.replace(",", ".").trim();
  const n = parseFloat(normalized);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export default function ZakatFitrScreen() {
  const colors = useAppTheme();
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
    <PreferenceScreenLayout
      title={t("zakatFitr.title")}
      subtitle={t("zakatFitr.subtitle")}
    >
      <View style={styles.block}>
        <Text style={[styles.label, { color: colors.textMuted }, rtlTextStyle]}>
          {t("zakatFitr.persons")}
        </Text>
        <View style={styles.stepper}>
          <Pressable
            onPress={() => setPersons((p) => Math.max(1, p - 1))}
            style={[styles.stepBtn, { borderColor: colors.border }]}
            accessibilityLabel={t("zakatFitr.decrease")}
          >
            <Text style={[styles.stepBtnText, { color: colors.text }]}>−</Text>
          </Pressable>
          <Text style={[styles.stepValue, { color: colors.text }]}>
            {persons}
          </Text>
          <Pressable
            onPress={() => setPersons((p) => p + 1)}
            style={[styles.stepBtn, { borderColor: colors.border }]}
            accessibilityLabel={t("zakatFitr.increase")}
          >
            <Text style={[styles.stepBtnText, { color: colors.text }]}>+</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.block}>
        <Text style={[styles.label, { color: colors.textMuted }, rtlTextStyle]}>
          {t("zakatFitr.amountPerPerson")}
        </Text>
        <TextInput
          value={amountPerPerson}
          onChangeText={setAmountPerPerson}
          keyboardType="decimal-pad"
          placeholder="7"
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: colors.border,
              backgroundColor: colors.backgroundSecondary,
            },
          ]}
        />
      </View>

      <View
        style={[
          styles.totalCard,
          {
            backgroundColor: colors.accentSurface,
            borderColor: colors.accent,
          },
        ]}
      >
        <Text style={[styles.totalLabel, { color: colors.textMuted }, rtlTextStyle]}>
          {t("zakatFitr.total")}
        </Text>
        <Text style={[styles.totalValue, { color: colors.accent }]}>
          {formattedTotal}
        </Text>
      </View>

      <Text style={[styles.note, { color: colors.textMuted }, rtlTextStyle]}>
        {t("zakatFitr.disclaimer")}
      </Text>
    </PreferenceScreenLayout>
  );
}

const styles = StyleSheet.create({
  block: {
    paddingVertical: 14,
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBtnText: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans-Medium",
  },
  stepValue: {
    fontSize: 28,
    fontFamily: "PlusJakartaSans-Bold",
    minWidth: 48,
    textAlign: "center",
  },
  input: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-SemiBold",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  totalCard: {
    marginTop: 8,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    gap: 6,
  },
  totalLabel: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  totalValue: {
    fontSize: 36,
    fontFamily: "PlusJakartaSans-Bold",
  },
  note: {
    marginTop: 16,
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 20,
  },
});
