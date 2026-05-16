import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { AppIcon } from "@/components/AppIcon";
import { OnboardingPhoneMockup } from "@/components/onboarding/OnboardingPhoneMockup";
import { PrayersHomePreview } from "@/components/onboarding/previews/PrayersHomePreview";
import { useAppTheme } from "@/lib/app-theme";

const { width: SCREEN_W } = Dimensions.get("window");
const PHONE_SCALE = SCREEN_W < 360 ? 0.88 : 1;

type Props = {
  brand: string;
  tagline: string;
  brandStyle?: StyleProp<TextStyle>;
  taglineStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

export function SignInHero3D({
  brand,
  tagline,
  brandStyle,
  taglineStyle,
  containerStyle,
}: Props) {
  const colors = useAppTheme();
  const floatY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: -8,
          duration: 2400,
          useNativeDriver: true,
        }),
        Animated.timing(floatY, {
          toValue: 0,
          duration: 2400,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [floatY]);

  return (
    <View style={[styles.wrap, containerStyle]}>
      <View style={styles.brandBlock}>
        <View
          style={[
            styles.logoStack,
            {
              shadowColor: colors.accent,
            },
          ]}
        >
          <View
            style={[
              styles.logoGlow,
              { backgroundColor: `${colors.accent}22` },
            ]}
          />
          <View
            style={[
              styles.logoFace,
              {
                backgroundColor: colors.card,
                borderColor: `${colors.accent}55`,
              },
            ]}
          >
            <AppIcon name="sun" size={36} color={colors.accent} />
          </View>
        </View>
        <Text style={[styles.brand, brandStyle, { color: colors.text }]}>
          {brand}
        </Text>
        <Text style={[styles.tagline, taglineStyle, { color: colors.accent }]}>
          {tagline}
        </Text>
      </View>

      <Animated.View
        style={[
          styles.phoneStage,
          {
            transform: [
              { translateY: floatY },
              { scale: PHONE_SCALE },
              { perspective: 900 },
              { rotateX: "4deg" },
              { rotateZ: "-3deg" },
            ],
          },
        ]}
      >
        <View style={[styles.shadowPlate, styles.shadowFar]} />
        <View style={[styles.shadowPlate, styles.shadowMid]} />
        <View style={[styles.shadowPlate, styles.shadowNear]} />
        <OnboardingPhoneMockup>
          <PrayersHomePreview />
        </OnboardingPhoneMockup>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    marginBottom: 8,
  },
  brandBlock: {
    alignItems: "center",
    marginBottom: 20,
    zIndex: 2,
  },
  logoStack: {
    marginBottom: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  logoGlow: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  logoFace: {
    width: 76,
    height: 76,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#191D31",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  brand: {
    fontSize: 42,
    fontFamily: "PlusJakartaSans-ExtraBold",
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
    marginTop: 6,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 22,
  },
  phoneStage: {
    alignItems: "center",
    marginTop: 4,
  },
  shadowPlate: {
    position: "absolute",
    alignSelf: "center",
    backgroundColor: "#191D31",
    borderRadius: 28,
    opacity: 0.07,
  },
  shadowFar: {
    width: 248,
    height: 382,
    bottom: -18,
    transform: [{ scaleX: 1.04 }, { translateY: 14 }],
  },
  shadowMid: {
    width: 256,
    height: 390,
    bottom: -10,
    opacity: 0.05,
    transform: [{ scaleX: 1.02 }, { translateY: 8 }],
  },
  shadowNear: {
    width: 264,
    height: 396,
    bottom: -4,
    opacity: 0.04,
    transform: [{ translateY: 4 }],
  },
});
