import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";

import { AppIcon } from "@/components/AppIcon";
import { AuthGradientBackdrop } from "@/components/auth/AuthGradientBackdrop";
import { AUTH_PILL_RADIUS } from "@/components/auth/auth-styles";
import {
  ONBOARDING_MOCKUP_FRAME_HEIGHT,
  OnboardingPhoneMockup,
} from "@/components/onboarding/OnboardingPhoneMockup";
import { OnboardingBrandBar } from "@/components/onboarding/OnboardingBrandBar";
import { ScreenBackground } from "@/components/ScreenBackground";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { ONBOARDING_SLIDES } from "@/constants/onboarding-slides";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { useOnboardingGate } from "@/lib/onboarding-gate";

const { width: SLIDE_WIDTH } = Dimensions.get("window");

export default function OnboardingScreen() {
  const colors = useAppTheme();
  const { t, rtlTextStyle, rtlViewStyle } = useTranslation();
  const { markComplete, isComplete } = useOnboardingGate();
  const listRef = useRef<FlatList<(typeof ONBOARDING_SLIDES)[number]>>(null);
  const [index, setIndex] = useState(0);
  const [finishing, setFinishing] = useState(false);

  const finish = useCallback(async () => {
    if (finishing) return;
    setFinishing(true);
    try {
      await markComplete();
      router.replace("/sign-in");
    } finally {
      setFinishing(false);
    }
  }, [finishing, markComplete]);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const i = Math.round(e.nativeEvent.contentOffset.x / SLIDE_WIDTH);
      if (i >= 0 && i < ONBOARDING_SLIDES.length) setIndex(i);
    },
    []
  );

  const goNext = useCallback(() => {
    if (index >= ONBOARDING_SLIDES.length - 1) {
      void finish();
      return;
    }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    listRef.current?.scrollToOffset({
      offset: nextIndex * SLIDE_WIDTH,
      animated: true,
    });
  }, [index, finish]);

  if (isComplete) return <Redirect href="/sign-in" />;

  const isLast = index === ONBOARDING_SLIDES.length - 1;

  return (
    <ScreenBackground style={styles.background}>
      <AuthGradientBackdrop />
      <SafeAreaView style={styles.safe} edges={["top", "left", "right", "bottom"]}>
        <OnboardingBrandBar
          onSkip={() => void finish()}
          skipDisabled={finishing}
        />

        <View style={styles.listWrap}>
          <FlatList
            ref={listRef}
            data={ONBOARDING_SLIDES}
            keyExtractor={(item) => item.key}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            bounces={false}
            onScrollToIndexFailed={() => {}}
            renderItem={({ item }) => {
              const Preview = item.Preview;
              return (
                <View style={[styles.slide, { width: SLIDE_WIDTH }]}>
                  {item.image ? (
                    <View style={styles.mockupWrap}>
                      <Image
                        source={item.image}
                        style={styles.slideScreenshot}
                        resizeMode="contain"
                        accessibilityIgnoresInvertColors
                      />
                    </View>
                  ) : (
                    <View style={styles.mockupWrap}>
                      <OnboardingPhoneMockup>
                        <Preview />
                      </OnboardingPhoneMockup>
                    </View>
                  )}

                  <Text
                    style={[styles.slideTitle, rtlTextStyle, { color: colors.text }]}
                  >
                    {t(`onboarding.${item.key}Title`)}
                  </Text>

                  <View
                    style={[styles.divider, { backgroundColor: colors.divider }]}
                  />

                  <View style={[styles.featureRow, rtlViewStyle]}>
                    <View style={styles.featureIcon}>
                      <AppIcon name={item.icon} size={18} color={colors.text} />
                    </View>
                    <Text
                      style={[
                        styles.slideBody,
                        rtlTextStyle,
                        { color: colors.text },
                      ]}
                    >
                      {t(`onboarding.${item.key}Body`)}
                    </Text>
                  </View>
                </View>
              );
            }}
            getItemLayout={(_, i) => ({
              length: SLIDE_WIDTH,
              offset: SLIDE_WIDTH * i,
              index: i,
            })}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              { backgroundColor: colors.text, opacity: finishing ? 0.7 : 1 },
            ]}
            onPress={goNext}
            activeOpacity={0.88}
            disabled={finishing}
          >
            {finishing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={[styles.primaryBtnInner, rtlViewStyle]}>
                <Text style={styles.primaryBtnText}>
                  {isLast ? t("onboarding.start") : t("onboarding.next")}
                </Text>
                <Text style={styles.primaryBtnChevron}>›</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.dots}>
            {ONBOARDING_SLIDES.map((slide, i) => (
              <View
                key={slide.key}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      i === index ? colors.text : `${colors.textMuted}40`,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safe: {
    flex: 1,
    backgroundColor: "transparent",
  },
  listWrap: {
    flex: 1,
  },
  slide: {
    paddingHorizontal: SCREEN_EDGE_PADDING,
    paddingTop: 4,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  mockupWrap: {
    minHeight: ONBOARDING_MOCKUP_FRAME_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  slideScreenshot: {
    width: 268,
    height: 402,
    borderRadius: 28,
  },
  slideTitle: {
    fontSize: 28,
    fontFamily: "PlusJakartaSans-Bold",
    textAlign: "center",
    lineHeight: 34,
    marginBottom: 18,
    maxWidth: 340,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
    maxWidth: 360,
    marginBottom: 4,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    width: "100%",
    maxWidth: 360,
    paddingTop: 12,
    paddingHorizontal: 2,
  },
  featureIcon: {
    width: 24,
    alignItems: "center",
    paddingTop: 2,
  },
  slideBody: {
    flex: 1,
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: SCREEN_EDGE_PADDING,
    paddingBottom: 24,
    paddingTop: 8,
    gap: 18,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  primaryBtn: {
    borderRadius: AUTH_PILL_RADIUS,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  primaryBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  primaryBtnText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#fff",
    letterSpacing: 0.2,
  },
  primaryBtnChevron: {
    fontSize: 22,
    color: "#fff",
    lineHeight: 22,
    marginTop: -1,
  },
});
