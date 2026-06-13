import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextStyle,
  type TextInputProps,
} from "react-native";

import { AppIcon, type AppIconName } from "@/components/AppIcon";
import { useAppTheme } from "@/lib/app-theme";
import { SPACE } from "@/lib/ui/spacing";

type Props = TextInputProps & {
  label: string;
  icon?: AppIconName;
  labelStyle?: StyleProp<TextStyle>;
  /** flat = fond léger sur l’arrière-plan de l’écran, sans carte */
  variant?: "default" | "flat";
};

export function AuthTextField({
  label,
  icon = "mail",
  labelStyle,
  variant = "default",
  secureTextEntry,
  style,
  editable = true,
  ...inputProps
}: Props) {
  const colors = useAppTheme();
  const [hidden, setHidden] = useState(!!secureTextEntry);
  const isPassword = !!secureTextEntry;
  const isFlat = variant === "flat";

  return (
    <View style={[styles.wrap, isFlat && styles.wrapFlat]}>
      <Text style={[styles.label, isFlat && styles.labelFlat, labelStyle, { color: colors.text }]}>
        {label}
      </Text>
      <View
        style={[
          styles.field,
          isFlat && styles.fieldFlat,
          {
            borderColor: colors.border,
            backgroundColor: isFlat ? "transparent" : colors.backgroundSecondary,
          },
          !editable && styles.fieldDisabled,
        ]}
      >
        {icon ? (
          <AppIcon name={icon} size={18} color={colors.textMuted} />
        ) : null}
        <TextInput
          {...inputProps}
          editable={editable}
          secureTextEntry={isPassword ? hidden : false}
          style={[styles.input, { color: colors.text }, style]}
          placeholderTextColor={colors.textMuted}
          autoCapitalize={isPassword ? "none" : inputProps.autoCapitalize}
          autoCorrect={false}
        />
        {isPassword ? (
          <Pressable
            onPress={() => setHidden((v) => !v)}
            hitSlop={8}
            accessibilityRole="button"
          >
            <AppIcon
              name={hidden ? "eye" : "eye-off"}
              size={18}
              color={colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: SPACE.md,
  },
  wrapFlat: {
    marginBottom: 0,
  },
  label: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-SemiBold",
    marginBottom: SPACE.xs,
  },
  labelFlat: {
    fontSize: 13,
    marginBottom: SPACE.xs,
    opacity: 0.9,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 50,
  },
  fieldFlat: {
    minHeight: 48,
    borderWidth: 0,
    borderRadius: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    gap: 10,
  },
  fieldDisabled: {
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    paddingVertical: 12,
  },
});
