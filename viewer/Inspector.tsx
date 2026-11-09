import { useEffect, useMemo, useState } from 'react';
import tokens from '../tokens/tokens.json';
import {
    isNeutral,
    parseDeclarations,
    specificity,
    splitSelectorList,
    traceValue,
    winningDecl,
    type Decl,
    type Trace,
} from './inspectorModel';
import { flattenTokens, type Token, type TokenType } from './tokenModel';

const allTokens = flattenTokens(tokens);

/** Computed properties checked against tokens, grouped for the panel. */
const CHECKED: { prop: string; type: TokenType }[] = [
    { prop: 'color', type: 'color' },
    { prop: 'background-color', type: 'color' },
    { prop: 'border-top-color', type: 'color' },
    { prop: 'outline-color', type: 'color' },
    { prop: 'font-family', type: 'fontFamily' },
    { prop: 'font-size', type: 'dimension' },
    { prop: 'font-weight', type: 'fontWeight' },
    { prop: 'padding-top', type: 'dimension' },
    { prop: 'padding-right', type: 'dimension' },
    { prop: 'padding-bottom', type: 'dimension' },
    { prop: 'padding-left', type: 'dimension' },
    { prop: 'row-gap', type: 'dimension' },
    { prop: 'column-gap', type: 'dimension' },
    { prop: 'border-top-width', type: 'dimension' },
    { prop: 'border-top-left-radius', type: 'dimension' },
    { prop: 'outline-width', type: 'dimension' },
    { prop: 'box-shadow', type: 'shadow' },
];

/** Every style rule in every readable sheet, flattened with its layer and source order. */
function collectDecls(): Decl[] {
    const layers: string[] = [];
    const rankOf = (name: string) => {
        if (!layers.includes(name)) layers.push(name);
        return layers.indexOf(name);
    };
    const out: Decl[] = [];
    let order = 0;
    const walk = (rules: CSSRuleList, layer: string | null) => {
        for (const rule of Array.from(rules)) {
            if (rule instanceof CSSLayerStatementRule) {
                for (const n of rule.nameList) rankOf(layer ? `${layer}.${n}` : n);
            } else if (rule instanceof CSSLayerBlockRule) {
                const name = layer ? `${layer}.${rule.name}` : rule.name;
                rankOf(name);
                walk(rule.cssRules, name);
            } else if (rule instanceof CSSStyleRule) {
                for (const d of parseDeclarations(rule.style.cssText)) {
                    out.push({
                        ...d,
                        selector: rule.selectorText,
                        layer,
                        layerRank: layer === null ? null : layers.indexOf(layer),
                        specificity: [0, 0, 0],
                        order: order++,
                    });
                }
            } else if (rule instanceof CSSMediaRule || rule instanceof CSSSupportsRule) {
                walk(rule.cssRules, layer);
            }
        }
    };
    for (const sheet of Array.from(document.styleSheets)) {
        try {
            walk(sheet.cssRules, null);
        } catch {
            // Cross-origin sheet: unreadable.
        }
    }
    return out;
}

/** Declarations whose selector matches el, with specificity of the best matching selector. */
function declsFor(el: Element, all: Decl[]): Decl[] {
    const cache = new Map<string, Decl['specificity'] | null>();
    const matched = (selectorText: string) => {
        if (cache.has(selectorText)) return cache.get(selectorText)!;
        let best: Decl['specificity'] | null = null;
        for (const sel of splitSelectorList(selectorText)) {
            try {
                if (!el.matches(sel)) continue;
            } catch {
                continue;
            }
            const sp = specificity(sel);
            if (!best || sp[0] > best[0] || (sp[0] === best[0] && (sp[1] > best[1] || (sp[1] === best[1] && sp[2] > best[2])))) best = sp;
        }
        cache.set(selectorText, best);
        return best;
    };
    return all.flatMap((d) => {
        const sp = matched(d.selector);
        return sp ? [{ ...d, specificity: sp }] : [];
    });
}

/** Render a token's value the way the browser computes it for `prop`, so it can be compared. */
function normalizer(prop: string) {
    const probe = document.createElement('div');
    return (value: string) => {
        probe.style.cssText = '';
        probe.style.setProperty(prop, value);
        document.body.appendChild(probe);
        const out = getComputedStyle(probe).getPropertyValue(prop);
        probe.remove();
        return out;
    };
}

interface Row {
    prop: string;
    computed: string;
    trace: Trace;
    winner?: Decl;
}

function inspect(el: Element): { rows: Row[]; vars: string[] } {
    const cs = getComputedStyle(el);
    const decls = declsFor(el, collectDecls());
    const rows: Row[] = [];
    for (const { prop, type } of CHECKED) {
        const computed = cs.getPropertyValue(prop);
        if (!computed || isNeutral(computed)) continue;
        // Border and outline colours are meaningless without a visible line.
        if (prop === 'border-top-color' && cs.borderTopStyle === 'none') continue;
        if (prop === 'outline-color' && cs.outlineStyle === 'none') continue;
        if (prop === 'outline-width' && cs.outlineStyle === 'none') continue;
        if (prop === 'border-top-width' && cs.borderTopStyle === 'none') continue;
        const norm = normalizer(prop);
        const candidates: Token[] = allTokens
            .filter((t) => t.type === type)
            .map((t) => ({ ...t, value: norm(t.value) }));
        const winner = winningDecl(decls, prop);
        rows.push({ prop, computed, trace: traceValue(winner, computed, candidates), winner });
    }
    const vars = [...new Set(decls.flatMap((d) => [...d.value.matchAll(/var\(\s*(--ui-[\w-]+)/g)].map((m) => m[1])))];
    return { rows, vars };
}

const describe = (el: Element) =>
    el.tagName.toLowerCase() +
    (el.id ? `#${el.id}` : '') +
    [...el.classList].map((c) => `.${c}`).join('');

const px = (n: number) => `${Math.round(n * 10) / 10}`;

function Panel({ el }: { el: Element }) {
    const { rows, vars } = useMemo(() => inspect(el), [el]);
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const flagged = rows.filter((x) => x.trace.kind === 'none').length;
    return (
        <>
            <div className="inspector-head">{describe(el)}</div>
            <div className="inspector-box">
                {px(r.width)} × {px(r.height)} · padding {cs.padding} · margin {cs.margin}
            </div>
            <div className={flagged ? 'inspector-flag' : 'inspector-ok'}>
                {flagged ? `${flagged} value${flagged > 1 ? 's' : ''} not using a token` : 'Every checked value traces to a token'}
            </div>
            <table>
                <tbody>
                    {rows.map((x) => (
                        <tr key={x.prop} data-trace={x.trace.kind}>
                            <th>{x.prop}</th>
                            <td>{x.computed}</td>
                            <td>
                                {x.trace.kind === 'none' ? (
                                    'no token'
                                ) : (
                                    <>
                                        {x.trace.tokens.map((t) => t.path).join(', ') || (x.trace.kind === 'var' ? x.trace.vars.join(', ') : '')}
                                        {x.trace.kind === 'var' ? ' (var)' : ' (by value)'}
                                    </>
                                )}
                                {x.winner && <div className="inspector-layer">@layer {x.winner.layer ?? '(unlayered)'} · {x.winner.selector}</div>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {vars.length > 0 && <div className="inspector-vars">Variables in matching rules: {vars.join(' ')}</div>}
        </>
    );
}

/** Hover to outline, click to pin. Mounted by the Cosmos decorator. */
export function Inspector() {
    const [on, setOn] = useState(false);
    const [hover, setHover] = useState<Element | null>(null);
    const [pinned, setPinned] = useState<Element | null>(null);

    useEffect(() => {
        if (!on) {
            setHover(null);
            setPinned(null);
            return;
        }
        const target = (e: Event) => {
            const t = e.target as Element | null;
            return t && !t.closest('[data-inspector]') && t !== document.documentElement && t !== document.body ? t : null;
        };
        const move = (e: MouseEvent) => setHover(target(e));
        const click = (e: MouseEvent) => {
            const t = target(e);
            if (!t) return;
            e.preventDefault();
            e.stopPropagation();
            setPinned(t);
        };
        document.addEventListener('mousemove', move, true);
        document.addEventListener('click', click, true);
        return () => {
            document.removeEventListener('mousemove', move, true);
            document.removeEventListener('click', click, true);
        };
    }, [on]);

    const shown = pinned ?? hover;
    const rect = hover?.getBoundingClientRect();
    return (
        <div data-inspector>
            <button className="inspector-toggle" aria-pressed={on} onClick={() => setOn(!on)}>
                Inspector {on ? 'on' : 'off'}
            </button>
            {on && rect && (
                <div
                    className="inspector-outline"
                    style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
                />
            )}
            {on && shown && (
                <div className="inspector-panel">
                    <Panel el={shown} />
                </div>
            )}
        </div>
    );
}
