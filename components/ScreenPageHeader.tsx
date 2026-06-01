import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { AppIcon } from "@/components/AppIcon";

import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { useTranslation } from "@/lib/i18n";
import { MIN_TOUCH_TARGET } from "@/lib/ui/spacing";

/** Hauteur minimale réservée au bloc sous-titre (2 lignes) */
export const SCREEN_HEADER_SUBTITLE_MIN_HEIGHT = 44;

export interface ScreenPageHeaderProps {
  title: string;
  subtitle: string;
  onBack?: () => void;
  headerActions?: React.ReactNode;
  rightElement?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ScreenPageHeader({
  title,
  subtitle,
  onBack,
  headerActions,
  rightElement,
  style,
}: ScreenPageHeaderProps) {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const { isRTL, rtlTextStyle, rtlViewStyle } = useTranslation();
  const backIcon = isRTL ? "chevron-right" : "chevron-left";

  const titleSize = typography.pageTitle;
  const subtitleSize = typography.subtitle;

  const rightSlot =
    rightElement ??
    (onBack || headerActions ? (
      <View style={styles.rightRow}>
        {headerActions}
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            activeOpacity={0.7}
            hitSlop={8}
          >
            <AppIcon name={backIcon} size={28} color={colors.icon} />
          </TouchableOpacity>
        ) : null}
      </View>
    ) : null);

  return (
    <View style={[styles.header, rtlViewStyle, style]}>
      <View style={[styles.textBlock, rightSlot ? styles.textBlockWithRight : null]}>
        <Text
          style={[
            styles.title,
            rtlTextStyle,
            {
              color: colors.text,
              fontSize: titleSize,
              lineHeight: Math.round(titleSize * 1.2),
            },
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.subtitle,
            rtlTextStyle,
            {
              color: colors.textMuted,
              fontSize: subtitleSize,
              lineHeight: Math.round(subtitleSize * 1.35),
              minHeight: SCREEN_HEADER_SUBTITLE_MIN_HEIGHT,
            },
          ]}
          numberOfLines={2}
        >
          {subtitle}
        </Text>
      </View>
      {rightSlot}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 96,
    paddingHorizontal: SCREEN_EDGE_PADDING,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 12,
  },
  textBlock: {
    flex: 1,
    justifyContent: "flex-start",
  },
  textBlockWithRight: {
    paddingRight: 4,
  },
  title: {
    fontFamily: "PlusJakartaSans-Bold",
  },
  subtitle: {
    fontFamily: "PlusJakartaSans-Medium",
    marginTop: 6,
  },
  rightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: "center",
  },
  backButton: {
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    alignItems: "center",
    justifyContent: "center",
  },
});
