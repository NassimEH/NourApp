import type { ReactNode } from "react";
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
  /** Contenu à droite (ex. bouton GPS), après le clear. */
  trailing?: ReactNode;
  editable?: boolean;
} & Pick<
  TextInputProps,
  "returnKeyType" | "autoCorrect" | "autoCapitalize" | "onSubmitEditing"
>;

/** Barre de recherche flat (ligne + séparateur) — style unique app. */
export function ScreenSearchBar({
  value,
  onChangeText,
  placeholder,
  containerStyle,
  trailing,
  editable = true,
  returnKeyType = "search",
  autoCorrect = false,
  autoCapitalize,
  onSubmitEditing,
}: ScreenSearchBarProps) {
  const colors = useAppTheme();
  const { t, rtlTextStyle, rtlViewStyle } = useTranslation();
  const underline = colors.isDark
    ? "rgba(255,255,255,0.22)"
    : "rgba(0,0,0,0.18)";

  return (
    <View
      style={[
        styles.wrap,
        rtlViewStyle,
        { borderBottomColor: underline },
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
        autoCapitalize={autoCapitalize}
        editable={editable}
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
      {trailing}
    </View>
  );
}

export const screenSearchBarSpacing: ViewStyle = {
  marginHorizontal: SCREEN_EDGE_PADDING,
  marginBottom: 20,
};

/** Même barre dans un ScrollView déjà paddé horizontalement. */
export const screenSearchBarSpacingInScroll: ViewStyle = {
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
