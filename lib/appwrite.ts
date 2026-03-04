import {
  Client,
  Account,
  ID,
  Databases,
  OAuthProvider,
  Avatars,
  Query,
  Storage,
} from "react-native-appwrite";
import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";

export const config = {
  platform: "com.jsm.restate",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  galleriesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
  reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
  agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID,
  propertiesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
  bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID,
};

export const client = new Client();
client
  .setEndpoint(config.endpoint ?? "")
  .setProject(config.projectId ?? "")
  .setPlatform(config.platform);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export async function login() {
  try {
    const redirectUri = Linking.createURL("/");

    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );
    if (!response) throw new Error("Create OAuth2 token failed");

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    );
    if (browserResult.type !== "success")
      throw new Error("Create OAuth2 token failed");

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();
    if (!secret || !userId) throw new Error("Create OAuth2 token failed");

    const session = await account.createSession(userId, secret);
    if (!session) throw new Error("Failed to create session");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function logout() {
  try {
    const result = await account.deleteSession("current");
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getCurrentUser() {
  if (!config.endpoint || !config.projectId) return null;
  try {
    const result = await account.get();
    if (result.$id) {
      let avatarUrl: string;
      try {
        const prefs = await account.getPrefs<{ avatar?: string }>();
        if (prefs?.avatar && typeof prefs.avatar === "string") {
          avatarUrl = prefs.avatar;
        } else {
          const name = result.name ?? result.email ?? "Utilisateur";
          const initials = name.slice(0, 2).toUpperCase();
          avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=128&background=3d6b47&color=fff`;
        }
      } catch {
        const name = result.name ?? result.email ?? "Utilisateur";
        const initials = name.slice(0, 2).toUpperCase();
        avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=128&background=3d6b47&color=fff`;
      }
      return {
        ...result,
        avatar: avatarUrl,
      };
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

/** Upload une image (URI locale) vers le bucket et retourne l'URL de vue, ou null en cas d'erreur. */
export async function uploadAvatarPhoto(localUri: string): Promise<string | null> {
  const bucketId = config.bucketId;
  if (!bucketId || !config.endpoint) return null;
  try {
    const info = await FileSystem.getInfoAsync(localUri, { size: true });
    const size = info.size ?? 0;
    const fileId = ID.unique();
    const file = {
      name: "avatar.jpg",
      type: "image/jpeg",
      size,
      uri: localUri,
    };
    await storage.createFile(
      bucketId,
      fileId,
      file,
      ['read("any")']
    );
    const viewUrl = `${config.endpoint.replace(/\/$/, "")}/storage/buckets/${bucketId}/files/${fileId}/view`;
    return viewUrl;
  } catch (error) {
    console.error("uploadAvatarPhoto", error);
    return null;
  }
}

/** Enregistre l'URL de l'avatar dans les préférences du compte. */
export async function updateUserAvatar(avatarUrl: string): Promise<boolean> {
  try {
    const prefs = await account.getPrefs<Record<string, unknown>>().catch(() => ({}));
    await account.updatePrefs({ ...prefs, avatar: avatarUrl });
    return true;
  } catch (error) {
    console.error("updateUserAvatar", error);
    return false;
  }
}

/** Change le mot de passe du compte connecté. Nouveau mot de passe + ancien requis (sauf OAuth). */
export async function updateUserPassword(
  newPassword: string,
  oldPassword: string
): Promise<boolean> {
  try {
    await account.updatePassword(newPassword, oldPassword);
    return true;
  } catch (error) {
    console.error("updateUserPassword", error);
    return false;
  }
}

export async function getLatestProperties() {
  if (!config.databaseId || !config.propertiesCollectionId) return [];
  try {
    const result = await databases.listDocuments(
      config.databaseId,
      config.propertiesCollectionId,
      [Query.orderAsc("$createdAt"), Query.limit(5)]
    );
    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getProperties({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}) {
  if (!config.databaseId || !config.propertiesCollectionId) return [];
  try {
    const buildQuery = [Query.orderDesc("$createdAt")];

    if (filter && filter !== "All")
      buildQuery.push(Query.equal("type", filter));

    if (query)
      buildQuery.push(
        Query.or([
          Query.search("name", query),
          Query.search("address", query),
          Query.search("type", query),
        ])
      );

    if (limit) buildQuery.push(Query.limit(limit));

    const result = await databases.listDocuments(
      config.databaseId,
      config.propertiesCollectionId,
      buildQuery
    );
    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// write function to get property by id
export async function getPropertyById({ id }: { id: string }) {
  if (!config.databaseId || !config.propertiesCollectionId) return null;
  try {
    const result = await databases.getDocument(
      config.databaseId,
      config.propertiesCollectionId,
      id
    );
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}
