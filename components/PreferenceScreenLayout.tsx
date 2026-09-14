import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { ScreenStackLayout } from "@/components/ScreenStackLayout";

export { PreferenceOptionDivider } from "@/components/PreferenceOptionDivider";

interface PreferenceScreenLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}

export function PreferenceScreenLayout({
  title,
  subtitle,
  children,
  contentStyle,
}: PreferenceScreenLayoutProps) {
  return (
    <ScreenStackLayout
      title={title}
      subtitle={subtitle}
      variant="preference"
      contentContainerStyle={contentStyle}
      wrapChildren={(kids) => <View style={styles.optionsList}>{kids}</View>}
    >
      {children}
    </ScreenStackLayout>
  );
}

const styles = StyleSheet.create({
  optionsList: {
    width: "100%",
    alignSelf: "stretch",
  },
});
