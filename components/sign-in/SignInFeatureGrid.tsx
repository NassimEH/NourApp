import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";

import { AppIcon, type AppIconName } from "@/components/AppIcon";
import { useAppTheme } from "@/lib/app-theme";

export type SignInFeatureItem = {
  icon: AppIconName;
  label: string;
};

type Props = {
  title: string;
  items: SignInFeatureItem[];
  titleStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

export function SignInFeatureGrid({
  title,
  items,
  titleStyle,
  containerStyle,
}: Props) {
  const colors = useAppTheme();

  return (
    <View style={[styles.wrap, containerStyle]}>
      <Text style={[styles.sectionTitle, titleStyle, { color: colors.text }]}>
        {title}
      </Text>
      <View style={styles.grid}>
        {items.map((item, index) => (
          <View
            key={item.label}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                shadowColor: colors.text,
              },
            ]}
          >
            <View style={styles.cardHighlight} pointerEvents="none" />
            <View
              style={[
                styles.iconCube,
                {
                  backgroundColor: `${colors.accent}16`,
                  borderColor: `${colors.accent}30`,
                },
              ]}
            >
              <AppIcon name={item.icon} size={22} color={colors.accent} />
            </View>
            <Text
              style={[styles.cardLabel, { color: colors.text }]}
              numberOfLines={2}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Bold",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 12,
    opacity: 0.85,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  card: {
    flexBasis: "47%",
    flexGrow: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    minHeight: 108,
    justifyContent: "space-between",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  cardHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.65)",
  },
  iconCube: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#191D31",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-SemiBold",
    lineHeight: 18,
  },
});
