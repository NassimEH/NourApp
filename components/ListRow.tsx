import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { AppIcon, type AppIconName } from "@/components/AppIcon";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { useTranslation } from "@/lib/i18n";
import { MIN_TOUCH_TARGET } from "@/lib/ui/spacing";

export interface ListRowProps {
  icon?: AppIconName;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
  titleColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function ListRow({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
  rightElement,
  titleColor,
  style,
}: ListRowProps) {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const { isRTL, rtlTextStyle, rtlViewStyle } = useTranslation();
  const chevron = isRTL ? "chevron-left" : "chevron-right";

  const content = (
    <>
      {icon ? (
        <AppIcon name={icon} size={22} color={colors.icon} />
      ) : null}
      <View style={styles.text}>
        <Text
          style={[
            styles.title,
            rtlTextStyle,
            {
              color: titleColor ?? colors.text,
              fontSize: typography.bodyMedium,
            },
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[
              styles.subtitle,
              rtlTextStyle,
              { color: colors.textMuted, fontSize: typography.subtitle },
            ]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {rightElement ?? (showChevron && onPress ? (
        <AppIcon name={chevron} size={20} color={colors.iconMuted} />
      ) : null)}
    </>
  );

  if (!onPress) {
    return (
      <View style={[styles.row, styles.rowStatic, rtlViewStyle, style]}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.row,
        rtlViewStyle,
        pressed && styles.pressed,
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: MIN_TOUCH_TARGET,
    paddingVertical: 10,
  },
  rowStatic: {
    paddingVertical: 10,
  },
  pressed: {
    opacity: 0.75,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: "PlusJakartaSans-Medium",
  },
  subtitle: {
    fontFamily: "PlusJakartaSans-Regular",
  },
});
