import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppIcon } from "@/components/AppIcon";
import { AppImage } from "@/components/AppImage";
import { useAppTheme } from "@/lib/app-theme";
import { CARD_RADIUS, SECTION_GAP, SHADOW, SPACE } from "@/lib/ui/spacing";

const HERO_ART = require("@/assets/images/learn-hero-path.png");

type Props = {
  eyebrow: string;
  title: string;
  meta: string;
  ctaLabel: string;
  /** Couleur de fond du parcours (défaut = accent app) */
  accentColor?: string;
  onPress: () => void;
};

/** Hero leçon — adapté de DuolingoClone/HomeHero. */
export function LearnHero({
  eyebrow,
  title,
  meta,
  ctaLabel,
  accentColor,
  onPress,
}: Props) {
  const colors = useAppTheme();
  const cardShadow = colors.isDark ? SHADOW.dark : SHADOW.light;
  const heroBg = accentColor ?? colors.accent;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.wrap,
        cardShadow,
        pressed && { opacity: 0.94 },
      ]}
    >
      <View style={[styles.hero, { backgroundColor: heroBg }]}>
        <View
          style={[
            styles.gradientOverlay,
            {
              backgroundColor: colors.isDark
                ? "rgba(0,0,0,0.28)"
                : "rgba(0,0,0,0.08)",
            },
          ]}
        />
        <View style={styles.textCol}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.meta}>{meta}</Text>
          <View style={styles.cta}>
            <Text style={[styles.ctaText, { color: heroBg }]}>{ctaLabel}</Text>
            <AppIcon name="chevron-right" size={16} color={heroBg} />
          </View>
        </View>
        <AppImage
          source={HERO_ART}
          style={styles.image}
          contentFit="contain"
          recyclingKey="learn-hero"
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: SECTION_GAP,
    borderRadius: CARD_RADIUS,
  },
  hero: {
    flexDirection: "row",
    borderRadius: CARD_RADIUS,
    minHeight: 176,
    overflow: "hidden",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  textCol: {
    flex: 1,
    paddingVertical: SPACE.lg,
    paddingLeft: SPACE.lg,
    paddingRight: SPACE.sm,
    justifyContent: "space-between",
    gap: SPACE.xs,
    zIndex: 1,
  },
  eyebrow: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 11,
    color: "rgba(255,255,255,0.78)",
  },
  title: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 20,
    lineHeight: 26,
    color: "#fff",
  },
  meta: {
    fontFamily: "PlusJakartaSans-Medium",
    fontSize: 12,
    color: "rgba(255,255,255,0.88)",
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: SPACE.xs,
  },
  ctaText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
  },
  image: {
    width: 108,
    height: 176,
    alignSelf: "flex-end",
  },
});
