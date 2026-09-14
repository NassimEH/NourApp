import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AppIcon, type AppIconName } from "@/components/AppIcon";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { useAppTheme } from "@/lib/app-theme";

type EmptyStateProps = {
  message: string;
  icon?: AppIconName;
  onRetry?: () => void;
  retryLabel?: string;
};

export function EmptyState({
  message,
  icon,
  onRetry,
  retryLabel,
}: EmptyStateProps) {
  const colors = useAppTheme();

  return (
    <View style={styles.container}>
      {icon ? <AppIcon name={icon} size={42} color={colors.iconMuted} /> : null}
      <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
      {onRetry && retryLabel ? (
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.accent }]}
          onPress={onRetry}
          activeOpacity={0.8}
          accessibilityRole="button"
        >
          <AppIcon name="refresh-cw" size={18} color={colors.onAccent} />
          <Text style={[styles.retryLabel, { color: colors.onAccent }]}>
            {retryLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SCREEN_EDGE_PADDING,
    paddingVertical: 40,
    gap: 14,
  },
  message: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 22,
    textAlign: "center",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryLabel: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
});
