import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { AppIcon } from "@/components/AppIcon";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { CARD_RADIUS, MIN_TOUCH_TARGET } from "@/lib/ui/spacing";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  onUseDeviceLocation: () => void;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Recherche ville — contour fin, fond transparent (flat). */
export function PrayerLocationSearchBar({
  value,
  onChangeText,
  onSubmit,
  onClear,
  onUseDeviceLocation,
  loading,
  style,
}: Props) {
  const colors = useAppTheme();
  const { t, rtlTextStyle, rtlViewStyle } = useTranslation();

  return (
    <View
      style={[
        styles.wrap,
        rtlViewStyle,
        { borderColor: colors.border },
        style,
      ]}
    >
      <AppIcon name="search" size={18} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        placeholder={t("screens.prayersLocationPlaceholder")}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { color: colors.text }, rtlTextStyle]}
        editable={!loading}
        autoCorrect={false}
        autoCapitalize="words"
      />
      {loading ? (
        <ActivityIndicator size="small" color={colors.accent} />
      ) : value.length > 0 ? (
        <Pressable
          onPress={onClear}
          hitSlop={10}
          accessibilityRole="button"
          style={({ pressed }) => pressed && styles.pressed}
        >
          <AppIcon name="x" size={18} color={colors.textMuted} />
        </Pressable>
      ) : null}
      <Pressable
        onPress={onUseDeviceLocation}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel={t("screens.prayersUseMyLocation")}
        style={({ pressed }) => [
          styles.locationBtn,
          (pressed || loading) && styles.pressed,
        ]}
      >
        <AppIcon name="navigation" size={20} color={colors.accent} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: CARD_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: "transparent",
    minHeight: MIN_TOUCH_TARGET,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Regular",
    paddingVertical: 8,
    padding: 0,
    backgroundColor: "transparent",
  },
  locationBtn: {
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});
