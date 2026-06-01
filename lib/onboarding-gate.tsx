import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  isOnboardingComplete as readOnboardingFromStorage,
  persistOnboardingComplete,
} from "@/lib/onboarding-storage";

/** Évite de réafficher l'onboarding dans la même session après complétion */
let sessionOnboardingComplete = false;

type OnboardingGateContextValue = {
  hydrated: boolean;
  isComplete: boolean;
  markComplete: () => Promise<void>;
  refresh: () => Promise<void>;
};

const OnboardingGateContext = createContext<OnboardingGateContextValue | undefined>(
  undefined
);

export function OnboardingGateProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [isComplete, setIsComplete] = useState(sessionOnboardingComplete);

  const refresh = useCallback(async () => {
    const stored = await readOnboardingFromStorage();
    const done = sessionOnboardingComplete || stored;
    sessionOnboardingComplete = done;
    setIsComplete(done);
    setHydrated(true);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const markComplete = useCallback(async () => {
    sessionOnboardingComplete = true;
    setIsComplete(true);
    setHydrated(true);
    await persistOnboardingComplete();
  }, []);

  const value = useMemo(
    () => ({ hydrated, isComplete, markComplete, refresh }),
    [hydrated, isComplete, markComplete, refresh]
  );

  return (
    <OnboardingGateContext.Provider value={value}>
      {children}
    </OnboardingGateContext.Provider>
  );
}

export function useOnboardingGate(): OnboardingGateContextValue {
  const ctx = useContext(OnboardingGateContext);
  if (!ctx) {
    throw new Error("useOnboardingGate must be used within OnboardingGateProvider");
  }
  return ctx;
}
