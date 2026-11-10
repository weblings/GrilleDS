import { describe, expect, it } from 'vitest';
import indexSource from './index.ts?raw';

const fixtureSources = import.meta.glob<string>('./*.fixture.tsx', { query: '?raw', import: 'default', eager: true });

// Exports with nothing of their own to render in the catalog: mountIsland is not a component, and Header only
// renders inside a collection section, which the Section fixtures already show through Section's title.
const notRendered = new Set(['mountIsland', 'Header']);

// Value exports of src/index.ts. `type` re-exports are skipped, and so is the bare side-effect import.
function valueExports(): string[] {
    const source = indexSource;
    const names: string[] = [];
    for (const match of source.matchAll(/export\s*\{([^}]*)\}/g)) {
        for (const part of match[1].split(',')) {
            const name = part.trim();
            if (name && !name.startsWith('type ')) names.push(name);
        }
    }
    return names;
}

describe('fixture coverage', () => {
    it('finds the exports and fixtures it is guarding', () => {
        expect(valueExports().length).toBeGreaterThan(5);
    });

    it('gives every component exported from index.ts at least one fixture', () => {
        const fixtures = Object.values(fixtureSources).join('\n');
        // A JSX use (<Name) counts; an import alone does not.
        const missing = valueExports().filter((n) => !notRendered.has(n) && !new RegExp(`<${n}[\\s/>]`).test(fixtures));
        expect(missing, `No fixture renders: ${missing.join(', ')}. Add one in src/<Name>.fixture.tsx.`).toEqual([]);
    });
});
