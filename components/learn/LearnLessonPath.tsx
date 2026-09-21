import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppIcon } from "@/components/AppIcon";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import type { LearnLesson, LessonStatus } from "@/lib/learn/types";
import { CARD_RADIUS, SPACE } from "@/lib/ui/spacing";

export type LearnPathItem = {
  lesson: LearnLesson;
  index: number;
  status: LessonStatus;
};

type Props = {
  items: LearnPathItem[];
  heroColor: string;
  onPressLesson: (lessonId: string) => void;
};

/** Chemin de leçons — adapté de DuolingoClone/LessonPath, flat NourApp. */
export function LearnLessonPath({
  items,
  heroColor,
  onPressLesson,
}: Props) {
  const colors = useAppTheme();
  const { t } = useTranslation();

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <AppIcon name="book-open" size={22} color={colors.iconMuted} />
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          {t("learn.planFilterEmpty")}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        const locked = item.status === "locked";
        const completed = item.status === "completed";
        const available = item.status === "available";

        let nodeBg = "transparent";
        let nodeBorder = colors.border;
        if (completed) {
          nodeBg = heroColor;
          nodeBorder = heroColor;
        } else if (available) {
          nodeBg = heroColor;
          nodeBorder = heroColor;
        }

        return (
          <View key={item.lesson.id} style={styles.row}>
            <View style={styles.railCol}>
              <View
                style={[
                  styles.node,
                  {
                    backgroundColor: nodeBg,
                    borderColor: nodeBorder,
                  },
                ]}
              >
                {completed ? (
                  <AppIcon name="check" size={12} color="#fff" />
                ) : locked ? (
                  <AppIcon name="lock" size={12} color={colors.iconMuted} />
                ) : (
                  <Text style={styles.nodeText}>{item.index + 1}</Text>
                )}
              </View>
              {!isLast ? (
                <View
                  style={[styles.rail, { backgroundColor: colors.divider }]}
                />
              ) : null}
            </View>

            <Pressable
              onPress={() => {
                if (!locked) onPressLesson(item.lesson.id);
              }}
              disabled={locked}
              accessibilityRole="button"
              accessibilityState={{ disabled: locked }}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: colors.usesBackgroundImage
                    ? colors.card
                    : colors.cardElevated,
                  borderColor: available ? heroColor : colors.border,
                  opacity: locked ? 0.55 : 1,
                },
                pressed && !locked && styles.cardPressed,
              ]}
            >
              <Text style={[styles.meta, { color: colors.textMuted }]}>
                {t("learn.lesson")} {item.lesson.order}
                {completed ? ` · ${t("learn.lessonCompleted")}` : ""}
              </Text>
              <Text
                style={[styles.cardTitle, { color: colors.text }]}
                numberOfLines={2}
              >
                {item.lesson.title}
                {item.lesson.subtitle ? ` — ${item.lesson.subtitle}` : ""}
              </Text>
              {locked ? (
                <Text style={[styles.ctaMuted, { color: colors.textMuted }]}>
                  {t("learn.lessonLocked")}
                </Text>
              ) : (
                <View style={styles.ctaRow}>
                  <Text style={[styles.cta, { color: heroColor }]}>
                    {completed ? t("learn.review") : t("learn.start")}
                  </Text>
                  <AppIcon name="chevron-right" size={16} color={heroColor} />
                </View>
              )}
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 0,
    paddingBottom: SPACE.lg,
  },
  row: {
    flexDirection: "row",
    gap: SPACE.lg,
  },
  railCol: {
    width: 28,
    alignItems: "center",
  },
  node: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  nodeText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 11,
    color: "#fff",
  },
  rail: {
    width: 2,
    flex: 1,
    minHeight: 48,
    marginVertical: SPACE.xs,
  },
  card: {
    flex: 1,
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    padding: SPACE.lg,
    gap: SPACE.sm,
    marginBottom: SPACE.xxl,
  },
  cardPressed: {
    opacity: 0.92,
  },
  meta: {
    fontFamily: "PlusJakartaSans-Medium",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  cardTitle: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 15,
    lineHeight: 22,
  },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: SPACE.xs,
  },
  cta: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
  },
  ctaMuted: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    marginTop: SPACE.xs,
  },
  empty: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACE.sm,
    paddingVertical: SPACE.xxl,
  },
  emptyText: {
    flex: 1,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    lineHeight: 20,
  },
});
