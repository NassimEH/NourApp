# Audit produit — actions priorisées

Légende : `[ ]` à faire · `[~]` en cours · `[OK]` fait

Dernière mise à jour : juin 2026. Source : audit complet Louma.

---

## Sprint 1 — Bibliothèque crédible (priorité haute)

- [OK] **P1** — Liste récitateurs depuis `AVAILABLE_RECITERS` (`recitateurs.tsx`)
- [OK] **P2** — Fiche récitateur + lancer écoute (`recitateur-detail.tsx` + `QuranAudioContext`)
- [OK] **P3** — Recherche Coran v1 : filtre nom / numéro sourate (`recherche.tsx`)
- [OK] **P4** — Fusionner `player.tsx` → redirection vers onglet Écoute (flux audio global)
- [OK] **P5** — Invocations matin/soir → catégories API (`invocations-matin-soir.tsx`)
- [OK] **P6** — Invocations sommeil → catégorie `doua-avant-dormir`
- [OK] **P7** — Invocations météo → contenu `WEATHER_DOU3A` + lien outil météo
- [OK] **P8** — Hadith du jour : rotation quotidienne (`hadith-jour.tsx`)
- [OK] **P9** — Hadiths par thème → liens collections API (`hadiths-theme.tsx`)
- [OK] **P10** — Retirer badges « Bientôt » sur tuiles désormais fonctionnelles (`coran/index.tsx`)

---

## Sprint 2 — Quotidien & engagement

- [OK] **P11** — Copier / partager verset depuis le lecteur (`[number].tsx`)
- [OK] **P12** — Carte hadith vendredi cliquable + écran détail (`index.tsx`, `hadith-friday.tsx`)
- [OK] **P13** — Rappels actifs : toggles hadith + leçon (`reminders.tsx`, `expo-notifications`)
- [OK] **P14** — Écran Ramadan dédié (imsak/iftar, invocations) — bannière y mène
- [OK] **P15** — Hadith du jour : favori + partage (parité détail hadith — partage/copie)
- [OK] **P16** — Cohérence Explore : récitateurs depuis `AVAILABLE_RECITERS`, raccourcis invocations filtrés

---

## Sprint 3 — Polish i18n & technique

- [OK] **P17** — i18n badge « Bientôt », Mecquoise/Médinoise, textes placeholders clés
- [OK] **P18** — Corriger tab bar native : `navigation.navigate` au lieu de `router.push` (`BottomBar.tsx`)
- [~] **P19** — Retirer couleurs en dur résiduelles (`#3d6b47`, `ACCENT` dans lecteur / invocations)
- [~] **P20** — CI lint : nettoyer warnings ESLint (58 → ~28 dans l'app)
- [OK] **P21** — Stats Apprendre multi-parcours (`apprendre-stats.tsx` — hook déprécié)
- [OK] **P22** — Choix langue traduction Coran dans le lecteur (badge FR/EN/AR + cache par langue)
- [OK] **P26** — Message UX mode invité (bannière profil)

---

## Sprint 4 — Compte, sync & release

- [ ] **P23** — Tables Supabase + RLS : favoris (dua, hadith, quran)
- [ ] **P24** — Tables Supabase + RLS : progression Apprendre par `courseId`
- [ ] **P25** — Sync locale ↔ cloud à la connexion
- [ ] **P26** — Message UX mode invité (local vs synchronisé)
- [ ] **P27** — Téléchargement MP3 hors-ligne (1–3 sourates)
- [ ] **P28** — Captures App Store / Play Store (`docs/ui-screenshots.md`)
- [ ] **P29** — Support web documenté (limites `usePrayersChecked`, Qibla)
- [ ] **P30** — Tests e2e smoke (prière → sourate → favori)

---

## Audit navigation (juin 2026)

Liens corrigés :

- [OK] `sourates.tsx` → `coran/juz` (écran **créé** — était 404)
- [OK] Profil : Sadaqa / hors-ligne pointaient vers Favoris par erreur
- [OK] Profil : chemins préférences `/(root)/(tabs)/profile/...`
- [OK] `apprendre-stats` → `/(root)/apprendre-stats`
- [OK] Carousel accueil météo/mosquée → `/(root)/meteo` et `/(root)/mosquee`
- [OK] Bannière Ramadan → `/(root)/ramadan`

Écrans existants (pas 404, contenu variable) : `tafsir` (CTA lecteur), `player` (redirect Écoute), `traduction` (CTA sourates).

---

## Référence — ce qui est déjà solide

- Coran : liste, lecteur, audio global, mini-player
- Hadiths : collections API, détail, favoris, copier/partager
- Invocations : hub catégories, détail dua, copier/partager
- Apprendre : 2 parcours, progression par `courseId`, objectif hebdo
- Thème / i18n FR-EN-AR, récitateur favori profil
- Auth Supabase, mode invité, favoris unifiés locaux

---

*Backlog détaillé : [`FEATURES.md`](FEATURES.md) · Plan historique : [`ACTIONS.md`](ACTIONS.md)*
