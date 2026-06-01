import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import type { Session, User } from "@supabase/supabase-js";

import { getProfileAvatarUri } from "@/lib/profile-avatar";

import { isSupabaseConfigured, supabase } from "./client";
import type { AppUser } from "./types";

WebBrowser.maybeCompleteAuthSession();

function assertConfigured(): void {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured");
  }
}

function fallbackAvatar(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=80`;
}

function displayNameFromUser(user: User): string {
  const meta = user.user_metadata as Record<string, unknown> | undefined;
  const fullName =
    (typeof meta?.full_name === "string" && meta.full_name) ||
    (typeof meta?.name === "string" && meta.name) ||
    "";
  if (fullName.trim()) return fullName.trim();
  const email = user.email ?? "";
  const local = email.split("@")[0];
  return local || "Utilisateur";
}

async function mapSupabaseUser(user: User): Promise<AppUser> {
  const name = displayNameFromUser(user);
  const localAvatar = await getProfileAvatarUri();
  const meta = user.user_metadata as Record<string, unknown> | undefined;
  const remoteAvatar =
    typeof meta?.avatar_url === "string" ? meta.avatar_url : undefined;

  return {
    id: user.id,
    email: user.email ?? "",
    name,
    avatar: localAvatar ?? remoteAvatar ?? fallbackAvatar(name),
  };
}

export async function getCurrentUser(): Promise<AppUser | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const user = data.session?.user;
  if (!user) return null;
  return mapSupabaseUser(user);
}

export async function getSession(): Promise<Session | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function loginWithEmailPassword(
  email: string,
  password: string
): Promise<AppUser> {
  assertConfigured();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) throw error;
  if (!data.user) throw new Error("No user returned");
  return mapSupabaseUser(data.user);
}

export async function registerWithEmail(
  email: string,
  password: string,
  name: string
): Promise<AppUser> {
  assertConfigured();
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: name.trim(),
        name: name.trim(),
      },
    },
  });
  if (error) throw error;
  if (!data.user) throw new Error("No user returned");
  return mapSupabaseUser(data.user);
}

export async function loginWithGoogle(): Promise<AppUser | null> {
  assertConfigured();
  const redirectTo = Linking.createURL("/");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });
  if (error) throw error;
  if (!data.url) return null;

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== "success" || !result.url) return null;

  const hashParams = new URLSearchParams(result.url.split("#")[1] ?? "");
  const queryParams = new URLSearchParams(result.url.split("?")[1] ?? "");
  const accessToken =
    hashParams.get("access_token") ?? queryParams.get("access_token");
  const refreshToken =
    hashParams.get("refresh_token") ?? queryParams.get("refresh_token");

  if (!accessToken || !refreshToken) return null;

  const { data: sessionData, error: sessionError } =
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  if (sessionError) throw sessionError;
  if (!sessionData.user) return null;
  return mapSupabaseUser(sessionData.user);
}

export async function logout(): Promise<boolean> {
  if (!isSupabaseConfigured) return true;
  const { error } = await supabase.auth.signOut();
  return !error;
}

export async function updateUserPassword(newPassword: string): Promise<boolean> {
  assertConfigured();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return !error;
}

export { mapSupabaseUser };
