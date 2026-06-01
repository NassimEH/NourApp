/** Utilisateur affiché dans l'app (session Supabase + métadonnées). */
export interface AppUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
}
