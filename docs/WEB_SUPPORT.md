# Support web — Louma

Louma cible **iOS / Android** (Expo). Le build web (`expo start --web`) est utile pour le debug UI, avec des limites.

## Fonctionne en général

- Navigation expo-router, thèmes, i18n
- Auth Supabase (session AsyncStorage sur web ; SecureStore natif uniquement)
- Lecture Coran (texte), hadiths, invocations, Apprendre
- Favoris locaux

## Limites / dégradé

| Feature | Web |
|---------|-----|
| Qibla (boussole / heading) | Non fiable ou indisponible |
| `usePrayersChecked` / notifs locales | Partiel — `expo-notifications` limité |
| Localisation fine | Dépend du navigateur / HTTPS |
| Audio Coran (`expo-av`) | Variable selon navigateur |
| Hors-ligne MP3 (`expo-file-system`) | Non supporté comme sur natif |
| Sign in with Apple | iOS natif uniquement |
| SecureStore | Fallback AsyncStorage |

## Recommandation

Documenter l’app store comme **mobile-first**. Ne pas promettre une expérience web complète tant que Qibla / notifs / offline ne sont pas validés sur navigateur.
