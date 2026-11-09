import { describe, expect, it } from 'vitest';
import tokens from '../tokens/tokens.json';
import { diffTokens, flattenTokens, groupTokens, tokensForValue } from './tokenModel';

describe('tokenModel', () => {
    const all = flattenTokens(tokens);

    it('flattens every leaf with its css variable and resolves references', () => {
        const ring = all.find((t) => t.path === 'color.focus.ring')!;
        expect(ring.value).toBe('#dadada');
        expect(ring.cssVar).toBe('--ui-color-focus-ring');
        expect(all.find((t) => t.path === 'size.popup.pad')!.value).toBe('4px');
        expect(all.find((t) => t.path === 'font.family.sans')!.value).toBe('Inter, system-ui, sans-serif');
    });

    it('groups by the first two path segments', () => {
        expect(groupTokens(all).get('color.popup')!.map((t) => t.path)).toEqual([
            'color.popup.bg',
            'color.popup.bg-hover',
            'color.popup.border',
        ]);
    });

    it('diffs added, removed and changed', () => {
        const base = flattenTokens({
            color: { $type: 'color', a: { $value: '#000' }, b: { $value: '#111' }, c: { $value: '{color.a}' } },
        });
        const head = flattenTokens({
            color: { $type: 'color', a: { $value: '#222' }, c: { $value: '{color.a}' }, d: { $value: '#333' } },
        });
        const d = diffTokens(base, head);
        expect(d.added.map((t) => t.path)).toEqual(['color.d']);
        expect(d.removed.map((t) => t.path)).toEqual(['color.b']);
        // c's authored value is the same, but its resolved value moved with a.
        expect(d.changed.map((c) => c.after.path)).toEqual(['color.a', 'color.c']);
    });

    it('maps a computed value back to tokens', () => {
        expect(tokensForValue(all, '#1A1A1A').map((t) => t.path)).toContain('color.popup.bg');
    });

    it('rejects dangling references', () => {
        expect(() => flattenTokens({ a: { $value: '{nope}' } })).toThrow(/Unresolved/);
    });
});
