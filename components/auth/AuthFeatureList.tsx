import { StyleSheet, Text, View } from "react-native";

import { AppIcon, type AppIconName } from "@/components/AppIcon";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { SPACE } from "@/lib/ui/spacing";

const FEATURES: { icon: AppIconName; key: string }[] = [
  { icon: "sunrise", key: "auth.featurePrayers" },
  { icon: "headphones", key: "auth.featureQuran" },
  { icon: "book-open", key: "auth.featureLibrary" },
  { icon: "award", key: "auth.featureLearn" },
];

export function AuthFeatureList() {
  const colors = useAppTheme();
  const { t, rtlTextStyle, rtlViewStyle } = useTranslation();

  return (
    <View style={styles.wrap}>
      {FEATURES.map((item, index) => (
        <View key={item.key}>
          {index > 0 ? (
            <View
              style={[styles.divider, { backgroundColor: colors.divider }]}
            />
          ) : null}
          <View style={[styles.row, rtlViewStyle]}>
            <View style={styles.iconSlot}>
              <AppIcon name={item.icon} size={18} color={colors.text} />
            </View>
            <Text
              style={[styles.label, rtlTextStyle, { color: colors.text }]}
            >
              {t(item.key as "auth.featurePrayers")}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: SPACE.xl,
    width: "100%",
    maxWidth: 360,
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACE.md,
    paddingVertical: SPACE.sm,
  },
  iconSlot: {
    width: 24,
    alignItems: "center",
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 21,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
  },
});
