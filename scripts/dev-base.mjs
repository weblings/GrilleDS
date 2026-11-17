// Cosmos with the Tokens page diffed against a base ref: `npm run dev:base -- <ref>` (default main).
// Sets GRILLE_BASE_REF for build-tokens.mjs, so it works the same from PowerShell, cmd and bash.
import { spawnSync } from 'node:child_process';

const ref = process.argv[2] || 'main';
const run = spawnSync('npm run dev', { stdio: 'inherit', shell: true, env: { ...process.env, GRILLE_BASE_REF: ref } });
process.exit(run.status ?? 1);
