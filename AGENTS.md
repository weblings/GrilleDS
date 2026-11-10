# Grille — agent instructions

Grille is the React design-system library (React Aria components, design tokens, Cosmos fixtures)
that Aurora installs from a GitHub release tarball. `CLAUDE.md` is only a pointer to this file.

## Build & test

```bash
npm install
npm run build        # tokens + vite + tsc + assets
npm test             # vitest
npm run typecheck
npm run lint         # stylelint + UI-boundary check
npm run dev          # Cosmos
```

## Where things go

- Tasks (open, blocked, deferred): `bd` (`bd ready`, `bd list`), not markdown TODOs or checkboxes.
  Sync rides git, not the Dolt remote (unused; `sync.remote` stays as-is): `export.auto` is on but
  debounced, so run `bd export -o .beads/issues.jsonl` immediately before `git add`ing task state
  (`git-add` is off — staging is yours). After `git pull`, run `bd import` to upsert the tracked
  export into your live DB — never `--reinit-local`. On a fresh machine/clone with no local DB, run
  `bd bootstrap` first (`bd import` fails with no DB); if a failed import left an empty DB, delete
  `.beads/embeddeddolt/` and retry. Don't use `bd dolt push/pull`.
- Hooks: `core.hooksPath` must point at `.beads/hooks`; activate per clone with
  `git config core.hooksPath .beads/hooks` (check: `git rev-parse --git-path hooks`). Doc-lint checks
  join the pre-commit hook in Grille-x08.7; `--no-verify` bypasses.
- Non-obvious gotchas worth saving future time: `docs/lessons/`, with `Tags:`/`Applies-when:`,
  routed by the matching `.claude/skills/` skill (once they exist) — check it before changing that
  area, file per `docs/lessons/README.md`. This is the only lessons location in the repo.
- Milestone detail (closed or paused): dated file in `docs/log/` + `docs/log/INDEX.md` row on close —
  every material fact, stated once and tightly; paused work logs state + resume pointer. Findings
  over narration.
- **Before any commit that closes a bead (Grille-* message):** (1) write or update its `docs/log/`
  entry and `INDEX.md` row, (2) file any lessons per `docs/lessons/README.md` (bump the README count)
  and list them in the log (`## Lessons` or `- Lessons:`; "none" counts), (3) `bd export -o
  .beads/issues.jsonl`, then stage. Do this before asking to commit. Once wired (Grille-x08.7) the
  pre-commit hook enforces it via `docs/check-close.py` (bypass: `GRILLE_SKIP_CLOSE_GATE=1`).
- Citing another doc under `docs/`: use `Id:`/`[[id]]`, not a bare relative path — see
  `docs/README.md` "Citing other docs". New docs get an `Id:` line under the H1 at creation.
  `check-links.py` scans `docs/` and `.claude/skills/` plus the root agent/contributor files, so keep
  those citers live too.
- **Required at close, not later:** when closing a milestone bead, check its description for a
  referenced `docs/*.md` plan. If its `Status:` line doesn't already say shipped/superseded, correct
  it and `git mv` it to `docs/archive/` in the same close.
- Planning docs (`docs/planning/`): decisions, status, pointers only — no task lists or build
  play-by-play. Every doc carries `Status:` and `Id:`. Before trusting "still open", check
  `git log --follow -- <path>` for the last substantive edit; if stale, archive it with a corrected
  `Status:`.
- Shipped, superseded, or abandoned plans and analyses: `docs/archive/` — historical record, not
  deleted or edited into the present tense.
- Don't write paragraph-long comment blocks or lessons; condense to 2–3 lines when context survives.
  Don't reference planning labels ("Phase 5") in comments.

## Memory: what lives where

- AGENTS.md / `docs/` — anything every clone, collaborator, or agent needs; tracked in git.
- `docs/lessons/` — code/tooling gotchas (all clones).
- `bd remember` — memory specific to this clone (debugging habits, environment quirks), readable via
  `bd prime` / `bd memories`. Never export with `--include-memories` or `--all`; that would push
  clone-local memory to other clones via `issues.jsonl`.
- Claude memory files (`~/.claude/projects/<launch-dir>/memory/`) and MEMORY.md — not used here.

## Non-Interactive Shell Commands

**ALWAYS use non-interactive flags** with file operations to avoid hanging on confirmation prompts.

Shell commands like `cp`, `mv`, and `rm` may be aliased to include `-i` (interactive) mode on some systems, causing the agent to hang indefinitely waiting for y/n input.

**Use these forms instead:**
```bash
# Force overwrite without prompting
cp -f source dest           # NOT: cp source dest
mv -f source dest           # NOT: mv source dest
rm -f file                  # NOT: rm file

# For recursive operations
rm -rf directory            # NOT: rm -r directory
cp -rf source dest          # NOT: cp -r source dest
```

**Other commands that may prompt:**
- `scp` - use `-o BatchMode=yes` for non-interactive
- `ssh` - use `-o BatchMode=yes` to fail instead of prompting
- `apt-get` - use `-y` flag
- `brew` - use `HOMEBREW_NO_AUTO_UPDATE=1` env var

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:46cd31e7 -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

**Architecture in one line:** issues live in a local Dolt DB; sync rides git via the tracked `.beads/issues.jsonl` export (see "Where things go"); the Dolt remote (`bd dolt push/pull`, `refs/dolt/data`) is not used here.

## Agent Context Profiles

The managed Beads block is task-tracking guidance, not permission to override repository, user, or orchestrator instructions.

- **Conservative (default)**: Use `bd` for task tracking. Do not run git commits or git pushes unless explicitly asked; Dolt remote sync is not used here. At handoff, report changed files, validation, and suggested next commands.
- **Minimal**: Keep tool instruction files as pointers to `bd prime`; use the same conservative git policy unless active instructions say otherwise.
- **Team-maintainer**: Only when the repository explicitly opts in, agents may close beads, run quality gates, commit, and push as part of session close. A current "do not commit" or "do not push" instruction still wins.

## Releasing

A "Version X.Y.Z" commit does **not** publish anything. Consumers (Aurora) install from a GitHub release tarball, which exists only after the `vX.Y.Z` tag is pushed and the Release workflow (`.github/workflows/release.yml`) has run.

- Tag the version commit (`git tag vX.Y.Z <commit>`), then push the branch and the tag. The tag must match `package.json`'s version.
- Tagging and pushing is outward-facing: ask first unless the user said to release.
- Never re-tag or replace a release asset; consumers' lockfiles record its integrity hash. To fix a bad release, cut a new version.
- Verify with `gh release view vX.Y.Z`.
- In handoffs, say "committed, not yet tagged or released" until that is true. Don't call work shipped or published, and don't close beads as shipped, before the release exists.

## Session Completion

This protocol applies when ending a Beads implementation workflow. It is subordinate to explicit user, repository, and orchestrator instructions.

1. **File issues for remaining work** - Create beads for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **Handle git/sync by active profile**:
   ```bash
   # Conservative/minimal/default: report status and proposed commands; wait for approval.
   git status

   # Team-maintainer opt-in only, unless current instructions forbid it:
   git pull --rebase
   bd import                          # upsert the pulled export into the live DB
   bd export -o .beads/issues.jsonl   # before git add of task state
   git push
   git status
   ```
5. **Hand off** - Summarize changes, validation, issue status, and any blocked sync/commit/push step

**Critical rules:**
- Explicit user or orchestrator instructions override this Beads block.
- Do not commit or push without clear authority from the active profile or the current user request.
- If a required sync or push is blocked, stop and report the exact command and error.
<!-- END BEADS INTEGRATION -->

<!-- BEGIN BEADS CODEX SETUP: generated by bd setup codex -->
## Beads Issue Tracker

Use Beads (`bd`) for durable task tracking in repositories that include it. Use the `beads` skill at `.agents/skills/beads/SKILL.md` (project install) or `~/.agents/skills/beads/SKILL.md` (global install) for Beads workflow guidance, then use the `bd` CLI for issue operations.

### Quick Reference

```bash
bd ready                # Find available work
bd show <id>            # View issue details
bd update <id> --claim  # Claim work
bd close <id>           # Complete work
bd prime                # Refresh Beads context
```

### Rules

- Use `bd` for all task tracking; do not create markdown TODO lists.
- Run `bd prime` when Beads context is missing or stale. Codex 0.129.0+ can load Beads context automatically through native hooks; use `/hooks` to inspect or toggle them.
- Keep persistent project memory in Beads via `bd remember`; do not create ad hoc memory files.

**Architecture in one line:** issues live in a local Dolt DB; sync rides git via the tracked `.beads/issues.jsonl` export (see "Where things go"); the Dolt remote (`bd dolt push/pull`, `refs/dolt/data`) is not used here.
<!-- END BEADS CODEX SETUP -->
