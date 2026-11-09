// Flattens DTCG tokens, resolves references, and diffs two token sets.
// Shared by the Tokens page and the branch review page; the inspector maps
// computed values back to tokens with tokensForValue.

export type TokenType = 'color' | 'dimension' | 'shadow' | 'fontFamily' | 'fontWeight' | 'other';

export interface Token {
    /** Dotted path, e.g. color.popup.bg */
    path: string;
    type: TokenType;
    /** As authored: may be a {reference}. */
    raw: unknown;
    /** References followed, rendered as CSS text (dimensions get px). */
    value: string;
    /** The custom property the build emits, e.g. --ui-color-popup-bg */
    cssVar: string;
    /** First two path segments, e.g. color.popup */
    group: string;
}

type Node = Record<string, unknown>;

const isLeaf = (n: Node) => '$value' in n;

function cssValue(type: TokenType, v: unknown): string {
    if (Array.isArray(v)) return v.map((f) => (/\s/.test(String(f)) ? `'${f}'` : String(f))).join(', ');
    if (type === 'dimension' && typeof v === 'number') return `${v}px`;
    return String(v);
}

export function flattenTokens(tree: Node): Token[] {
    const found: { path: string[]; type: TokenType; raw: unknown }[] = [];
    const walk = (node: Node, path: string[], inherited: TokenType) => {
        const type = (typeof node.$type === 'string' ? node.$type : inherited) as TokenType;
        if (isLeaf(node)) {
            found.push({ path, type, raw: node.$value });
            return;
        }
        for (const [k, v] of Object.entries(node)) {
            if (!k.startsWith('$') && v && typeof v === 'object') walk(v as Node, [...path, k], type);
        }
    };
    walk(tree, [], 'other');

    const byPath = new Map(found.map((f) => [f.path.join('.'), f]));
    const resolve = (raw: unknown, seen: string[]): unknown => {
        if (typeof raw !== 'string') return raw;
        const m = /^\{([^}]+)\}$/.exec(raw);
        if (!m) return raw;
        if (seen.includes(m[1])) throw new Error(`Token reference cycle: ${[...seen, m[1]].join(' -> ')}`);
        const target = byPath.get(m[1]);
        if (!target) throw new Error(`Unresolved token reference: ${raw}`);
        return resolve(target.raw, [...seen, m[1]]);
    };

    return found.map(({ path, type, raw }) => ({
        path: path.join('.'),
        type,
        raw,
        value: cssValue(type, resolve(raw, [path.join('.')])),
        cssVar: `--ui-${path.join('-')}`,
        group: path.slice(0, 2).join('.'),
    }));
}

export function groupTokens(tokens: Token[]): Map<string, Token[]> {
    const groups = new Map<string, Token[]>();
    for (const t of tokens) groups.set(t.group, [...(groups.get(t.group) ?? []), t]);
    return groups;
}

export interface TokenDiff {
    added: Token[];
    removed: Token[];
    changed: { before: Token; after: Token }[];
}

/** A token changed when its authored value or its resolved value differs. */
export function diffTokens(base: Token[], head: Token[]): TokenDiff {
    const before = new Map(base.map((t) => [t.path, t]));
    const after = new Map(head.map((t) => [t.path, t]));
    return {
        added: head.filter((t) => !before.has(t.path)),
        removed: base.filter((t) => !after.has(t.path)),
        changed: head.flatMap((t) => {
            const b = before.get(t.path);
            return b && (b.value !== t.value || JSON.stringify(b.raw) !== JSON.stringify(t.raw))
                ? [{ before: b, after: t }]
                : [];
        }),
    };
}

const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

/** Tokens whose resolved value equals a computed value (V5 inspector). */
export function tokensForValue(tokens: Token[], value: string): Token[] {
    const want = normalize(value);
    return tokens.filter((t) => normalize(t.value) === want);
}
