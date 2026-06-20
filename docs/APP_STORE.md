# Déploiement App Store — Louma

Guide pas-à-pas pour publier l’app sur l’**App Store iOS** via **EAS Build** (Expo Application Services).

---

## Prérequis

| Élément | Action |
|---------|--------|
| **Compte Apple Developer** | [developer.apple.com](https://developer.apple.com) — 99 €/an |
| **Compte Expo** | [expo.dev](https://expo.dev) — gratuit pour builds limités |
| **Supabase (prod)** | Projet dédié production avec Auth configurée |
| **Politique de confidentialité** | URL publique obligatoire (App Store Connect) |

---

## 1. Lier le projet à EAS

```bash
npm install -g eas-cli
eas login
eas init
```

`eas init` crée le `projectId` dans `app.json` et lie le dépôt à votre compte Expo.

---

## 2. Secrets de build (variables d’environnement)

Les clés Supabase ne doivent **pas** être commitées. Configurez-les pour EAS :

```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://VOTRE-PROJET.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "VOTRE_CLE_ANON"
```

Vérifier :

```bash
eas secret:list
```

Pour le dev local, copiez `.env.example` vers `.env.local` et remplissez les mêmes valeurs.

---

## 3. Configurer Supabase Auth

### Redirect URLs (Authentication → URL Configuration)

Ajoutez :

- `louma://`
- `louma://**`
- `exp+louma://**` (preview / dev builds EAS)

### Google OAuth

1. Authentication → Providers → **Google** → activer
2. Configurer Client ID / Secret Google Cloud Console
3. Redirect URI Supabase copié dans Google Console

### Sign in with Apple (obligatoire App Store)

1. **Apple Developer** → Identifiers → App ID `com.louma.app` → activer **Sign In with Apple**
2. Créer une **Key** (.p8) avec Sign In with Apple
3. **Supabase** → Authentication → Providers → **Apple** :
   - Services ID (optionnel pour web)
   - Team ID, Key ID, contenu du fichier `.p8`
   - Bundle ID : `com.louma.app`

L’app inclut déjà le bouton natif Apple (`AppleSignInButton`) et `loginWithApple()` dans `lib/supabase/auth.ts`.

---

## 4. Build iOS production

```bash
npm run build:ios
# ou : eas build --platform ios --profile production
```

EAS gère certificats et profils de provisioning (répondez aux prompts la première fois).

Téléchargez le `.ipa` ou soumettez directement :

```bash
npm run submit:ios
# ou : eas submit --platform ios --profile production
```

---

## 5. App Store Connect

Créez l’app dans [App Store Connect](https://appstoreconnect.apple.com) :

| Champ | Valeur suggérée |
|-------|-----------------|
| **Nom** | Louma |
| **Bundle ID** | `com.louma.app` |
| **SKU** | `louma-ios` |
| **Catégorie** | Lifestyle ou Reference |
| **Politique de confidentialité** | URL de votre site |

### App Privacy (nutrition labels)

Déclarez au minimum :

- **Coordonnées** (e-mail) — authentification
- **Identifiants** — ID compte
- **Localisation** — horaires de prière (non suivie en continu si applicable)
- **Contenu utilisateur** — photo de profil (optionnelle)

### Chiffrement export

Déjà configuré dans `app.json` :

```json
"ITSAppUsesNonExemptEncryption": false
```

Répondez **Non** à la question export compliance dans App Store Connect (HTTPS standard uniquement).

### Captures d’écran

Checklist : `docs/ui-screenshots.md`. Tailles requises iPhone 6,7″ et 6,5″ minimum.

### Compte démo pour la review

Fournissez identifiants test **ou** indiquez que le **mode invité** permet d’explorer sans compte.

---

## 6. TestFlight

1. Soumettez le build via `eas submit`
2. Attendez le traitement (~15–30 min)
3. Testez sur iPhone réel : auth email, Apple, Google, prières, notifications locales
4. Ajoutez des testeurs internes dans TestFlight

---

## 7. Soumission review

1. Remplir description, mots-clés, captures
2. Sélectionner le build TestFlight
3. Soumettre pour review

Délai habituel : 24–48 h.

---

## Fichiers du projet (déjà préparés)

| Fichier | Rôle |
|---------|------|
| `eas.json` | Profils `development`, `preview`, `production` |
| `app.json` | Bundle ID, buildNumber, permissions iOS, plugins |
| `components/auth/AppleSignInButton.tsx` | Bouton Sign in with Apple |
| `lib/supabase/auth.ts` | `loginWithApple()`, session persistée |
| `.env.example` | Variables attendues |

### Scripts npm

```bash
npm run build:ios      # Build production iOS
npm run build:preview  # Build interne (TestFlight ad hoc)
npm run submit:ios     # Soumission App Store Connect
```

---

## Checklist finale

- [ ] `eas init` exécuté
- [ ] Secrets EAS Supabase configurés
- [ ] Apple Sign In activé (Apple Dev + Supabase)
- [ ] Google OAuth activé (Supabase + Google Cloud)
- [ ] Politique de confidentialité en ligne
- [ ] `eas build --platform ios --profile production` réussi
- [ ] TestFlight validé sur appareil réel
- [ ] Captures App Store (3 thèmes si possible)
- [ ] Fiche App Store Connect complète
- [ ] Soumission review

---

## Dépannage

| Problème | Piste |
|----------|-------|
| Auth ne persiste pas | Vérifier secrets EAS + `AsyncStorage` dans `lib/supabase/client.ts` |
| Apple Sign In échoue | Vérifier provider Apple Supabase + capability sur App ID |
| Google redirect error | Ajouter `louma://` dans Supabase redirect URLs |
| Build icon manquant | `assets/images/icon.png` doit exister (1024×1024 recommandé) |
| Rejet guideline 4.8 | Sign in with Apple doit être visible si Google est proposé |

---

## Android (Play Store)

Le même projet supporte Android (`com.louma.app`). Pour Google Play :

```bash
eas build --platform android --profile production
eas submit --platform android --profile production
```

Configurez un compte Google Play Console et les clés de signature (EAS peut les gérer).
