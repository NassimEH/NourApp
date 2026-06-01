import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppIcon } from "@/components/AppIcon";

import {
  ACCENT_COLOR_KEYS,
  ACCENT_HEX,
  type AccentColorKey,
} from "@/lib/accent-colors";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { getAccentLabelI18n, useTranslation } from "@/lib/i18n";

interface AccentColorPickerProps {
  value: AccentColorKey;
  onChange: (key: AccentColorKey) => void;
}

export function AccentColorPicker({ value, onChange }: AccentColorPickerProps) {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const { locale, rtlTextStyle } = useTranslation();

  return (
    <View style={styles.grid}>
      {ACCENT_COLOR_KEYS.map((key) => {
        const selected = value === key;
        const hex = ACCENT_HEX[key];
        return (
          <TouchableOpacity
            key={key}
            style={styles.item}
            onPress={() => onChange(key)}
            activeOpacity={0.75}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={getAccentLabelI18n(locale, key)}
          >
            <View
              style={[
                styles.swatch,
                { backgroundColor: hex },
                selected && [
                  styles.swatchSelected,
                  { borderColor: colors.text },
                ],
              ]}
            >
              {selected ? (
                <AppIcon name="check" size={18} color="#FFFFFF" />
              ) : null}
            </View>
            <Text
              style={[
                styles.label,
                rtlTextStyle,
                {
                  color: selected ? colors.text : colors.textMuted,
                  fontSize: typography.caption,
                },
              ]}
              numberOfLines={1}
            >
              {getAccentLabelI18n(locale, key)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    paddingVertical: 8,
    justifyContent: "space-between",
  },
  item: {
    width: "22%",
    minWidth: 72,
    alignItems: "center",
    gap: 8,
  },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  swatchSelected: {
    borderWidth: 3,
  },
  label: {
    fontFamily: "PlusJakartaSans-Medium",
    textAlign: "center",
  },
});
