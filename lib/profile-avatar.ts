/**
 * Photo de profil stockée localement (sans Appwrite, sans AsyncStorage).
 * L'image est copiée dans le répertoire documents de l'app (chemin fixe).
 */

import * as FileSystem from "expo-file-system/legacy";

const AVATAR_FILENAME = "profile_avatar.jpg";

function avatarPath(): string {
  return `${FileSystem.documentDirectory}${AVATAR_FILENAME}`;
}

/** Retourne l'URI de la photo de profil si le fichier existe, sinon null. */
export async function getProfileAvatarUri(): Promise<string | null> {
  try {
    const path = avatarPath();
    const info = await FileSystem.getInfoAsync(path, { size: false }).catch(() => null);
    return info?.exists ? path : null;
  } catch {
    return null;
  }
}

/**
 * Enregistre la photo de profil à partir d'une URI locale (ex. retour ImagePicker).
 * Copie le fichier dans le répertoire documents. Retourne la nouvelle URI ou null.
 */
export async function setProfileAvatarUri(localUri: string): Promise<string | null> {
  try {
    const destUri = avatarPath();
    await FileSystem.copyAsync({ from: localUri, to: destUri });
    return destUri;
  } catch (e) {
    console.error("setProfileAvatarUri", e);
    return null;
  }
}
