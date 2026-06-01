# Nûr (NourApp)

Application mobile islamique construite avec **Expo** et **React Native**. Nûr regroupe lecture et écoute du Coran, horaires de prière, Qibla, hadiths, invocations, parcours d’apprentissage et une boîte à outils pratique (zakat, dhikr, dates hijriennes, etc.).

Interface en **français**, **anglais** et **arabe** (RTL), avec thème clair / sombre personnalisable.

---

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Onglets principaux](#onglets-principaux)
- [Outils](#outils)
- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Variables d’environnement](#variables-denvironnement)
- [Scripts npm](#scripts-npm)
- [Tests](#tests)
- [Structure du projet](#structure-du-projet)
- [Données & APIs externes](#données--apis-externes)
- [Compte utilisateur](#compte-utilisateur)
- [Documentation interne](#documentation-interne)
- [État du projet](#état-du-projet)

---

## Fonctionnalités

| Domaine | Contenu |
|--------|---------|
| **Prières** | Horaires (API Aladhan), méthode MWL ou UOIF, Qibla, suivi des prières cochées, rappels / notifications |
| **Coran** | Liste des sourates, lecture par verset, traduction, tafsir, recherche, favoris, dernière lecture |
| **Audio** | Écoute par récitateur, mini-lecteur, progression sauvegardée, écran Juz / récitateurs |
| **Hadiths** | Collections (ex. Boukhari), navigation livre / chapitre, détail, favoris, partage |
| **Invocations** | Catégories de duʿās, détail, favoris, thématiques (matin/soir, météo, sommeil) |
| **Apprendre** | Parcours avec leçons et quiz : *La vie des prophètes* et *Les piliers de l’Islam* ; objectif hebdomadaire ; stats |
| **Accueil** | Calendrier de la semaine, carousel prière + météo, hadith du vendredi, reprise lecture/écoute, bannière Ramadan (mois hijri 9) |
| **Profil** | Thème, langue, taille du texte, couleur d’accent, style de barre d’onglets (native / classique / liquid glass), favoris unifiés |

**Compte optionnel (Supabase Auth)** : connexion e-mail / mot de passe, inscription ou Google. **Mode invité** sans compte. Leçons, favoris et préférences restent **locaux** pour l’instant (sync cloud à venir).

---

## Onglets principaux

Six onglets dans la barre de navigation (`app/(root)/(tabs)/`) :

| Onglet | Route | Rôle |
|--------|-------|------|
| **Accueil** | `index` | Vue d’ensemble : prières, météo, outils, continuer |
| **Mes prières** | `qibla` | Boussole Qibla + accès aux horaires |
| **Bibliothèque** | `coran` | Hub Coran, hadiths, invocations, mémorisation |
| **Apprendre** | `apprendre` | Aujourd’hui / Parcours, sourates récentes |
| **Écoute** | `explore` | Récitateurs, sourates populaires, Juz |
| **Profil** | `profile` | Réglages, favoris, notifications, mosquée |

Écrans modaux ou stack courants (hors onglets) : mosquée, météo, rappels, leçons (`apprendre/lecon/[id]`), lecteur audio, écrans outils sous `app/(root)/`.

---

## Outils

Les outils sont déclarés dans `lib/tools/tools-registry.ts` et affichés sur l’accueil (`HomeToolsSection`) :

1. **Zakat al-Fitr** — estimateur par personne / pays indicatifs  
2. **Zakat al-mal** — rappels sur la zakat de richesse  
3. **Dhikr** — compteur de invocations  
4. **Convertisseur de dates** — grégorien ↔ hijri  
5. **Résumé des prières** — horaires du jour  
6. **Objectif sadaqa** — suivi d’objectif de dons  
7. **99 noms d’Allah** — liste pour méditation  
8. **Qibla & prières** — raccourci vers l’onglet prières  
9. **Héritage islamique** — guide **éducatif** uniquement (pas de calculateur juridique)

---

## Stack technique

| Couche | Technologies |
|--------|----------------|
| Framework | Expo SDK 54, React Native 0.81, React 19 |
| Navigation | Expo Router 6 (file-based) |
| Langage | TypeScript |
| Styles | NativeWind 4 / Tailwind 3 + `StyleSheet` thématisé |
| UI | Composants maison (`ScreenPageHeader`, `ListRow`, `LiquidTabBar`, etc.) |
| Effets | `expo-blur`, `expo-glass-effect` (barre liquid glass sur iOS) |
| Audio | `expo-av` + `QuranAudioContext` |
| Localisation | `expo-location`, notifications `expo-notifications` |
| Persistance | AsyncStorage (session Supabase + préférences) + fichiers locaux (avatar) |
| Auth | Supabase (`lib/supabase/`) — `@supabase/supabase-js` |
| Dates hijri | `hijri-converter` |

---

## Prérequis

- **Node.js** 18+ (LTS recommandé)  
- **npm** ou **yarn**  
- Pour tester sur appareil : [Expo Go](https://expo.dev/go) ou un simulateur iOS / émulateur Android avec le dev client Expo  

Permissions utiles en développement : **localisation** (horaires, météo, Qibla), **notifications** (rappels de prière).

---

## Installation

```bash
git clone <url-du-repo>
cd NourApp
npm install
```

Puis lancer :

```bash
# Expo Go sur téléphone (QR code)
npm run start:go

# Serveur de dev classique
npm run start

# Tunnel (réseau restrictif)
npm run start:tunnel

# Plateforme ciblée
npm run ios
npm run android
npm run web
```

Au premier lancement : **onboarding** → **connexion** (ou mode invité). Voir `lib/onboarding-gate.tsx` et `lib/global-provider.tsx`.

---

## Variables d’environnement

Copier `.env.example` vers `.env.local` :

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_SUPABASE_URL` | URL du projet (Supabase → Settings → API) |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Clé **anon** publique |

Sans ces variables, l’app affiche un message sur les écrans de connexion ; le **mode invité** reste utilisable.

Les APIs Coran, hadiths et prières ne nécessitent pas de clé supplémentaire.

**Google OAuth** : activer le fournisseur Google dans Supabase Auth et ajouter l’URL de redirection `nourapp://` (schéma dans `app.json`).

---

## Scripts npm

| Commande | Action |
|----------|--------|
| `npm run start` | Démarre Expo |
| `npm run start:go` | Expo avec ouverture Expo Go |
| `npm run start:tunnel` | Expo en mode tunnel |
| `npm run ios` / `android` / `web` | Lance sur la plateforme |
| `npm run lint` | ESLint (Expo) |
| `npm test` | Jest en mode watch |
| `npx jest --watchAll=false` | Tests une fois (CI / vérif rapide) |

---

## Tests

Tests unitaires Jest (`jest-expo`) :

- `__tests__/learn-progress.test.ts` — déverrouillage et complétion des leçons  
- `__tests__/persist-last-listen.test.ts` — persistance de la dernière écoute  

```bash
npx jest --watchAll=false
```

---

## Structure du projet

```
app/                          # Routes Expo Router
  (root)/(tabs)/              # Onglets : accueil, qibla, coran, apprendre, explore, profile
  (root)/                     # Outils, mosquée, météo, leçons, offline, etc.
  onboarding.tsx, sign-in.tsx, sign-up.tsx  # Premier lancement & auth Supabase

components/                   # UI réutilisable
  home/                       # Accueil (carousel, outils, Ramadan, continuer)
  quran/, hadith/, dua/       # Listes et skeletons
  ScreenPageHeader, ListRow, LiquidTabBar, …

lib/                          # Logique métier
  quran/                      # API AlQuran Cloud, audio, favoris, cache
  hadith/                     # API hadith, favoris
  dua/                        # Invocations
  learn/                      # Parcours, leçons, quiz, progression
  favorites/                  # Favoris unifiés (dua + hadith + coran)
  tools/                      # Registre des outils
  i18n/                       # Traductions FR / EN / AR
  app-theme.ts                # Thème clair (#F0EEE6) / sombre (#333333)
  supabase/                   # Client + auth Supabase
  local-profile.ts            # Profil mode invité
  usePrayerTimes.ts           # Aladhan + méthode MWL/UOIF
  notifications/              # Rappels de prière
  seasonal/ramadan.ts         # Détection mois Ramadan

constants/                    # Layout, assets météo, etc.
assets/                       # Images, polices (Plus Jakarta Sans)
docs/                         # PRODUCT.md, checklist captures UI
__tests__/                    # Tests Jest
ACTIONS.md                    # Plan d’amélioration et statut des tâches
```

Alias TypeScript `@/` → racine du projet (voir `tsconfig.json`).

---

## Données & APIs externes

| Service | Usage dans l’app |
|---------|------------------|
| [Aladhan](https://aladhan.com/prayer-times-api) | Horaires de prière (méthode configurable) |
| [AlQuran Cloud](https://alquran.cloud/api) | Texte du Coran, traductions, audio des récitations |
| API hadith / duʿā | Chargement via modules `lib/hadith`, `lib/dua` |
| Météo | Coordonnées GPS → prévisions (`lib/useWeather.ts`) |
| Qibla | Calcul de l’azimut (`lib/useQiblaBearing.ts`) |

Le mode **hors-ligne** des récitations est prévu (`offline-recitations.tsx`, préférence AsyncStorage) ; le téléchargement effectif des fichiers audio n’est pas encore implémenté.

---

## Compte utilisateur

- **Supabase Auth** : `lib/supabase/auth.ts` (connexion, inscription, Google, déconnexion, mot de passe).
- **Invité** : pas de session ; photo de profil locale.
- Favoris / progression : encore locaux. Voir [docs/PRODUCT.md](./docs/PRODUCT.md).

---

## Documentation interne

| Fichier | Contenu |
|---------|---------|
| [ACTIONS.md](./ACTIONS.md) | Roadmap et tâches (`[OK]` / `[ ]`) |
| [docs/PRODUCT.md](./docs/PRODUCT.md) | Choix produit (auth, sync, héritage, Ramadan…) |
| [docs/ui-screenshots.md](./docs/ui-screenshots.md) | Checklist captures d’écran pour la doc visuelle |

---

## État du projet

Version **1.0.0** (`package.json` / `app.json`). Fonctionnalités principales livrées ; quelques écrans secondaires de la bibliothèque Coran utilisent encore des couleurs en dur (voir [ACTIONS.md](./ACTIONS.md)).

Améliorations possibles : cache audio hors-ligne, sync cloud optionnelle, migration complète des listes Coran vers `ListRow`, mise à jour de `docs/PRODUCT.md` pour refléter les livrables récents (Piliers, favoris unifiés, Ramadan).

---

Développé pour un usage personnel et communautaire. Pour toute contribution, commencer par lire `ACTIONS.md` et lancer `npm run lint` ainsi que `npx jest --watchAll=false` avant une pull request.
