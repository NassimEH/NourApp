import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { AppIcon } from "@/components/AppIcon";

import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";

interface PreferenceOptionRowProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function PreferenceOptionRow({
  label,
  selected,
  onPress,
}: PreferenceOptionRowProps) {
  const colors = useAppTheme();
  const typography = useAppTypography();

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.label,
          { color: colors.text, fontSize: typography.bodyMedium },
        ]}
      >
        {label}
      </Text>
      {selected ? (
        <AppIcon name="check" size={22} color={colors.accent} />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 17,
    fontFamily: "PlusJakartaSans-Medium",
  },
});

export default PreferenceOptionRow;
