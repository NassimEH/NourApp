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
  /** @deprecated L’accueil utilise ListRow ; conservé pour compat. */
  variant?: "default" | "compact";
}

/** Ligne outil — icône flat, alignée ListRow / design system. */
export function ToolCard({
  icon,
  title,
  subtitle = "",
  onPress,
  accessibilityLabel,
}: ToolCardProps) {
  const colors = useAppTheme();
  const { rtlTextStyle, rtlViewStyle } = useTranslation();

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
      <AppIcon name={icon} size={22} color={colors.icon} />
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
