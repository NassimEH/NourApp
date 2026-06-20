export { supabase, isSupabaseConfigured } from "./client";
export {
  getCurrentUser,
  getSession,
  loginWithEmailPassword,
  registerWithEmail,
  loginWithGoogle,
  loginWithApple,
  logout,
  updateUserPassword,
} from "./auth";
export { getAuthenticatedUserId } from "./user-data";
export { syncUserDataWithCloud } from "./sync";
export type { AppUser } from "./types";
