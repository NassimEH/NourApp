import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppIcon, type AppIconName } from "@/components/AppIcon";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { CARD_RADIUS, MIN_TOUCH_TARGET } from "@/lib/ui/spacing";

export interface ToolCardProps {
  icon: AppIconName;
  title: string;
  subtitle?: string;
  onPress: () => void;
  accessibilityLabel?: string;
  /** Grille horizontale accueil : icône + titre centrés */
  variant?: "default" | "compact";
}

export function ToolCard({
  icon,
  title,
  subtitle = "",
  onPress,
  accessibilityLabel,
  variant = "default",
}: ToolCardProps) {
  const colors = useAppTheme();
  const { rtlTextStyle, rtlViewStyle } = useTranslation();
  const compact = variant === "compact";

  if (compact) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        style={({ pressed }) => [
          styles.cardBox,
          pressed && styles.pressed,
        ]}
      >
        <View
          style={[
            styles.boxIconWrap,
            { backgroundColor: colors.accentSurface },
          ]}
        >
          <AppIcon name={icon} size={22} color={colors.accent} />
        </View>
        <Text
          style={[styles.titleBox, { color: colors.text }, rtlTextStyle]}
          numberOfLines={2}
        >
          {title}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.usesBackgroundImage
            ? colors.card
            : colors.cardElevated,
          borderColor: colors.border,
          minHeight: MIN_TOUCH_TARGET,
        },
        pressed && styles.pressed,
        rtlViewStyle,
      ]}
    >
      <View
        style={[styles.iconWrap, { backgroundColor: colors.accentSurface }]}
      >
        <AppIcon name={icon} size={22} color={colors.accent} />
      </View>
      <View style={styles.text}>
        <Text
          style={[styles.title, { color: colors.text }, rtlTextStyle]}
          numberOfLines={2}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[styles.subtitle, { color: colors.textMuted }, rtlTextStyle]}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      <AppIcon name="chevron-right" size={20} color={colors.iconMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: CARD_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBox: {
    width: "100%",
    minHeight: 100,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  boxIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBox: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-SemiBold",
    textAlign: "center",
    lineHeight: 14,
    width: "100%",
  },
  text: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 18,
  },
});
