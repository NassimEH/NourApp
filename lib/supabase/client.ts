import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** `true` lorsque URL + clé anon sont renseignées dans `.env.local`. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
const isBrowser = typeof window !== "undefined";

/**
 * Client Supabase (Auth + API).
 * Placeholders si les variables manquent — les appels auth échoueront jusqu'à configuration.
 */
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      storage: isBrowser ? AsyncStorage : undefined,
      autoRefreshToken: isBrowser,
      persistSession: isBrowser,
      detectSessionInUrl: isBrowser,
    },
  }
);
