import { describe, expect, it } from 'vitest';
import tokens from '../tokens/tokens.json';
import { compareDecls, declares, parseDeclarations, specificity, splitSelectorList, traceValue, winningDecl, type Decl } from './inspectorModel';
import { flattenTokens } from './tokenModel';

const decl = (o: Partial<Decl>): Decl => ({
    prop: 'color', value: 'red', important: false, selector: '.x', layer: null, layerRank: null,
    specificity: [0, 1, 0], order: 0, ...o,
});

describe('inspectorModel', () => {
    it('computes specificity', () => {
        expect(specificity('.ui-button')).toEqual([0, 1, 0]);
        expect(specificity('.ui-button[data-variant="primary"][data-hovered]')).toEqual([0, 3, 0]);
        expect(specificity('#a .b > li:hover::before')).toEqual([1, 2, 2]);
        expect(specificity(':where(.a) .b')).toEqual([0, 1, 0]);
        expect(specificity(':not(.a)')).toEqual([0, 1, 0]);
    });

    it('splits selector lists outside parens', () => {
        expect(splitSelectorList('.a, .b:is(.c, .d), [x="1,2"]')).toEqual(['.a', '.b:is(.c, .d)', '[x="1,2"]']);
    });

    it('parses declarations keeping var() whole', () => {
        expect(parseDeclarations('padding: var(--a) var(--b); color: red !important')).toEqual([
            { prop: 'padding', value: 'var(--a) var(--b)', important: false },
            { prop: 'color', value: 'red', important: true },
        ]);
    });

    it('maps shorthands to longhands', () => {
        expect(declares('padding', 'padding-left')).toBe(true);
        expect(declares('border', 'border-top-color')).toBe(true);
        expect(declares('padding', 'margin-left')).toBe(false);
    });

    it('lets a later layer, then unlayered, win; flips for !important', () => {
        const reset = decl({ layer: 'reset', layerRank: 0, specificity: [1, 0, 0] });
        const ui = decl({ layer: 'ui', layerRank: 2 });
        const bare = decl({});
        expect(compareDecls(ui, reset)).toBeGreaterThan(0);
        expect(compareDecls(bare, ui)).toBeGreaterThan(0);
        expect(compareDecls({ ...bare, important: true }, { ...ui, important: true })).toBeLessThan(0);
        expect(winningDecl([reset, ui], 'color')).toBe(ui);
    });

    it('breaks ties by specificity then order', () => {
        const a = decl({ specificity: [0, 2, 0], order: 0 });
        const b = decl({ specificity: [0, 1, 0], order: 5 });
        expect(winningDecl([a, b], 'color')).toBe(a);
        expect(winningDecl([decl({ order: 1 }), decl({ order: 2, value: 'blue' })], 'color')!.value).toBe('blue');
    });

    it('traces through var() when declared, by value otherwise, else none', () => {
        const all = flattenTokens(tokens);
        const ring = all.find((t) => t.cssVar === '--ui-color-focus-ring')!;
        const viaVar = traceValue(decl({ value: 'var(--ui-color-focus-ring)' }), 'rgb(1, 2, 3)', all);
        expect(viaVar).toMatchObject({ kind: 'var', vars: ['--ui-color-focus-ring'], tokens: [ring] });
        expect(traceValue(decl({ value: '#dadada' }), ring.value, all).kind).toBe('value');
        expect(traceValue(undefined, 'rgb(9, 9, 9)', all).kind).toBe('none');
    });
});
