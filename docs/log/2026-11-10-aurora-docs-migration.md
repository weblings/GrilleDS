# Aurora docs-infra migration closed out

Id: 2026-11-10-aurora-docs-migration
Status: shipped 2026-11-10 — Grille-x08.1 through Grille-x08.9 closed (committed, not yet tagged or released; no release involved).

Steps 6–9 of [[aurora-docs-migration]]; closes the build-out tracked by epic Grille-x08. Earlier steps:
[[2026-11-10-agents-md-rewrite]], [[2026-11-10-lessons-seed]].

## What landed

- Grille-x08.6: `CONTRIBUTING.md` and `CHANGELOG.txt` (seeded from the `0.1.0-dev.*` commits).
- Grille-x08.9: three routing skills in `.claude/skills/` (`ui-lessons`, `engineering-hygiene-lessons`,
  `packaging-release-lessons`), one per lessons group, each citing real `docs/lessons/` paths.
- Grille-x08.7: `PROJECT DOC-LINT HOOKS` block in `.beads/hooks/pre-commit` — runs `check-lessons.sh` and
  `check-links.py` only when staged paths touch docs, and `check-close.py` (close gate) on every commit.
  `GRILLE_SKIP_CLOSE_GATE=1` bypasses the gate.
- Grille-x08.8: this entry, the INDEX row, and the plan set to `Status: done` and moved to `docs/archive/`.
- Grille-x08.1 to x08.5 landed earlier (plan, tree, scripts, lessons, AGENTS.md); see their entries.

## Verification

- `python3 docs/check-links.py` -> links OK; `bash docs/check-lessons.sh` -> lessons OK.
- `git rev-parse --git-path hooks` -> `.beads/hooks`.
- `npm run build` passes (docs-only change; `src/` and `scripts/` untouched).
- `.beads/issues.jsonl` line count matches `bd stats` total after the final export.

## Lessons

- none
