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
import {
  ONBOARDING_MOCKUP_FRAME_HEIGHT,
  OnboardingPhoneMockup,
} from "@/components/onboarding/OnboardingPhoneMockup";
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

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right", "bottom"]}>
      <View style={[styles.topBar, rtlViewStyle]}>
        <TouchableOpacity
          onPress={() => void finish()}
          hitSlop={12}
          activeOpacity={0.7}
          disabled={finishing}
        >
          <Text style={[styles.skip, rtlTextStyle, { color: colors.textMuted }]}>
            {t("onboarding.skip")}
          </Text>
        </TouchableOpacity>
      </View>

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
                <Text
                  style={[
                    styles.slideBody,
                    rtlTextStyle,
                    { color: colors.textMuted },
                  ]}
                >
                  {t(`onboarding.${item.key}Body`)}
                </Text>
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
        <View style={styles.dots}>
          {ONBOARDING_SLIDES.map((slide, i) => (
            <View
              key={slide.key}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === index ? colors.accent : `${colors.textMuted}44`,
                  width: i === index ? 22 : 8,
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.primaryBtn,
            { backgroundColor: colors.accent, opacity: finishing ? 0.7 : 1 },
          ]}
          onPress={goNext}
          activeOpacity={0.85}
          disabled={finishing}
        >
          {finishing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.primaryBtnText}>
                {index === ONBOARDING_SLIDES.length - 1
                  ? t("onboarding.start")
                  : t("onboarding.next")}
              </Text>
              <AppIcon name="chevron-right" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "transparent",
  },
  topBar: {
    paddingHorizontal: SCREEN_EDGE_PADDING,
    paddingTop: 8,
    paddingBottom: 4,
    alignItems: "flex-end",
  },
  skip: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  listWrap: {
    flex: 1,
  },
  slide: {
    paddingHorizontal: SCREEN_EDGE_PADDING,
    paddingTop: 8,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  mockupWrap: {
    minHeight: ONBOARDING_MOCKUP_FRAME_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  slideScreenshot: {
    width: 268,
    height: 402,
    borderRadius: 28,
  },
  slideTitle: {
    fontSize: 24,
    fontFamily: "PlusJakartaSans-Bold",
    textAlign: "center",
    lineHeight: 30,
    marginBottom: 10,
  },
  slideBody: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Regular",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 320,
  },
  footer: {
    paddingHorizontal: SCREEN_EDGE_PADDING,
    paddingBottom: 28,
    gap: 22,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    minHeight: 52,
  },
  primaryBtnText: {
    fontSize: 17,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#fff",
  },
});
