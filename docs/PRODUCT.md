# Décisions produit — NourApp

## Compte & synchronisation (Supabase Auth)

- **Auth** : Supabase (`@supabase/supabase-js`) avec session persistée dans AsyncStorage.
- Variables : `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` dans `.env.local`.
- Connexion e-mail / mot de passe, inscription, Google OAuth (à activer dans le dashboard Supabase).
- **Mode invité** : exploration sans compte (données locales uniquement).
- Favoris / progression Apprendre : encore **locaux** ; sync cloud à brancher plus tard (tables + RLS).

## Parcours Apprendre

- **La vie des prophètes** (5 leçons + quiz).
- **Les piliers de l’Islam** (3 leçons introductives).

## Favoris unifiés

Profil → Favoris : duʿās, hadiths, Coran.

## Hors-ligne

Préférence + écran « bientôt » ; téléchargement audio à venir.

## Méthode horaires

MWL ou UOIF (API Aladhan).

## Ramadan

Bannière accueil si mois hijri 9.

## Héritage islamique

Guide éducatif sans calculateur juridique.
