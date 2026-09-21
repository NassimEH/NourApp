import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/lib/app-theme";
import { useGlobalContext } from "@/lib/global-provider";
import { useOnboardingGate } from "@/lib/onboarding-gate";
import { useTranslation } from "@/lib/i18n";
import { CARD_RADIUS, SPACE } from "@/lib/ui/spacing";

/** Point d'entrée : route vers l'app, l'onboarding ou la connexion. */
export default function IndexScreen() {
  const colors = useAppTheme();
  const { t } = useTranslation();
  const { loading, isLogged, isGuest } = useGlobalContext();
  const { hydrated, isComplete } = useOnboardingGate();

  if (loading || !hydrated) {
    return (
      <View
        style={[
          styles.loading,
          {
            backgroundColor: colors.usesBackgroundImage
              ? "transparent"
              : colors.background,
          },
        ]}
      >        <View
          style={[
            styles.loadingCard,
            {
              backgroundColor: colors.usesBackgroundImage
                ? "rgba(255,255,255,0.92)"
                : colors.cardElevated,
              borderColor: colors.border,
            },
          ]}
        >
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            {t("common.loading")}
          </Text>
        </View>
      </View>
    );
  }

  if (isLogged || isGuest) {
    return <Redirect href="/(root)/(tabs)" />;
  }

  if (!isComplete) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/sign-in" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACE.lg,
  },
  loadingCard: {
    alignItems: "center",
    justifyContent: "center",
    gap: SPACE.sm,
    paddingVertical: SPACE.xl,
    paddingHorizontal: SPACE.xxl,
    borderRadius: CARD_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    minWidth: 160,
  },
  loadingText: {
    fontFamily: "PlusJakartaSans-Medium",
    fontSize: 14,
  },
});
