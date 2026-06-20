import * as AppleAuthentication from "expo-apple-authentication";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Crypto from "expo-crypto";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import type { Session, User } from "@supabase/supabase-js";

import { getProfileAvatarUri } from "@/lib/profile-avatar";

import { isSupabaseConfigured, supabase } from "./client";
import type { AppUser } from "./types";

WebBrowser.maybeCompleteAuthSession();

/** URI de retour OAuth — doit être listée dans Supabase (ex. `louma://**`). */
function getOAuthRedirectUri(): string {
  return makeRedirectUri({ scheme: "louma", path: "auth/callback" });
}

async function createSessionFromOAuthUrl(url: string): Promise<Session> {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) {
    throw new Error(params.error_description ?? errorCode);
  }

  const code = params.code;
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    if (!data.session) throw new Error("OAuth: session manquante après échange du code");
    return data.session;
  }

  const accessToken = params.access_token;
  const refreshToken = params.refresh_token;
  if (accessToken && refreshToken) {
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error) throw error;
    if (!data.session) throw new Error("OAuth: session manquante");
    return data.session;
  }

  throw new Error("OAuth: code ou jetons absents dans l'URL de retour");
}

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
  const redirectTo = getOAuthRedirectUri();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });
  if (error) throw error;
  if (!data.url) throw new Error("OAuth Google: URL d'autorisation manquante");

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type === "cancel" || result.type === "dismiss") return null;
  if (result.type !== "success" || !result.url) {
    throw new Error("OAuth Google: connexion interrompue");
  }

  const session = await createSessionFromOAuthUrl(result.url);
  if (!session.user) return null;
  return mapSupabaseUser(session.user);
}

/** Sign in with Apple (iOS natif) — requis App Store si Google OAuth est proposé. */
export async function loginWithApple(): Promise<AppUser | null> {
  assertConfigured();
  if (Platform.OS !== "ios") return null;

  const available = await AppleAuthentication.isAvailableAsync();
  if (!available) return null;

  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce
  );

  let credential: AppleAuthentication.AppleAuthenticationCredential;
  try {
    credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });
  } catch (e) {
    const code =
      e && typeof e === "object" && "code" in e
        ? String((e as { code: unknown }).code)
        : "";
    if (code === "ERR_REQUEST_CANCELED") return null;
    throw e;
  }

  if (!credential.identityToken) {
    throw new Error("Apple Sign In: missing identity token");
  }

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "apple",
    token: credential.identityToken,
    nonce: rawNonce,
  });
  if (error) throw error;
  if (!data.user) return null;

  const fullName = [
    credential.fullName?.givenName,
    credential.fullName?.familyName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (fullName) {
    await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        name: fullName,
      },
    });
  }

  return mapSupabaseUser(data.user);
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
