import { StyleSheet, View } from "react-native";

import { useAppTheme } from "@/lib/app-theme";

export function PreferenceOptionDivider() {
  const colors = useAppTheme();
  return (
    <View style={[styles.divider, { backgroundColor: colors.border }]} />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
  },
});
