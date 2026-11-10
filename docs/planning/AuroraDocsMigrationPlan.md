# Migrate docs infra to Aurora's system (docs/ tree, check scripts, AGENTS.md)

Status: planned 2026-11-10 — step 1 done; steps 2–9 open. Tracked as bead Grille-x08.
Id: aurora-docs-migration

Owner-context: assessed 2026-11-10 against Aurora's live tree and the two finished migrations of the
same name (RockyRoad 2026-10-08, RockyRoadImport 2026-09-30). Next agent: work the plan top to bottom;
each step lists its done-criteria and the bead that carries it.

## Source material

- Aurora (`../Aurora/Aurora`):
  - `AGENTS.md` — filing contract ("Where things go") + beads block; `CLAUDE.md` is a pointer stub
  - `docs/README.md` — layout, `Id:`/`[[id]]` convention, after-move checklist
  - `docs/check-links.py` — link checker + `_ids.md` generator
  - `docs/check-lessons.sh` — `Tags:`/`Applies-when:` + index-count guard
  - `docs/check-close.py` — pre-commit close gate (decision 5)
  - `docs/lessons/README.md` + topic files — table index with entry counts
  - `.beads/hooks/pre-commit` — the `PROJECT DOC-LINT HOOKS` block below the beads markers
- RockyRoad (`../RockyRoad`) and RockyRoadImport (`../RockyRoadImport`): the same migration at smaller
  scale. Their archived `docs/archive/AuroraDocsMigrationPlan.md` are this doc's template; their
  `docs/README.md`, `docs/log/INDEX.md`, `CONTRIBUTING.md`, `CHANGELOG.txt` are the closest copies.

## Current state (this repo)

- Docs: no `docs/` at all. Prose lives in `README.md`, `AGENTS.md`, `CLAUDE.md`. No `Id:`/`Status:` anywhere.
- Lessons: none in-repo. Aurora, RockyRoad and RockyRoadImport hold the relevant ones (web-ui, layout-css,
  components, web-testing, engineering-hygiene, debugging-method, …).
- Agent instructions: `AGENTS.md` (138 lines) is mostly two generated beads blocks plus the Releasing
  section; `CLAUDE.md` (87 lines) duplicates them. Neither has a filing contract.
- Beads: `.beads/issues.jsonl` is now exported and tracked (Grille-ft5, `export.auto: true`,
  `git-add: false`). Hooks live in `.beads/hooks/` and `core.hooksPath` points there. `.claude/settings.json`
  already has the `bd prime --hook-json` SessionStart hook.
- Skills: none (`.claude/skills/` absent; `.agents/skills/` holds only the beads skill). Aurora has 7
  (`web-ui-lessons`, `engineering-hygiene-lessons`, …) to copy the shape from.
- No `CONTRIBUTING.md`, no `CHANGELOG.txt`. `.github/workflows/` exists (ci, pages, release, review) but
  runs no doc checks.
- Release flow documented in `AGENTS.md` ("Releasing") — must survive the rewrite verbatim in substance.

## Target state

- `docs/` mirroring Aurora: `archive/`, `planning/`, `log/` (+`log/INDEX.md`), `lessons/`, `README.md`,
  generated `_ids.md`; `check-links.py` and `check-lessons.sh` runnable and green.
- Every doc carries `Status:` + `Id:`; citations use `[[id]]`.
- `docs/lessons/` seeded with generalized Grille-relevant lessons, every entry tagged `Tags:`/`Applies-when:`.
- `AGENTS.md` is the instruction file in the siblings' shape; `CLAUDE.md` is Aurora's 3-line pointer stub.
- `CONTRIBUTING.md` and `CHANGELOG.txt` exist.
- `.claude/skills/*-lessons/SKILL.md` route agents into the lessons by tag.
- `.beads/hooks/pre-commit` runs both checks when staged paths touch docs, rejects a broken `[[id]]`, and
  runs the close gate on commits that close a bead.

## Decisions

Settled by the epic (Grille-x08) and Grille-ft5:
1. **Export sync model.** Beads sync rides git via the tracked `.beads/issues.jsonl` (`export.auto: true`,
   `git-add: false`); `sync.remote` stays as-is and unused, as in the siblings. Done in Grille-ft5.
   AGENTS.md wording that still says "sync uses `refs/dolt/data`" is corrected in step 5.
2. **CI wiring is out of scope.** No sibling runs the doc checks in CI; pre-commit is the gate (step 7).
   Grille's existing workflows are untouched.
3. **Lessons are copied and generalized; Aurora originals stay.** No lessons move out of Aurora,
   RockyRoad or RockyRoadImport. Entries that are Grille-relevant (design tokens, React Aria, CSS, Vite,
   Cosmos, web testing) are copied, with Aurora/app-specific detail stripped.

Settled by the bead (recorded here):
4. **`log/` starts on migration day, no backfill.** `log/INDEX.md` carries a note pointing earlier work
   to git history and closed beads (`bd list --status=closed`, `.beads/issues.jsonl`).

Open (recommendations inline — owner may override before the step runs):
5. **Port Aurora's `check-close.py`: yes** (owner, 2026-11-10; RockyRoad has not). Pre-commit gate: every
   bead a commit newly closes (staged export vs HEAD) needs a `docs/log/` entry naming it with a lessons
   record (`## Lessons` section or `- Lessons:` line; "none" counts) and an INDEX row; it also blocks
   closes sitting in an unstaged export, which is the `git-add: false` failure mode. Rename the bypass to
   `GRILLE_SKIP_CLOSE_GATE=1`; AGENTS.md gets Aurora's "Before any commit that closes a bead" checklist.
6. **Skills: build now** (owner, 2026-11-10: they scale quickly). Per-topic routing skills in
   `.claude/skills/<topic>-lessons/SKILL.md`, shaped like Aurora's (frontmatter `name`/`description`/
   `allowed-tools: Read`; "grep `Tags:`/`Applies-when:`, read only matching entries" usage steps; file new
   findings per `docs/lessons/README.md`). One skill per query-coherent group of lesson files, created
   with the lessons in step 4 so none points at an empty topic.
7. **Lesson file layout.** Recommended: flat `docs/lessons/*.md` (what `check-lessons.sh` supports),
   split by query vocabulary: `web-ui.md`, `layout-css.md`, `components.md`, `web-testing.md`,
   `engineering-hygiene.md`, `build-toolchain.md`; fewer files if a topic has <3 entries.
8. **Memory split.** `bd remember` for clone-specific notes (never `--include-memories`/`--all` on export);
   AGENTS.md/`docs/` for anything every clone needs; `docs/lessons/` for gotchas. Claude auto-memory is
   not used for this repo (CLAUDE.md already says so).
9. **Agent profile stays conservative.** AGENTS.md keeps "no commit/push/tag without go-ahead" and the
   Releasing section; the siblings' "export before `git add`" loop is adapted to `export.auto`.

## Plan

1. **Write this plan** (Grille-x08.1). Done when: every open decision above has an answer or a
   recommendation and each later bead maps to a step below. *(this doc)*
2. **Create the tree** (Grille-x08.2). `docs/{archive,planning,log,lessons}`, `docs/README.md` adapted
   from RockyRoadImport's (layout, `Id:`/`[[id]]` convention, after-move checklist),
   `docs/log/INDEX.md` with headers + the decision-4 note. Give this plan its `Status:`/`Id:` (already
   present). Done when: `ls docs` matches the target tree and README lists every folder.
3. **Port the scripts** (Grille-x08.3). Copy Aurora's `check-links.py`, `check-lessons.sh` and
   `check-close.py` (decision 5; rename env var, `AURORA` → `GRILLE`). Empty the `GRANDFATHERED` list; point the outside-`docs/` citer scan at
   `README.md`, `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`. Run `check-links.py` twice (first run
   generates `_ids.md`). Done when: `python3 docs/check-links.py` → OK, `bash docs/check-lessons.sh`
   → `lessons OK`, and `python3 docs/check-close.py` exits 0 on a clean tree.
4. **Seed lessons** (Grille-x08.4). Copy and generalize per decision 3/7 into `docs/lessons/`, with
   `lessons/README.md` in Aurora's table shape (`File | Scope | Entries | File here when`). Every entry:
   `##` principle headline, root-cause paragraph, `**Fix:**`, then `Tags:`/`Applies-when:`. Rule 1 of the
   README points own-verification habits at `bd remember`. Done when: `check-lessons.sh` green with
   counts matching the index; no Aurora-specific paths in entries.
5. **Rewrite AGENTS.md; stub CLAUDE.md** (Grille-x08.5). AGENTS.md: Aurora's "Where things go" adapted
   (beads loop under `export.auto`, lessons + skills routing, the close checklist (decision 5), log on close, `[[id]]` citing, archive-on-close),
   the memory split (decision 8), the Releasing section kept, and the generated beads blocks kept between
   their markers with the `refs/dolt/data` architecture line corrected to the git-export model. Replace
   `CLAUDE.md` with the 3-line pointer. Done when: a side-by-side diff of old `CLAUDE.md` + `AGENTS.md`
   shows no rule lost; `docs/README.md` links resolve.
6. **Add CONTRIBUTING.md and CHANGELOG.txt** (Grille-x08.6, P3). Adapt RockyRoad's. `CHANGELOG.txt`
   seeded from `git log` / tags `v0.1.0-dev.*`. Done when: both exist and are cited from README/AGENTS.md.
7. **Write the lessons skills** (Grille-x08.9, after step 4). One `.claude/skills/<topic>-lessons/SKILL.md`
   per lesson-file group (decision 6), each citing real `docs/lessons/` paths. Done when: `check-links.py`
   (which scans skills) stays green and every lessons file is reachable from exactly one skill.
8. **Wire pre-commit** (Grille-x08.7). Last of the build steps, so the hook doesn't block the migration's
   own commits. Copy Aurora's `PROJECT DOC-LINT HOOKS` block below the beads markers in
   `.beads/hooks/pre-commit`; path filter: `docs/*`, `.claude/skills/*`, `*/README.md`, `README.md`,
   `CONTRIBUTING.md`, `AGENTS.md`, `CLAUDE.md`; re-stage `docs/_ids.md`. Also copy Aurora's `check-close.py`
   invocation (it keys on the staged `.beads/issues.jsonl`, so it runs on every commit; it exits fast when
   no bead closes). Check `prepare-commit-msg` writes
   no attribution trailers. Done when: a commit with a deliberately broken `[[id]]` in `docs/` is
   rejected, a bead-closing commit without a log entry is rejected, and a code-only commit runs neither check.
9. **Close out** (Grille-x08.8). Write `docs/log/2026-11-XX-aurora-docs-migration.md` + INDEX row; set this doc `Status: done` and `git mv` it to
   `docs/archive/`; rerun both scripts. Done when: epic acceptance criteria all hold.

Bead map: x08.1 → step 1 · x08.2 → 2 · x08.3 → 3 · x08.4 → 4 · x08.5 → 5 · x08.6 → 6 · x08.9 → 7 · x08.7 → 8 · x08.8 → 9.
Commits need owner go-ahead (AGENTS.md); nothing here tags or releases.

## Verification (all must hold before calling it done)

- `python3 docs/check-links.py` → OK; `bash docs/check-lessons.sh` → `lessons OK`.
- `git rev-parse --git-path hooks` → `.beads/hooks`; a broken `[[id]]` commit is rejected (step 7).
- `.beads/issues.jsonl` line count equals live issue count after the final export.
- A test `bd remember` shows in `bd prime` and is absent from `.beads/issues.jsonl` (then `bd forget`).
- `CLAUDE.md` is the pointer stub; no rule lost vs. the old files (step 5 diff).
- `npm run build` still passes (docs-only change; confirms nothing in `src/` or `scripts/` was touched).
- Skills exist for every lessons file; the close gate rejects a test close with no log entry.
- This plan archived with `Status: done`; log entry and INDEX row exist.

## Out of scope

- CI wiring for the check scripts (decision 2).
- Log backfill (decision 4).
- Editing Aurora's, RockyRoad's or RockyRoadImport's lessons or grandfather lists.
- Any release, tag, or push.
