import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export const ONBOARDING_PHONE_WIDTH = 268;
export const ONBOARDING_PHONE_HEIGHT = 402;

type Props = {
  children: ReactNode;
};

/** Cadre type iPhone pour les aperçus d’écran dans l’onboarding. */
export function OnboardingPhoneMockup({ children }: Props) {
  return (
    <View style={styles.shadowWrap}>
      <View style={styles.frame}>
        <View style={styles.content}>{children}</View>
        <View style={styles.notch} pointerEvents="none" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    shadowColor: "#191D31",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 10,
    marginBottom: 8,
  },
  frame: {
    width: ONBOARDING_PHONE_WIDTH,
    height: ONBOARDING_PHONE_HEIGHT,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "rgba(25, 29, 49, 0.1)",
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  content: {
    flex: 1,
  },
  notch: {
    position: "absolute",
    top: 10,
    alignSelf: "center",
    width: 72,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(25, 29, 49, 0.12)",
  },
});

export const ONBOARDING_MOCKUP_FRAME_HEIGHT = ONBOARDING_PHONE_HEIGHT + 8;
