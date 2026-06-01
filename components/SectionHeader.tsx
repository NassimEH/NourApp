import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { SECTION_TITLE_GAP } from "@/lib/ui/spacing";

export interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
  seeAllLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function SectionHeader({
  title,
  onSeeAll,
  seeAllLabel,
  style,
}: SectionHeaderProps) {
  const colors = useAppTheme();
  const { t, rtlTextStyle, rtlViewStyle } = useTranslation();
  const linkLabel = seeAllLabel ?? t("home.seeAll");

  return (
    <View style={[styles.row, rtlViewStyle, style]}>
      <Text
        style={[styles.title, { color: colors.text }, rtlTextStyle]}
        accessibilityRole="header"
      >
        {title}
      </Text>
      {onSeeAll ? (
        <Pressable
          onPress={onSeeAll}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={linkLabel}
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          <Text style={[styles.seeAll, { color: colors.accent }, rtlTextStyle]}>
            {linkLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SECTION_TITLE_GAP,
  },
  title: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    flex: 1,
  },
  seeAll: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    marginLeft: 12,
  },
  pressed: {
    opacity: 0.75,
  },
});
