import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { loadLocalUser, type LocalUser } from "./local-profile";
import { getCurrentUser, logout as supabaseLogout } from "./supabase/auth";
import { syncUserDataWithCloud } from "./supabase/sync";
import { supabase } from "./supabase/client";
import type { AppUser } from "./supabase/types";

export type { AppUser };

/** Utilisateur affiché (session Supabase ou profil local invité). */
export type SessionUser = AppUser | LocalUser;

interface GlobalContextType {
  isLogged: boolean;
  user: SessionUser | null;
  loading: boolean;
  refetch: () => Promise<void>;
  isGuest: boolean;
  enterAsGuest: () => void;
  /** Déconnexion complète — quitte aussi le mode invité */
  signOut: () => Promise<boolean>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

async function resolveGuestUser(): Promise<LocalUser> {
  return loadLocalUser();
}

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const sessionUser = await getCurrentUser();
      if (sessionUser) {
        setUser(sessionUser);
        setIsGuest(false);
        void syncUserDataWithCloud(sessionUser.id);
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
  }, [isGuest]);

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

  const enterAsGuest = useCallback(() => {
    void (async () => {
      setLoading(true);
      try {
        await supabaseLogout();
        setIsGuest(true);
        setUser(await resolveGuestUser());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      const ok = await supabaseLogout();
      if (!ok) return false;
      setIsGuest(false);
      setUser(null);
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
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

export default GlobalProvider;
