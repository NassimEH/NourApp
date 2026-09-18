import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { AppIcon } from "@/components/AppIcon";
import {
  ScreenSearchBar,
  screenSearchBarSpacingInScroll,
} from "@/components/ScreenSearchBar";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  onUseDeviceLocation: () => void;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Recherche ville — même barre flat que Sourates / Invocations. */
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
  const { t } = useTranslation();

  return (
    <ScreenSearchBar
      value={value}
      onChangeText={(text) => {
        onChangeText(text);
        if (text.length === 0) onClear();
      }}
      onSubmitEditing={onSubmit}
      placeholder={t("screens.prayersLocationPlaceholder")}
      editable={!loading}
      autoCapitalize="words"
      containerStyle={[screenSearchBarSpacingInScroll, style]}
      trailing={
        loading ? (
          <ActivityIndicator size="small" color={colors.accent} />
        ) : (
          <Pressable
            onPress={onUseDeviceLocation}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel={t("screens.prayersUseMyLocation")}
            hitSlop={8}
            style={({ pressed }) => [
              styles.locationBtn,
              pressed && styles.pressed,
            ]}
          >
            <AppIcon name="navigation" size={20} color={colors.accent} />
          </Pressable>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  locationBtn: {
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});
