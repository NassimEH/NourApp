import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TAB_BAR_STORAGE_KEY = "@nour_tab_bar_variant";

export type TabBarVariant = "custom" | "native" | "liquid";

interface TabBarPreferenceContextType {
  tabBarVariant: TabBarVariant;
  setTabBarVariant: (v: TabBarVariant) => void;
}

const TabBarPreferenceContext = createContext<TabBarPreferenceContextType | undefined>(undefined);

export function TabBarPreferenceProvider({ children }: { children: React.ReactNode }) {
  const [tabBarVariant, setTabBarVariantState] = useState<TabBarVariant>("custom");
  const hydrationPendingRef = useRef(true);

  useEffect(() => {
    if (Platform.OS === "web") {
      hydrationPendingRef.current = false;
      return;
    }
    AsyncStorage.getItem(TAB_BAR_STORAGE_KEY)
      .then((value) => {
        if (!hydrationPendingRef.current) return;
        if (value === "native" || value === "custom" || value === "liquid") {
          setTabBarVariantState(value);
        }
        hydrationPendingRef.current = false;
      })
      .catch(() => {
        hydrationPendingRef.current = false;
      });
  }, []);

  const setTabBarVariant = useCallback((v: TabBarVariant) => {
    hydrationPendingRef.current = false;
    setTabBarVariantState(v);
    if (Platform.OS !== "web") {
      void AsyncStorage.setItem(TAB_BAR_STORAGE_KEY, v);
    }
  }, []);

  return (
    <TabBarPreferenceContext.Provider value={{ tabBarVariant, setTabBarVariant }}>
      {children}
    </TabBarPreferenceContext.Provider>
  );
}

export function useTabBarPreference(): TabBarPreferenceContextType {
  const ctx = useContext(TabBarPreferenceContext);
  if (!ctx) {
    return {
      tabBarVariant: "custom",
      setTabBarVariant: () => {},
    };
  }
  return ctx;
}
