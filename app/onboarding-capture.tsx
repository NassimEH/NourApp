/**
 * Page dev : ouvrir sur web puis `node scripts/capture-onboarding-web.mjs`
 * pour exporter les PNG dans assets/images/onboarding/.
 */
import { ScrollView, StyleSheet, View } from "react-native";
import { Redirect } from "expo-router";

import { OnboardingPhoneMockup } from "@/components/onboarding/OnboardingPhoneMockup";
import { ONBOARDING_SLIDES } from "@/constants/onboarding-slides";

export default function OnboardingCaptureScreen() {
  if (!__DEV__) return <Redirect href="/onboarding" />;

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      {ONBOARDING_SLIDES.map((slide) => {
        const Preview = slide.Preview;
        return (
          <View
            key={slide.key}
            nativeID={`onboarding-${slide.key}`}
            style={styles.captureBlock}
          >
            <OnboardingPhoneMockup>
              <Preview />
            </OnboardingPhoneMockup>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#e8ece8" },
  content: { padding: 24, gap: 32, alignItems: "center" },
  captureBlock: { alignItems: "center" },
});
