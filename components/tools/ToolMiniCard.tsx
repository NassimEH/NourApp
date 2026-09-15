import Feather from "@expo/vector-icons/Feather";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { AppIconName } from "@/components/AppIcon";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { CARD_RADIUS } from "@/lib/ui/spacing";

export interface ToolMiniCardProps {
  icon: AppIconName;
  title: string;
  onPress: () => void;
  /** Largeur fixe (legacy) */
  width?: number;
  /** Occupe toute la largeur du parent (carrousel 1/3) */
  fill?: boolean;
  accessibilityLabel?: string;
}

/** Petit cadre outil — icône centrée au-dessus du titre. */
export function ToolMiniCard({
  icon,
  title,
  onPress,
  width,
  fill,
  accessibilityLabel,
}: ToolMiniCardProps) {
  const colors = useAppTheme();
  const { isRTL } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      style={({ pressed }) => [
        styles.card,
        fill ? styles.cardFill : width != null ? { width } : styles.cardFlex,
        {
          backgroundColor: colors.usesBackgroundImage
            ? colors.cardElevated
            : colors.card,
          borderColor: colors.border,
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconSlot}>
          <Feather name={icon} size={22} color={colors.icon} />
        </View>
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
              writingDirection: isRTL ? "rtl" : "ltr",
            },
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 92,
    borderRadius: CARD_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  cardFill: {
    width: "100%",
    alignSelf: "stretch",
  },
  cardFlex: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  iconSlot: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  title: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-SemiBold",
    textAlign: "center",
    lineHeight: 15,
    width: "100%",
    alignSelf: "center",
  },
});
