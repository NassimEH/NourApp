import { StyleSheet, Text, View, type StyleProp, type TextStyle } from "react-native";

import { AppIcon } from "@/components/AppIcon";
import { useAppTheme } from "@/lib/app-theme";

type Props = {
  brand: string;
  tagline: string;
  brandStyle?: StyleProp<TextStyle>;
  taglineStyle?: StyleProp<TextStyle>;
};

/** En-tête léger : logo + marque, sans mockup 3D. */
export function SignInCompactHeader({
  brand,
  tagline,
  brandStyle,
  taglineStyle,
}: Props) {
  const colors = useAppTheme();

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.logo,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <AppIcon name="sun" size={26} color={colors.accent} />
      </View>
      <Text style={[styles.brand, brandStyle, { color: colors.text }]}>
        {brand}
      </Text>
      <Text
        style={[styles.tagline, taglineStyle, { color: colors.textMuted }]}
        numberOfLines={2}
      >
        {tagline}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    marginBottom: 28,
    paddingTop: 8,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  brand: {
    fontSize: 28,
    fontFamily: "PlusJakartaSans-ExtraBold",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },
});
