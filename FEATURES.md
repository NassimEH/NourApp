# Features à implémenter — NourApp

Légende : `[ ]` à faire · `[OK]` fait

**Règle :** à chaque feature livrée (code mergé / validé), cocher la ligne correspondante ici (`[ ]` → `[OK]`).

Dernière revue produit : juin 2026.

---

## Phase 0 — Polish & cohérence (rapide)

### UI / thème / i18n

- [OK] Remplacer couleurs en dur sur écrans Coran restants (`recitateurs`, `recherche`, placeholders…) → `useAppTheme()`
- [OK] `bodyLineHeight` sur détail invocations (`coran/invocations/dua/[slug]/[id].tsx`)
- [OK] Migrer listes hadith / invocations vers `ListRow` (comme favoris profil)
- [OK] i18n : écran **Recherche** (`recherche.tsx` — placeholder, hint)
- [OK] i18n : libellés durs sur lecteur sourate (`Chargement…`, `Réessayer`, etc.)
- [OK] i18n : sous-titres favoris unifiés (`useUnifiedFavorites.ts` — « Verset favori », etc.)
- [OK] i18n : noms des mois hijri sur accueil et onglet Mes prières (`HIJRI_MONTHS`)
- [OK] Uniformiser l’UI des accès Coran/Hadith/Invocations/Récitateurs avec un design system unique : listes et cards **flat**, fines, élégantes, espacements cohérents, hiérarchie typographique stable, bordures/rayons standardisés et composants réutilisables (`ListRow`, `SectionHeader`, cards) appliqués de manière homogène dans toute l’app

### Produit / données

- [OK] Progression Apprendre par parcours : clé `@learn_completed_{courseId}` (au lieu d’une liste globale unique)
- [OK] Clarifier ou fusionner écran **Traduction** (doublon avec lecteur `[number].tsx`)
- [OK] Cloche accueil : lien explicite vers rappels ou réglages notifications (système de logs avec dernières actions faites)

---

## Phase 1 — Fermer les coquilles Bibliothèque

### Visibilité & attentes utilisateur

- [OK] Badge **« Bientôt »** sur tuiles Bibliothèque non implémentées
- [OK] Masquer ou désactiver les entrées sans contenu (alternative au badge)

### Écrans placeholder → contenu ou redirection

- [OK] **Hadith du jour** — contenu réel (rotation quotidienne ; réutiliser données locales / API)
- [OK] **Hadiths par thème** — navigation vers collections ou filtres par sujet
- [OK] **Récitateurs** — liste depuis `AVAILABLE_RECITERS` + lien audio
- [OK] **Détail récitateur** — fiche + lancer écoute (contexte `QuranAudioContext`)
- [OK] **Player** (`player.tsx`) — brancher sur `QuranAudioContext` ou rediriger vers mini-player / lecteur
- [OK] **Recherche Coran** — v1 : recherche par nom / numéro de sourate (`useSuraList`)
- [OK] **Invocations matin & soir** — redirection vers catégories API (slugs) ou liste filtrée
- [OK] **Invocations météo** — redirection vers `meteo.tsx` et/ou `WEATHER_DOU3A` + catégories dua
- [OK] **Invocations sommeil** — redirection vers catégorie API ou liste locale
- [ ] **Tafsir** — v1 : lien externe par sourate/verset ou API tafsir
- [ ] **Traduction** — lien vers lecteur avec traduction activée (pas écran vide)

### Raccourcis intelligents

- [ ] Hub invocations : une seule entrée « Toutes » + raccourcis thématiques fonctionnels (plus d’écrans vides)

---

## Phase 1 — Features simples à fort impact

### Coran & écoute

- [OK] Copier / partager verset depuis le lecteur sourate (`Share` + `expo-clipboard`)
- [OK] Copier / partager sur détail **dua** (comme hadith)
- [OK] Toggle + choix langue traduction dans `[number].tsx` (sans écran Traduction séparé)
- [OK] Écran **Écoute** : cohérence des liens (éviter 3 chemins vers un player factice)

### Spirituel & quotidien

- [OK] **Ramadan** : écran ou section dédiée (imsak/iftar, rappels, invocations) — bannière accueil y mène
- [OK] **Vendredi** : carte accueil cliquable vers hadith complet + option notification
- [ ] **Invocations météo** : contenu depuis `constants/weather.ts` si pas seulement redirection

### Hadiths & invocations

- [OK] Hadith du jour : favori + partage (parité avec détail hadith)
- [ ] Thème hadith : au moins 3–5 thèmes avec liens vers chapitres / collections

### Apprendre

- [ ] Statistiques : objectifs personnalisés affichés (au-delà du hint « bientôt »)
- [ ] Statistiques : streak ou résumé visuel simple (semaine en cours)

### Rappels

- [OK] `reminders.tsx` : toggles actifs (hadith jour, leçon) via `expo-notifications`
- [ ] Rappel leçon Apprendre (notification quotidienne optionnelle)

---

## Phase 2 — Compte, sync & hors-ligne

### Supabase

- [ ] Tables + RLS : favoris (dua, hadith, quran)
- [ ] Tables + RLS : progression Apprendre par `courseId`
- [ ] Sync à la connexion : fusion favoris locaux ↔ cloud
- [ ] Sync à la connexion : fusion progression Apprendre
- [~] Message UX : « favoris locaux » vs « synchronisés » après login (bannière invité profil)

### Hors-ligne

- [ ] Téléchargement MP3 : 1–3 sourates pour le récitateur choisi
- [ ] Gestion stockage : liste téléchargements + suppression
- [ ] Écoute hors-ligne dans `QuranAudioContext` (fichiers locaux)

---

## Phase 3 — Enrichissement & différenciation

### Coran avancé

- [ ] Recherche Coran v2 : mot-clé dans les versets (API ou index local)
- [ ] Tafsir v2 : contenu embarqué dans l’app
- [ ] Compteur Juz lu / en cours (extension `getLastRead` + mémorisation)

### Prière

- [ ] Widget / Live Activity « prochaine prière » (iOS / Android — si scope natif)
- [ ] Son adhan optionnel pour notification prière

### Outils & profil

- [ ] Doublon « Prière du jour » (outil) vs onglet Mes prières : clarifier libellés ou fusionner
- [ ] Mode invité : texte clair sur ce qui reste local sans compte

### Qualité & release

- [ ] Captures App Store / Play Store (`docs/ui-screenshots.md`)
- [ ] Support web documenté (limites : `usePrayersChecked`, etc.)
- [ ] Tests e2e smoke sur parcours critique (prière → sourate → favori)

---

## Dette technique liée aux features

- [ ] CI : `npm run lint` vert (ESLint configuré)
- [ ] CI : `npx tsc --noEmit` vert
- [ ] Retirer ou implémenter toutes les routes Bibliothèque listées dans `coran/index.tsx`
- [OK] `player.tsx` : supprimer si remplacé par flux audio global

---

## Référence rapide — écrans encore « coquille »

| Route | Fichier | Action prévue |
|-------|---------|----------------|
| Hadith du jour | `hadith-jour.tsx` | Phase 1 |
| Hadiths thème | `hadiths-theme.tsx` | Phase 1 |
| Tafsir | `tafsir.tsx` | Phase 1 / 3 |
| Traduction | `traduction.tsx` | Phase 0 / 1 |
| Récitateurs | `recitateurs.tsx` | Phase 1 |
| Détail récitateur | `recitateur-detail.tsx` | Phase 1 |
| Player | `player.tsx` | Phase 1 |
| Recherche | `recherche.tsx` | Phase 1 / 3 |
| Invocations matin/soir | `invocations-matin-soir.tsx` | Phase 1 |
| Invocations météo | `invocations-meteo.tsx` | Phase 1 |
| Invocations sommeil | `invocations-sommeil.tsx` | Phase 1 |
| Rappels (info seule) | `reminders.tsx` | Phase 1 |

---

*Pour le plan dette / UI déjà en cours, voir aussi `ACTIONS.md` et `docs/PRODUCT.md`.*
