import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import icons from "@/constants/icons";
import { useAppTheme } from "@/lib/app-theme";

type GoogleSignInButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Bouton « Continuer avec Google » — fond transparent, bordure et texte selon le thème. */
export function GoogleSignInButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  style,
}: GoogleSignInButtonProps) {
  const colors = useAppTheme();
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: "transparent",
          borderColor: colors.border,
        },
        isDisabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <>
          <Image
            source={icons.google}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    width: "100%",
    minHeight: 52,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  logo: {
    width: 20,
    height: 20,
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
    letterSpacing: 0.1,
  },
});
