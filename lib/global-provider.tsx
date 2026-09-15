import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { loadLocalUser, type LocalUser } from "./local-profile";
import { getCurrentUser, logout as supabaseLogout } from "./supabase/auth";
import { syncUserDataWithCloud } from "./supabase/sync";
import { supabase } from "./supabase/client";
import type { AppUser } from "./supabase/types";
import { translate } from "./i18n";
import { useAppPreferences } from "./app-preferences";

export type { AppUser };

/** Utilisateur affiché (session Supabase ou profil local invité). */
export type SessionUser = AppUser | LocalUser;

interface GlobalContextType {
  isLogged: boolean;
  user: SessionUser | null;
  loading: boolean;
  refetch: () => Promise<void>;
  isGuest: boolean;
  enterAsGuest: () => Promise<void>;
  /** Déconnexion complète — quitte aussi le mode invité */
  signOut: () => Promise<boolean>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const KEY_SYNC_PROMPT = "@louma_sync_prompt_done";

async function resolveGuestUser(): Promise<LocalUser> {
  return loadLocalUser();
}

async function promptAndMaybeSync(userId: string, locale: "fr" | "en" | "ar"): Promise<void> {
  try {
    const already = await AsyncStorage.getItem(`${KEY_SYNC_PROMPT}_${userId}`);
    if (already === "1") {
      void syncUserDataWithCloud(userId);
      return;
    }

    Alert.alert(
      translate(locale, "profile.syncLocalDataTitle"),
      translate(locale, "profile.syncLocalDataBody"),
      [
        {
          text: translate(locale, "profile.syncLocalDataSkip"),
          style: "cancel",
          onPress: () => {
            void AsyncStorage.setItem(`${KEY_SYNC_PROMPT}_${userId}`, "1");
          },
        },
        {
          text: translate(locale, "profile.syncLocalDataConfirm"),
          onPress: () => {
            void AsyncStorage.setItem(`${KEY_SYNC_PROMPT}_${userId}`, "1");
            void syncUserDataWithCloud(userId);
          },
        },
      ]
    );
  } catch {
    void syncUserDataWithCloud(userId);
  }
}

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const { locale } = useAppPreferences();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const syncPrompted = useRef<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const sessionUser = await getCurrentUser();
      if (sessionUser) {
        setUser(sessionUser);
        setIsGuest(false);
        if (syncPrompted.current !== sessionUser.id) {
          syncPrompted.current = sessionUser.id;
          void promptAndMaybeSync(sessionUser.id, locale);
        }
        return;
      }
      if (isGuest) {
        setUser(await resolveGuestUser());
      } else {
        setUser(null);
      }
    } catch {
      setUser(isGuest ? await resolveGuestUser() : null);
    } finally {
      setLoading(false);
    }
  }, [isGuest, locale]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      if (!isGuest) void refetch();
    });
    return () => subscription.unsubscribe();
  }, [isGuest, refetch]);

  const enterAsGuest = useCallback(async () => {
    setLoading(true);
    try {
      await supabaseLogout();
      setIsGuest(true);
      setUser(await resolveGuestUser());
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      const ok = await supabaseLogout();
      if (!ok) return false;
      setIsGuest(false);
      setUser(null);
      syncPrompted.current = null;
      return true;
    } finally {
      setLoading(false);
    }
  }, []);

  const isLogged = !isGuest && !!user && user.id !== "local";

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        user,
        loading,
        refetch,
        isGuest,
        enterAsGuest,
        signOut,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within GlobalProvider");
  }
  return context;
};

export default GlobalProvider;
