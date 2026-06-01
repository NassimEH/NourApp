# Plan d'amélioration — NourApp



Légende : `[ ]` à faire · `[OK]` fait



---



## Priorité haute — dette & stabilité



- [OK] Retirer les appels debug `fetch` vers `127.0.0.1:7475` dans `QuranAudioContext.tsx`

- [OK] Renommer le projet dans `package.json` (`restate` → `nourapp`)

- [OK] Mettre à jour le `README.md` (NourApp islamique, plus immobilier)

- [OK] Auth Supabase (remplace Appwrite) — `lib/supabase/`, sign-in / sign-up

- [OK] Retirer `"use client"` inutile dans `qibla.tsx`



## Priorité haute — UX factice



- [OK] Brancher les onglets **Aujourd'hui** / **Parcours** dans Apprendre

- [OK] Remplacer les stats fictives dans `apprendre-stats.tsx`

- [OK] Corriger l'encodage des libellés cassés dans `apprendre-stats.tsx`



## Priorité haute — cohérence UI



- [OK] Migrer `apprendre.tsx` vers `useAppTheme()`

- [OK] Migrer `profile/favorites.tsx` vers `useAppTheme()`

- [OK] i18n : textes en dur sur l'**accueil** (`index.tsx`)

- [OK] i18n : hub **Bibliothèque** (`coran/index.tsx`)

- [OK] i18n : onglets **Écoute** (`explore.tsx`)



## Priorité moyenne — UI / UX (standardisation)



### Grille & espacements



- [OK] Grille dans `lib/ui/spacing.ts` (réexport `constants/screen-layout.ts`)

- [OK] Nettoyage accueil : styles legacy supprimés (`index.tsx`)

- [ ] Remplacer marges / couleurs en dur sur écrans Coran restants (recitateurs, juz, invocations listes…)

- [OK] `SCREEN_EDGE_PADDING`, `SECTION_GAP`, `LIST_GAP`, `CARD_RADIUS`



### En-têtes



- [OK] `ScreenPageHeader` + RTL chevron + zones tactiles retour

- [OK] `ScreenStackLayout` / `PreferenceScreenLayout` pour sous-écrans outils

- [OK] `SectionHeader` sur Accueil, Bibliothèque, Apprendre (récentes), Écoute

- [OK] `useAppTypography()` sur Apprendre (onglets) et leçons (corps)



### Typographie & lisibilité



- [OK] Accueil : couleurs via `createHomeStyles` / thème (styles morts retirés)

- [OK] `bodyLineHeight` sur leçons Apprendre

- [OK] `bodyLineHeight` sur détail hadith

- [ ] `bodyLineHeight` sur détail invocations (dua)

- [OK] Liens « Voir tout » via `SectionHeader`



### Composants réutilisables



- [OK] `SectionHeader`, `ToolCard`, `ListRow` (profil + favoris)

- [ ] Migrer plus d'écrans Coran vers `ListRow` (listes hadith / invocations)

- [OK] `HomePrayerWeatherCarousel`

- [OK] Zones tactiles 44 pt : profil, explore (onglets), Apprendre (onglets), en-têtes



### Parcours écran par écran



- [OK] Accueil, Bibliothèque, Outils, Apprendre (partiel), Écoute (partiel)

- [OK] Profil (interligne, sadaqa → objectif, méthode horaires)

- [OK] Qibla (déjà thématisé via `createQiblaStyles`)

- [OK] Mosquée / Météo (thème dynamique — fond image conservé sur mosquée)

- [OK] Sourates + détail hadith thématisés



---



## Priorité moyenne — produit



- [OK] Mosquée, rappels, objectif hebdo, notifications, audio, mémorisation, zakat fitr



---



## Priorité moyenne — Outils



- [OK] Registre + 9 outils (zakat, dhikr, dates, prière, sadaqa, 99 noms, Qibla, **guide héritage**)

- [OK] Héritage islamique — écran éducatif `inheritance-guide.tsx` (sans calculateur)



---



## Priorité moyenne — i18n & contenu



- [OK] Prophètes EN/AR, bibliothèque, RTL Apprendre, outils FR/EN/AR

- [OK] Parcours Piliers FR/EN/AR



## Priorité moyenne — qualité



- [OK] Tests, CI, carousel, accessibilité outils

- [OK] Checklist captures : `docs/ui-screenshots.md` (captures manuelles à produire)



## Priorité basse — stratégique



- [OK] Décisions documentées : `docs/PRODUCT.md` (Supabase Auth, sync, Ramadan, héritage…)

- [OK] Méthode horaires MWL / UOIF

- [OK] 2e parcours Apprendre — **Les piliers de l'Islam** (3 leçons) + sélecteur de parcours

- [OK] Favoris unifiés (duas, hadiths, Coran) — `useUnifiedFavorites` + écran profil

- [OK] Téléchargement hors-ligne récitations — préférence + écran « bientôt » (`offline-recitations.tsx`)

- [OK] Mode Ramadan — bannière accueil si mois hijri 9 (`HomeRamadanBanner`)



---



*Dernière mise à jour : parcours Piliers, favoris unifiés, Ramadan, hors-ligne (stub), guide héritage, thème sourates/hadith/mosquée/météo.*

