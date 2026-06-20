import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** `true` lorsque URL + clé anon sont renseignées dans `.env.local`. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
const isWeb = Platform.OS === "web";

/**
 * Realtime exige un transport WebSocket en Node < 22 (Jest/CI).
 * `enabled: false` ne suffit pas : le client Realtime est toujours instancié.
 */
function resolveRealtimeOptions(): { transport?: typeof WebSocket } | undefined {
  const isJest = process.env.JEST_WORKER_ID !== undefined;
  const isNode =
    typeof process !== "undefined" &&
    typeof process.versions?.node === "string";
  const isReactNative =
    typeof navigator !== "undefined" && navigator.product === "ReactNative";

  if (!isJest && (!isNode || isReactNative)) {
    return undefined;
  }

  if (isNode && !isJest) {
    const major = parseInt(process.versions.node!.split(".")[0] ?? "0", 10);
    if (major >= 22 && typeof WebSocket !== "undefined") {
      return undefined;
    }
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ws = require("ws") as typeof WebSocket;
    return { transport: ws };
  } catch {
    return undefined;
  }
}

const realtimeOptions = resolveRealtimeOptions();

/**
 * Client Supabase (Auth + API).
 * Placeholders si les variables manquent — les appels auth échoueront jusqu'à configuration.
 */
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: isWeb,
      flowType: "pkce",
    },
    ...(realtimeOptions ? { realtime: realtimeOptions } : {}),
  }
);
