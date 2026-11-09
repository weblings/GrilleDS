import type { CSSProperties } from 'react';
import type { Token } from './tokenModel';

/** Draws a token from its resolved value, so removed tokens (no live variable) render too. */
export function TokenPreview({ token }: { token: Token }) {
    const v = token.value;
    switch (token.type) {
        case 'color':
            return <div className="tokens-swatch" style={{ background: v }} />;
        case 'shadow':
            return <div className="tokens-swatch" style={{ background: 'var(--ui-color-surface-raised)', boxShadow: v }} />;
        case 'fontFamily':
            return <span style={{ fontFamily: v, fontSize: 20 }}>Aa Gg</span>;
        case 'fontWeight':
            return <span style={{ fontWeight: Number(v), fontSize: 20 }}>Aa Gg</span>;
        case 'dimension': {
            if (token.path.startsWith('size.font.')) return <span style={{ fontSize: v }}>Aa Gg</span>;
            if (token.path.startsWith('size.radius.'))
                return <div className="tokens-swatch" style={{ borderRadius: v }} />;
            if (token.path.startsWith('size.focus-ring-')) {
                const ring: CSSProperties = token.path.endsWith('width')
                    ? { outline: `${v} solid var(--ui-color-focus-ring)` }
                    : { outline: '2px solid var(--ui-color-focus-ring)', outlineOffset: v };
                return <div className="tokens-swatch" style={{ ...ring, margin: 4, width: 40 }} />;
            }
            return <div className="tokens-bar" style={{ width: v, maxWidth: '100%' }} />;
        }
        default:
            return <code>{v}</code>;
    }
}
