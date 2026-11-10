# Seed docs/lessons with generalized lessons

Id: 2026-11-10-lessons-seed
Status: shipped 2026-11-10 — Grille-x08.4 closed (not committed; no release involved).

Step 4 of [[aurora-docs-migration]].

## What landed

- Four lesson files, 16 entries, each with `Tags:`, `Applies-when:` and an `Origin:` line naming the
  source repo, file and headline: components (7), css-tokens (4), packaging-release
  (1), engineering-hygiene (4). Index rows added to `docs/lessons/README.md`.
- Aurora's `Aurora/Aurora/docs/lessons/` originals untouched. Entries restated from Grille's
  library side (e.g. the Vite font-license entry says the library ships the OFL, consumers add notices).
- RockyRoadImport upstream-dependencies entries became two engineering-hygiene entries: library fix
  vs consumer patch, and keep the intent guess in the consumer.

## Verification

- `bash docs/check-lessons.sh` -> lessons OK; README counts match `grep -c '^## '`.
- `python3 docs/check-links.py` -> links OK.

## Lessons

- none
