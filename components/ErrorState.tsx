import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AppIcon, type AppIconName } from "@/components/AppIcon";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { useAppTheme } from "@/lib/app-theme";

type ErrorStateProps = {
  message: string;
  icon?: AppIconName;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorState({
  message,
  icon = "alert-circle",
  onRetry,
  retryLabel,
}: ErrorStateProps) {
  const colors = useAppTheme();

  return (
    <View style={styles.container}>
      <AppIcon name={icon} size={42} color={colors.iconMuted} />
      <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SCREEN_EDGE_PADDING,
    paddingVertical: 40,
    gap: 14,
  },
  message: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 23,
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
