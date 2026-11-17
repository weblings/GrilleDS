# Agent coordination lessons

Id: lesson-agent-coordination

Running several agents on Grille beads at once: worktrees, node_modules, verifying and committing their
work. Aurora's `docs/lessons/agent-coordination.md` covers the general method (briefs, progress files,
per-bead commits). See [`README.md`](README.md) for filing rules.

---

## Parallel agents must not each run npm install: give every worktree its node_modules before fan-out
Tags: subagents, parallel, worktree, npm-install, windows, node_modules
Applies-when: briefing more than one agent to work in separate worktrees of this repo

Grille-83g wave 1 (2026-11-17): four agents in fresh worktrees each ran `npm install` at once, as the
brief told them. On Windows the installs stalled on the shared npm cache, and each agent retried while
its first install still held `node_modules`, so ten installs piled up and stopped writing. In about 15
minutes no agent ran a single gate, and stopping the stuck processes needed the owner. The code work
itself finished fine.

**Fix:** never brief agents to install. All worktrees share HEAD's lockfile, so the coordinator either
links each worktree's `node_modules` to the main checkout's before fan-out (a junction; `cmd //c mklink /J`
from Git Bash failed with "path not found"; PowerShell `New-Item -ItemType Junction` worked, and the
full gate set then passed inside the worktree), or has agents only edit and runs every gate in the main
checkout per bead (what saved wave 1). Before `git worktree remove`, delete the junction itself
(PowerShell `(Get-Item <wt>\node_modules).Delete()` or `cmd /c rmdir <wt>\node_modules`): `git worktree remove
--force` follows the junction and empties the main checkout's `node_modules` (wave 2 teardown, 2026-11-17;
`npm ci` restored it in 4 min). Tell agents that a
failed install or build means stop and report, never retry while another install may be running.

---

## Worktrees under .claude/ need a hand-made HEAD checkout and a scoped test run in the main checkout
Tags: subagents, worktree, vitest, git, isolation, staging
Applies-when: creating worktrees for agents, or running gates in the main checkout while worktrees exist

Grille-83g wave 1 (2026-11-17): the Agent tool's worktree isolation refused every worktree because git
reported `D:/...` and the tool `d:\...`, and it had based them on an old merge (bd3909c), not HEAD. Worktrees
made with `git worktree add -b wt/<name> .claude/worktrees/<name> HEAD` worked. Two side effects: vitest's
default include also finds `.claude/worktrees/*/src/*.test.tsx`, and `.claude/worktrees/` is not gitignored.

**Fix:** create worktrees yourself at HEAD. In the main checkout run tests as
`npx vitest run --exclude '.claude/**' --exclude '**/node_modules/**'`, and stage by explicit path, never
`git add -A`. Bring an agent's work over with `git diff --binary` in the worktree (after `git add -N` for new
files) and `git apply -3` in the main checkout. Expect `docs/log/INDEX.md` to conflict when two beads each
added a row: keep both rows.
