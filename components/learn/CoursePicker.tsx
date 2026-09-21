import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppIcon } from "@/components/AppIcon";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import type { LearnCourse } from "@/lib/learn/types";
import { CARD_RADIUS, SPACE } from "@/lib/ui/spacing";

type Props = {
  courses: LearnCourse[];
  selectedCourseId: string;
  onSelect: (courseId: string) => void;
};

/** Sélecteur de parcours — adapté de DuolingoClone/ModulePicker. */
export function CoursePicker({
  courses,
  selectedCourseId,
  onSelect,
}: Props) {
  const colors = useAppTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const current = useMemo(
    () => courses.find((c) => c.id === selectedCourseId) ?? courses[0] ?? null,
    [courses, selectedCourseId]
  );

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={styles.trigger}
        accessibilityRole="button"
        accessibilityLabel={t("learn.selectCourse")}
      >
        <Text
          style={[styles.triggerText, { color: colors.text }]}
          numberOfLines={2}
        >
          {current?.title ?? t("learn.selectCourse")}
        </Text>
        <AppIcon name="chevron-down" size={20} color={colors.text} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable
            style={[
              styles.sheet,
              {
                backgroundColor: colors.usesBackgroundImage
                  ? colors.card
                  : colors.cardElevated,
                borderColor: colors.border,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={[styles.sheetTitle, { color: colors.text }]}>
              {t("learn.selectCourse")}
            </Text>
            <ScrollView
              style={styles.list}
              bounces={false}
              showsVerticalScrollIndicator={false}
            >
              {courses.map((course) => {
                const active = course.id === current?.id;
                return (
                  <Pressable
                    key={course.id}
                    onPress={() => {
                      onSelect(course.id);
                      setOpen(false);
                    }}
                    style={[
                      styles.row,
                      active && { backgroundColor: colors.accentSurface },
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                  >
                    <View style={styles.rowText}>
                      <Text
                        style={[styles.rowTitle, { color: colors.text }]}
                        numberOfLines={2}
                      >
                        {course.title}
                      </Text>
                      {course.subtitle ? (
                        <Text
                          style={[styles.rowSub, { color: colors.textMuted }]}
                          numberOfLines={1}
                        >
                          {course.subtitle}
                        </Text>
                      ) : null}
                    </View>
                    {active ? (
                      <AppIcon name="check" size={18} color={colors.accent} />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "stretch",
    maxWidth: "100%",
    marginTop: SPACE.xs,
  },
  triggerText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 17,
    flexShrink: 1,
    lineHeight: 24,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(11, 18, 32, 0.45)",
    justifyContent: "center",
    paddingHorizontal: SPACE.xl,
  },
  sheet: {
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    paddingVertical: SPACE.sm,
    paddingHorizontal: SPACE.xs,
    maxHeight: "70%",
  },
  sheetTitle: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 16,
    paddingHorizontal: SPACE.sm,
    paddingBottom: SPACE.xs,
  },
  list: {
    flexGrow: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACE.sm,
    paddingHorizontal: SPACE.sm,
    borderRadius: 12,
    gap: SPACE.xs,
  },
  rowText: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  rowTitle: {
    fontFamily: "PlusJakartaSans-Medium",
    fontSize: 15,
  },
  rowSub: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
  },
});
