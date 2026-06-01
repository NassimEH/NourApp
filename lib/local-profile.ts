/**
 * Profil utilisateur local (nom + photo sur disque).
 * Aucun compte cloud — tout reste sur l'appareil.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

import { getProfileAvatarUri } from "./profile-avatar";

const KEY_DISPLAY_NAME = "@profile_display_name";

export interface LocalUser {
  id: string;
  name: string;
  avatar: string;
}

export async function getDisplayName(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEY_DISPLAY_NAME);
  } catch {
    return null;
  }
}

export async function setDisplayName(name: string): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY_DISPLAY_NAME, name.trim());
  } catch {
    /* ignore */
  }
}

function fallbackAvatar(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=80`;
}

export async function loadLocalUser(): Promise<LocalUser> {
  const stored = await getDisplayName();
  const name = stored?.trim() || "Utilisateur";
  const avatarUri = await getProfileAvatarUri();
  return {
    id: "local",
    name,
    avatar: avatarUri ?? fallbackAvatar(name),
  };
}
