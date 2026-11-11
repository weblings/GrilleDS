# Release v0.1.0-dev.9: icons

Id: 2026-11-11-release-dev9

Status: shipped 2026-11-11 — Grille-ky2.5.

## What landed

- Tag `v0.1.0-dev.9` on 24b66c55 ("Version 0.1.0-dev.9"), published 2026-11-11 19:57 UTC by the Release
  workflow with `weblings-grille-0.1.0-dev.9.tgz`.
- Contents per CHANGELOG: Icon component and size tokens with 20 vendored icons and THIRD_PARTY_NOTICES,
  plain-SVG export, components on Grille icons instead of glyphs ([[2026-11-11-icon-glyph-swap]]),
  inline-flex `.ui-button`, Slider track fill ([[2026-11-11-slider-fill]]).
- Tagged from `feat/AuroraComponentsRequest`; Grille-uoq (merge to main keeping dev tags reachable) is still open.
- This entry was written after the fact: the bead was closed at release but its export and log were not committed then.

## Verification

- `gh release view v0.1.0-dev.9`: tag, publish time and the one tarball asset as above.
- `git rev-list -n1 v0.1.0-dev.9` = 24b66c55.

## Lessons

- none
