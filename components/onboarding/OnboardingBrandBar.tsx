import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

type Props = {
  onSkip: () => void;
  skipDisabled?: boolean;
};

export function OnboardingBrandBar({ onSkip, skipDisabled }: Props) {
  const colors = useAppTheme();
  const { t, rtlTextStyle } = useTranslation();

  return (
    <View style={styles.bar}>
      <Text style={[styles.brand, rtlTextStyle, { color: colors.text }]}>
        {t("auth.brand")}
      </Text>
      <TouchableOpacity
        onPress={onSkip}
        hitSlop={12}
        activeOpacity={0.65}
        disabled={skipDisabled}
        style={styles.skipBtn}
      >
        <Text style={[styles.skip, rtlTextStyle, { color: colors.text }]}>
          {t("onboarding.skip")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: SCREEN_EDGE_PADDING,
    paddingTop: 6,
    paddingBottom: 2,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans-ExtraBold",
    letterSpacing: 1.1,
    textAlign: "center",
  },
  skipBtn: {
    position: "absolute",
    right: SCREEN_EDGE_PADDING,
    top: 10,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  skip: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Medium",
  },
});
