import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type TextStyle,
} from "react-native";
import { AppIcon } from "@/components/AppIcon";

import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { MIN_TOUCH_TARGET } from "@/lib/ui/spacing";

interface PreferenceOptionRowProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  description?: string;
  descriptionStyle?: StyleProp<TextStyle>;
}

export function PreferenceOptionRow({
  label,
  selected,
  onPress,
  description,
  descriptionStyle,
}: PreferenceOptionRowProps) {
  const colors = useAppTheme();
  const typography = useAppTypography();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={styles.wrap}
    >
      <View style={styles.headerRow}>
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
      </View>
      {description ? (
        <Text
          style={[
            styles.description,
            descriptionStyle,
            { color: colors.textMuted },
          ]}
        >
          {description}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    alignSelf: "stretch",
    minHeight: MIN_TOUCH_TARGET,
    paddingVertical: 12,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  label: {
    flex: 1,
    fontSize: 17,
    fontFamily: "PlusJakartaSans-Medium",
  },
  description: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 20,
    marginTop: 6,
  },
});

export default PreferenceOptionRow;
