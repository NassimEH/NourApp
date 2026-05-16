import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@nour_onboarding_complete";

export async function isOnboardingComplete(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(KEY);
    return value === "1";
  } catch {
    return false;
  }
}

export async function persistOnboardingComplete(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, "1");
  } catch (error) {
    if (__DEV__) {
      console.warn("[onboarding] persist failed", error);
    }
  }
}

/** @deprecated Utiliser persistOnboardingComplete via useOnboardingGate().markComplete */
export async function completeOnboarding(): Promise<void> {
  await persistOnboardingComplete();
}
