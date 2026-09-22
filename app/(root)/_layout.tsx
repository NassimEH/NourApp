import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

import { useGlobalContext } from "@/lib/global-provider";
import { useOnboardingGate } from "@/lib/onboarding-gate";
import { useAppTheme } from "@/lib/app-theme";
import { QuranAudioProvider } from "@/lib/quran/QuranAudioContext";

/** Layout principal de l'app — doit toujours rendre un navigateur Stack. */
export default function AppLayout() {
  const router = useRouter();
  const colors = useAppTheme();
  const { loading, isLogged, isGuest } = useGlobalContext();
  const { hydrated, isComplete } = useOnboardingGate();

  useEffect(() => {
    if (loading || !hydrated) return;
    if (!isLogged && !isGuest) {
      router.replace(isComplete ? "/sign-in" : "/onboarding");
    }
  }, [loading, hydrated, isLogged, isGuest, isComplete, router]);

  return (
    <QuranAudioProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { flex: 1, backgroundColor: colors.background },
          animation: "default",
        }}
      />
    </QuranAudioProvider>
  );
}
