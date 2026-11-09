// Builds tokens/tokens.json (DTCG) into generated CSS vars and a TS module.
import StyleDictionary from 'style-dictionary';

const out = 'src/tokens/generated/';

const sd = new StyleDictionary({
    source: ['tokens/tokens.json'],
    log: { verbosity: 'silent' },
    hooks: {
        transforms: {
            // Dimensions are authored as px numbers.
            'grille/dimension-px': {
                type: 'value',
                filter: (token) => token.$type === 'dimension',
                transform: (token) => `${token.$value}px`,
            },
            'grille/font-family-css': {
                type: 'value',
                filter: (token) => token.$type === 'fontFamily',
                transform: (token) =>
                    token.$value.map((f) => (/\s/.test(f) ? `'${f}'` : f)).join(', '),
            },
        },
        transformGroups: {
            grille: ['attribute/cti', 'name/kebab', 'grille/dimension-px', 'grille/font-family-css'],
            'grille-ts': ['attribute/cti', 'name/camel', 'grille/dimension-px', 'grille/font-family-css'],
        },
    },
    platforms: {
        css: {
            transformGroup: 'grille',
            prefix: 'ui',
            buildPath: out,
            files: [{ destination: 'tokens.css', format: 'css/variables', options: { outputReferences: true } }],
        },
        ts: {
            transformGroup: 'grille-ts',
            buildPath: out,
            files: [{ destination: 'tokens.ts', format: 'javascript/es6' }],
        },
    },
});

await sd.buildAllPlatforms();

// Viewer only: the token file at a base ref, for the Tokens page diff.
// GRILLE_BASE_REF picks the ref (default main). null when git cannot supply it.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

const ref = process.env.GRILLE_BASE_REF || 'main';
let base = null;
for (const candidate of [ref, `origin/${ref}`]) {
    try {
        const text = execFileSync('git', ['show', `${candidate}:tokens/tokens.json`], {
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore'],
        });
        base = { ref: candidate, tokens: JSON.parse(text) };
        break;
    } catch {
        // try the next candidate
    }
}
mkdirSync('viewer/generated', { recursive: true });
writeFileSync('viewer/generated/base-tokens.json', JSON.stringify(base ?? { ref, tokens: null }, null, 2));
