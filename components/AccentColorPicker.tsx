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
    gap: 12,
    paddingVertical: 12,
    width: "100%",
  },
  item: {
    width: "23%",
    minWidth: 76,
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  swatchSelected: {
    borderWidth: 3,
  },
  label: {
    fontFamily: "PlusJakartaSans-Medium",
    textAlign: "center",
  },
});
