# AGENTS.md rewrite and CLAUDE.md stub

Id: 2026-11-10-agents-md-rewrite
Status: shipped 2026-11-10 — Grille-x08.5 closed (committed, not yet tagged or released; no release involved).

Step 5 of [[aurora-docs-migration]].

## What landed

- `AGENTS.md` rewritten in the siblings' shape: build/test commands, "Where things go" (export-model
  beads loop, hooksPath activation, lessons/log/`[[id]]`/archive rules, close checklist), "Memory:
  what lives where".
- Kept: Non-Interactive Shell Commands, Releasing, Agent Context Profiles, Session Completion, both
  generated beads blocks. Their `refs/dolt/data` architecture line and `bd dolt push` step were
  corrected to the git-export model (hash comment left unchanged, so `bd setup` may overwrite).
- `CLAUDE.md` is a pointer stub at `AGENTS.md`.
- Enforcement text (close gate, doc-lint) says "once wired" — hooks land in Grille-x08.7.

## Verification

- Old `CLAUDE.md` + `AGENTS.md` compared against the new file: no rule lost.
- `check-links.py` not run (scripts land in Grille-x08.3).

## Lessons

- none
