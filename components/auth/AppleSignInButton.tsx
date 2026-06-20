import { useEffect, useState } from "react";
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";

import { useAppTheme } from "@/lib/app-theme";

type AppleSignInButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Bouton natif Sign in with Apple (iOS uniquement, requis App Store). */
export function AppleSignInButton({
  onPress,
  disabled = false,
  style,
}: AppleSignInButtonProps) {
  const colors = useAppTheme();
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "ios") return;
    void AppleAuthentication.isAvailableAsync().then(setAvailable);
  }, []);

  if (Platform.OS !== "ios" || !available) return null;

  return (
    <View
      style={[styles.wrapper, disabled && styles.wrapperDisabled, style]}
      pointerEvents={disabled ? "none" : "auto"}
    >
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
        buttonStyle={
          colors.isDark
            ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
            : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
        }
        cornerRadius={12}
        style={styles.button}
        onPress={onPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  wrapperDisabled: {
    opacity: 0.55,
  },
  button: {
    width: "100%",
    height: 52,
  },
});
