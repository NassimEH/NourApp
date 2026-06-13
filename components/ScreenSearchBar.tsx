import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

import { AppIcon } from "@/components/AppIcon";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

type ScreenSearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
} & Pick<TextInputProps, "returnKeyType" | "autoCorrect" | "onSubmitEditing">;

/** Barre de recherche flat (ligne + séparateur), alignée sur Invocations. */
export function ScreenSearchBar({
  value,
  onChangeText,
  placeholder,
  containerStyle,
  returnKeyType = "search",
  autoCorrect = false,
  onSubmitEditing,
}: ScreenSearchBarProps) {
  const colors = useAppTheme();
  const { t, rtlTextStyle, rtlViewStyle } = useTranslation();

  return (
    <View
      style={[
        styles.wrap,
        rtlViewStyle,
        { borderBottomColor: colors.border },
        containerStyle,
      ]}
    >
      <AppIcon name="search" size={18} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={returnKeyType}
        autoCorrect={autoCorrect}
        placeholder={placeholder ?? t("screens.searchPlaceholder")}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { color: colors.text }, rtlTextStyle]}
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText("")}
          hitSlop={12}
          accessibilityRole="button"
          style={({ pressed }) => pressed && styles.pressed}
        >
          <AppIcon name="x" size={18} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

export const screenSearchBarSpacing: ViewStyle = {
  marginHorizontal: SCREEN_EDGE_PADDING,
  marginBottom: 20,
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    padding: 0,
    backgroundColor: "transparent",
  },
  pressed: {
    opacity: 0.7,
  },
});
