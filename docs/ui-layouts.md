# Layouts UI Louma

Guide court pour choisir le bon shell d’écran.

## Quand utiliser quoi

| Layout / composant | Usage |
|---|---|
| `ToolScreenLayout` | Outils plats (zakat, dhikr, asma, convertisseur…) |
| `PreferenceScreenLayout` | Écrans de réglages / listes options (thème, langue, rappels) |
| `ScreenStackLayout` | Stack standard avec header + scroll (préférer aux copies SafeArea+Header) |
| `ScreenPageHeader` | Titre + sous-titre ; back **à gauche** (LTR), actions à droite |
| `ListRow` | Ligne de liste interactive (hadiths, récitateurs, library shortcuts) |
| `EmptyState` | Liste vide (message + CTA optionnel) |
| `ErrorState` | Erreur chargement + retry |
| `ScreenSearchBar` | Recherche unifiée (sourates, hadiths, invocations, recherche Coran) |

## Tokens

Voir [`lib/ui/spacing.ts`](../lib/ui/spacing.ts) :

- `SPACE` — grille 8–32
- `CARD_RADIUS` (16), `CHIP_RADIUS` (12), `GLASS_RADIUS` (20), `PILL_RADIUS` (32)
- `SHADOW.light` / `SHADOW.dark`
- `SCREEN_EDGE_PADDING` = 28 ([`constants/screen-layout.ts`](../constants/screen-layout.ts))

## Typo

- UI : Plus Jakarta Sans
- Arabe (Coran / duas / hadiths) : Amiri (`Amiri_400Regular` / `Amiri_700Bold`) via `AppText variant="arabic"` ou `fontFamily` Amiri
- Tailles : `useAppTypography()` / `AppText` — respecter la préférence profil

## IA navigation

- **Accueil** : hero bienvenue + prière/météo → continuer → hadith → outils
- **Mes prières** : lieu / mosquée → checklist → Qibla
- **Bibliothèque** : lecture (texte, hadiths, duas)
- **Écoute** : audio uniquement (récitateurs, lecture)
