# Prepare Grille for npm (0.2.1)

Id: 2026-11-22-npm-publish-prep

Status: ready to publish by hand — Grille-4ve. The first `npm publish` is the owner's step; nothing is published yet.

## What landed

- Aurora on Arch failed building because a git install runs `prepare` (a full build) on the consumer. Publishing to
  npm gives a prebuilt tarball and a registry range.
- Renamed the package `@weblings/grille` to `@weblings_things/grille`: the npm scope `weblings` was unavailable, so the
  owner created `weblings_things`. Consumers rename the dependency and every import. 0.2.0 stays GitHub-release-only
  under the old name.
- Inter ships as woff2 only (`scripts/copy-assets.mjs` copies the woff2 files and strips the woff fallbacks from
  `fonts.css`), and test types no longer reach `dist` (`tsconfig.build.json`). The tarball went from 96 files and
  213.9 kB to 92 files and 131.7 kB.
- README documents `npm install` and the Inter OFL notice consumers add by hand; `publishConfig.access` is public.
- `release.yml` stays GitHub-release-only (tarball name now `weblings_things-grille-X.Y.Z.tgz`). npm publishing was
  taken out so the first publish is manual. Provenance is off too: npm only produces it from supported CI.
- Version 0.2.1 in `package.json`, the lockfile and CONTRIBUTING.md; CHANGELOG entry added.

## Next

- Owner: `npm login` (2FA), `npm publish` from a clean checkout at the tagged commit. Then add trusted publishing
  (OIDC, `id-token: write`, a recent npm CLI) to `release.yml` so tags publish without a stored token.

## Verification

- Build, 188 tests, typecheck and lint pass; `npm pack --dry-run` lists `@weblings_things/grille@0.2.1`, no `.woff`
  and no test types.

## Lessons

- none
