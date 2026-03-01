import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TAB_BAR_STORAGE_KEY = "@nour_tab_bar_variant";

export type TabBarVariant = "custom" | "native";

interface TabBarPreferenceContextType {
  tabBarVariant: TabBarVariant;
  setTabBarVariant: (v: TabBarVariant) => void;
}

const TabBarPreferenceContext = createContext<TabBarPreferenceContextType | undefined>(undefined);

export function TabBarPreferenceProvider({ children }: { children: React.ReactNode }) {
  const [tabBarVariant, setTabBarVariantState] = useState<TabBarVariant>("custom");

  useEffect(() => {
    if (Platform.OS === "web") return;
    AsyncStorage.getItem(TAB_BAR_STORAGE_KEY)
      .then((value) => {
        if (value === "native" || value === "custom") {
          setTabBarVariantState(value);
        }
      })
      .catch(() => {});
  }, []);

  const setTabBarVariant = useCallback((v: TabBarVariant) => {
    setTabBarVariantState(v);
    if (Platform.OS !== "web") {
      AsyncStorage.setItem(TAB_BAR_STORAGE_KEY, v).catch(() => {});
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
