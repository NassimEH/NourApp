import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** `true` lorsque URL + clé anon sont renseignées dans `.env.local`. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
const isWeb = Platform.OS === "web";
/** SSR Node (expo-router web) : pas de `window` — AsyncStorage planterait Metro. */
const isWebSsr = isWeb && typeof window === "undefined";

/**
 * Stockage auth : SecureStore sur natif (Keychain / Keystore),
 * AsyncStorage sur web (SecureStore indisponible).
 */
const AuthStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (isWebSsr) return null;
    if (isWeb) return AsyncStorage.getItem(key);
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return AsyncStorage.getItem(key);
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (isWebSsr) return;
    if (isWeb) {
      await AsyncStorage.setItem(key, value);
      return;
    }
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      await AsyncStorage.setItem(key, value);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (isWebSsr) return;
    if (isWeb) {
      await AsyncStorage.removeItem(key);
      return;
    }
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      await AsyncStorage.removeItem(key);
    }
  },
};

/**
 * Client Supabase (Auth + API).
 * Placeholders si les variables manquent — les appels auth échoueront jusqu'à configuration.
 *
 * Pas de `ws` ici : Metro le bundlerait dans React Native (API Node `stream`).
 * RN / navigateurs utilisent le `WebSocket` natif ; Jest n’a pas besoin de Realtime.
 */
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      storage: AuthStorage,
      autoRefreshToken: !isWebSsr,
      persistSession: !isWebSsr,
      detectSessionInUrl: isWeb && !isWebSsr,
      flowType: "pkce",
    },
  }
);
