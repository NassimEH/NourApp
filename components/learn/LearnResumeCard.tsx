import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppIcon } from "@/components/AppIcon";
import { useAppTheme } from "@/lib/app-theme";
import { CARD_RADIUS, MIN_TOUCH_TARGET, SHADOW, SPACE } from "@/lib/ui/spacing";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  onPress: () => void;
};

/** Carte reprise — style défi du jour DuolingoClone, sans XP. */
export function LearnResumeCard({
  eyebrow,
  title,
  subtitle,
  ctaLabel,
  onPress,
}: Props) {
  const colors = useAppTheme();
  const cardShadow = colors.isDark ? SHADOW.dark : SHADOW.light;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.card,
        cardShadow,
        {
          backgroundColor: colors.usesBackgroundImage
            ? colors.card
            : colors.cardElevated,
          borderColor: colors.accent,
        },
        pressed && { opacity: 0.92 },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.featuredLabel}>
          <AppIcon name="zap" size={14} color={colors.accent} />
          <Text style={[styles.featuredText, { color: colors.accent }]}>
            {eyebrow}
          </Text>
        </View>
        <Text style={[styles.ctaInline, { color: colors.accent }]}>
          {ctaLabel}
        </Text>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyText}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {title}
          </Text>
          <Text
            style={[styles.subtitle, { color: colors.textMuted }]}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        </View>
        <View
          style={[styles.chevronBtn, { backgroundColor: colors.accent }]}
        >
          <AppIcon name="chevron-right" size={18} color={colors.onAccent} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: CARD_RADIUS,
    borderWidth: 1.5,
    padding: SPACE.md,
    gap: SPACE.sm,
    marginBottom: SPACE.lg,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACE.sm,
  },
  featuredLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  featuredText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 12,
  },
  ctaInline: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 12,
  },
  body: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACE.md,
  },
  bodyText: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  title: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    lineHeight: 22,
  },
  subtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    lineHeight: 18,
  },
  chevronBtn: {
    width: MIN_TOUCH_TARGET - 8,
    height: MIN_TOUCH_TARGET - 8,
    borderRadius: (MIN_TOUCH_TARGET - 8) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
