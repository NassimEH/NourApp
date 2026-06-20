import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useGlobalContext } from "@/lib/global-provider";
import { useOnboardingGate } from "@/lib/onboarding-gate";

/** Point d'entrée : route vers l'app, l'onboarding ou la connexion. */
export default function IndexScreen() {
  const { loading, isLogged, isGuest } = useGlobalContext();
  const { hydrated, isComplete } = useOnboardingGate();

  if (loading || !hydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
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
    backgroundColor: "transparent",
  },
});
