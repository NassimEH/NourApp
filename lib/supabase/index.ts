export { supabase, isSupabaseConfigured } from "./client";
export {
  getCurrentUser,
  getSession,
  loginWithEmailPassword,
  registerWithEmail,
  loginWithGoogle,
  logout,
  updateUserPassword,
} from "./auth";
export type { AppUser } from "./types";
