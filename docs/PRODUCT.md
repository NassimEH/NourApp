# Décisions produit — Louma

## Compte & synchronisation (Supabase Auth + Postgres)

- **Auth** : Supabase (`@supabase/supabase-js`) avec session persistée dans AsyncStorage.
- Variables : `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` dans `.env`.
- Connexion e-mail / mot de passe, inscription, Google OAuth, Sign in with Apple.
- **Mode invité** : données locales uniquement (pas de `user_id`).
- **Connecté** : sync automatique vers Postgres (voir `supabase/migrations/`).

### Tables Supabase (RLS activé)

| Table | Contenu |
|-------|---------|
| `profiles` | Nom, avatar URL |
| `user_preferences` | Thème, langue, récitateur, etc. (JSONB) |
| `user_favorites` | Favoris Coran / hadiths / duas |
| `lesson_completions` | Progression Apprendre |
| `quran_state` | Dernière lecture / écoute, sourates récentes |
| `worship_tools` | Dhikr, sadaqa, objectif hebdo |
| `prayer_daily_log` | Prières cochées par jour |
| `user_notification_prefs` | Toggles rappels |
| Storage `avatars` | Photos de profil |

Migration SQL : `supabase/migrations/20260303120000_louma_initial_schema.sql`  
→ à exécuter dans **Supabase → SQL Editor** si le MCP n’est pas lié au projet.

Sync au login : `lib/supabase/sync.ts` (`syncUserDataWithCloud`).

## Parcours Apprendre

- **La vie des prophètes** (5 leçons + quiz).
- **Les piliers de l’Islam** (3 leçons introductives).

## Favoris unifiés

Profil → Favoris : duʿās, hadiths, Coran — synchronisés si connecté.

## Hors-ligne

Cache API local (TTL) + cache AsyncStorage après sync cloud. Téléchargement audio à venir.

## Méthode horaires

MWL ou UOIF (API Aladhan).

## Ramadan

Bannière accueil si mois hijri 9.

## Héritage islamique

Guide éducatif sans calculateur juridique.
