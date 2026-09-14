# Features à implémenter — Louma

Légende : `[ ]` à faire · `[~]` en cours / code prêt · `[OK]` fait

Dernière revue produit : septembre 2026 (chantier UI/UX P0–P3).

---

## Livré (cœur produit)

- [OK] Polish UI / thème / i18n, design system, ListRow
- [OK] Bibliothèque Coran / hadiths / invocations / récitateurs / audio
- [OK] Contenu multilingue hadiths (API FR/EN/AR) + jour/vendredi + favori
- [OK] Invocations EN + catégories AR
- [OK] Auth SecureStore, PKCE, réauth MDP, sync prompt, suppression compte (RPC)
- [OK] Tafsir v1 (lien externe), traduction / prière du jour / mosquée → redirects
- [OK] Hors-ligne MP3 (jusqu’à 3 sourates) + lecture locale
- [OK] Streak / semaine Apprendre
- [OK] Recherche Coran v2 (versets via AlQuran Cloud)
- [OK] Adhan optionnel (préférence + son notif)
- [OK] Docs web + checklist captures store + smoke Jest

## Chantier UI/UX (sept. 2026)

- [OK] P0 — Accueil hero, Prières réordonnées, cul-de-sacs profil, i18n météo/qibla/audio, back gauche, CTA onAccent
- [OK] P1 — Explore=écoute / Bibliothèque=lecture, EmptyState/ErrorState, Search/Skeletons, outils sans doublon
- [OK] P2 — Typo adaptative écrans clés, offline chips, Apprendre stats/goal
- [OK] P3 — Tokens rayons/ombres, police Amiri, BottomBar i18n a11y, docs layouts

## À valider en prod (manuel)

- [~] Migration RLS initiale + `delete_own_account` appliquées sur Supabase
- [~] Sync cloud favoris / progression testée bout-en-bout
- [ ] Captures App Store / Play Store réelles
- [ ] Son adhan custom embarqué (fichier bundle) si souhaité au-delà du son système

## Enrichissement ultérieur

- [ ] Widget / Live Activity prochaine prière
- [ ] Tafsir v2 embarqué
- [ ] Compteur Juz lu
- [ ] E2E Playwright device

---

*Voir `AUDIT_ACTIONS.md`, `docs/WEB_SUPPORT.md`, `docs/ui-screenshots.md`, `docs/ui-layouts.md`.*
