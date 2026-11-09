// Pure logic behind the V5 inspector: selector specificity, cascade winner across
// @layer, var() extraction and token tracing. DOM collection lives in Inspector.tsx.

import { tokensForValue, type Token } from './tokenModel';

export type Specificity = [number, number, number];

/** Split on commas that are not inside (), [] or strings. */
export function splitSelectorList(list: string): string[] {
    const out: string[] = [];
    let depth = 0;
    let quote = '';
    let cur = '';
    for (const ch of list) {
        if (quote) {
            if (ch === quote) quote = '';
        } else if (ch === '"' || ch === "'") quote = ch;
        else if (ch === '(' || ch === '[') depth++;
        else if (ch === ')' || ch === ']') depth--;
        else if (ch === ',' && depth === 0) {
            out.push(cur.trim());
            cur = '';
            continue;
        }
        cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
}

/** Approximate specificity: :where() is 0, :is/:not/:has count their arguments, not themselves. */
export function specificity(selector: string): Specificity {
    let s = selector.replace(/"[^"]*"|'[^']*'/g, '""');
    s = s.replace(/:where\((?:[^()]|\([^()]*\))*\)/g, '');
    s = s.replace(/:(?:is|not|has|matches)\(/g, '(');
    let a = 0;
    let b = 0;
    let c = 0;
    s = s.replace(/\[[^\]]*\]/g, () => (b++, ''));
    s = s.replace(/#[\w-]+/g, () => (a++, ''));
    s = s.replace(/\.[\w-]+/g, () => (b++, ''));
    s = s.replace(/::[\w-]+(?:\([^)]*\))?/g, () => (c++, ''));
    s = s.replace(/:[\w-]+(?:\([^)]*\))?/g, () => (b++, ''));
    for (const part of s.split(/[\s>+~(),]+/)) {
        if (/^[a-z][\w-]*$/i.test(part)) c++;
    }
    return [a, b, c];
}

export interface Decl {
    prop: string;
    value: string;
    important: boolean;
    selector: string;
    /** Layer path like "ui", or null when unlayered. */
    layer: string | null;
    /** Index of the layer in order of declaration; null when unlayered. */
    layerRank: number | null;
    specificity: Specificity;
    /** Source order across all sheets. */
    order: number;
}

/** Declarations as authored (shorthands intact, var() unresolved). */
export function parseDeclarations(cssText: string): { prop: string; value: string; important: boolean }[] {
    const out: { prop: string; value: string; important: boolean }[] = [];
    let depth = 0;
    let cur = '';
    const flush = () => {
        const i = cur.indexOf(':');
        if (i > 0) {
            let value = cur.slice(i + 1).trim();
            const important = /!\s*important$/i.test(value);
            if (important) value = value.replace(/!\s*important$/i, '').trim();
            out.push({ prop: cur.slice(0, i).trim().toLowerCase(), value, important });
        }
        cur = '';
    };
    for (const ch of cssText) {
        if (ch === '(') depth++;
        else if (ch === ')') depth--;
        if (ch === ';' && depth === 0) flush();
        else cur += ch;
    }
    flush();
    return out;
}

const SHORTHANDS: Record<string, string[]> = {
    padding: ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
    margin: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
    gap: ['row-gap', 'column-gap'],
    background: ['background-color'],
    'border-radius': [
        'border-top-left-radius',
        'border-top-right-radius',
        'border-bottom-right-radius',
        'border-bottom-left-radius',
    ],
    'border-color': ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'],
    'border-width': ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'],
    border: [
        'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
        'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
    ],
    outline: ['outline-color', 'outline-width'],
};

/** Does a declaration of `declared` set the longhand `prop`? */
export function declares(declared: string, prop: string): boolean {
    if (declared === prop) return true;
    if (declared === 'border') return SHORTHANDS.border.includes(prop);
    return SHORTHANDS[declared]?.includes(prop) ?? false;
}

/** Positive when `a` wins over `b`, negative when it loses. */
export function compareDecls(a: Decl, b: Decl): number {
    if (a.important !== b.important) return a.important ? 1 : -1;
    // Unlayered beats layered for normal declarations; for !important the order flips.
    const rank = (d: Decl) => (d.layerRank === null ? Infinity : d.layerRank);
    if (rank(a) !== rank(b)) {
        const normal = rank(a) > rank(b) ? 1 : -1;
        return a.important ? -normal : normal;
    }
    for (let i = 0; i < 3; i++) {
        if (a.specificity[i] !== b.specificity[i]) return a.specificity[i] > b.specificity[i] ? 1 : -1;
    }
    return a.order === b.order ? 0 : a.order > b.order ? 1 : -1;
}

export function winningDecl(decls: Decl[], prop: string): Decl | undefined {
    return decls
        .filter((d) => declares(d.prop, prop))
        .reduce<Decl | undefined>((best, d) => (!best || compareDecls(d, best) > 0 ? d : best), undefined);
}

export function varsIn(value: string): string[] {
    return [...value.matchAll(/var\(\s*(--[\w-]+)/g)].map((m) => m[1]);
}

export type Trace =
    | { kind: 'var'; vars: string[]; tokens: Token[] }
    | { kind: 'value'; tokens: Token[] }
    | { kind: 'none' };

/** Values that need no token: browser defaults and structural zeroes. */
const NEUTRAL = new Set(['0px', 'none', 'normal', 'auto', 'rgba(0, 0, 0, 0)', 'transparent', 'visible', '0']);
export const isNeutral = (v: string) => NEUTRAL.has(v.trim());

/**
 * Where a computed value comes from. If the winning declaration reads --ui-* variables,
 * those name the tokens directly; otherwise fall back to matching by value.
 * `normalized` holds each candidate token with its value rendered the way the browser computes it.
 */
export function traceValue(winner: Decl | undefined, computed: string, normalized: Token[]): Trace {
    const vars = winner ? varsIn(winner.value).filter((v) => v.startsWith('--ui-')) : [];
    if (vars.length) return { kind: 'var', vars, tokens: normalized.filter((t) => vars.includes(t.cssVar)) };
    const tokens = tokensForValue(normalized, computed);
    return tokens.length ? { kind: 'value', tokens } : { kind: 'none' };
}
