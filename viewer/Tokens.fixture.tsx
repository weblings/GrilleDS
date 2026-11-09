import tokens from '../tokens/tokens.json';
import base from './generated/base-tokens.json';
import { TokenPreview } from './TokenPreview';
import { diffTokens, flattenTokens, groupTokens, type Token } from './tokenModel';

const head = flattenTokens(tokens);

function Row({ token }: { token: Token }) {
    return (
        <div className="tokens-row">
            <TokenPreview token={token} />
            <div>
                <div>{token.path}</div>
                <code>{token.cssVar}</code>
            </div>
            <code>{token.value}</code>
            <code>{token.raw !== token.value && typeof token.raw === 'string' ? `→ ${token.raw}` : ''}</code>
        </div>
    );
}

function TokensPage() {
    // One section per top-level family, one sub-heading per group within it.
    const families = new Map<string, [string, Token[]][]>();
    for (const [group, list] of groupTokens(head)) {
        const family = group.split('.')[0];
        families.set(family, [...(families.get(family) ?? []), [group, list]]);
    }
    return (
        <div className="tokens-page">
            {[...families].map(([family, groups]) => (
                <section key={family}>
                    <h2>{family}</h2>
                    {groups.map(([group, list]) => (
                        <div key={group}>
                            <h3>{group}</h3>
                            {list.map((t) => <Row key={t.path} token={t} />)}
                        </div>
                    ))}
                </section>
            ))}
        </div>
    );
}

function DiffSection({ title, children }: { title: string; children: React.ReactNode[] }) {
    return children.length ? (
        <section>
            <h2>{title} ({children.length})</h2>
            {children}
        </section>
    ) : null;
}

function TokensDiffPage() {
    if (!base.tokens) {
        return <p className="tokens-page">No base tokens: git could not read tokens/tokens.json at “{base.ref}”. Run npm run build:tokens with GRILLE_BASE_REF set to a reachable ref.</p>;
    }
    const diff = diffTokens(flattenTokens(base.tokens), head);
    const none = !diff.added.length && !diff.removed.length && !diff.changed.length;
    return (
        <div className="tokens-page">
            <p>Tokens against <code>{base.ref}</code>.{none && ' No differences.'}</p>
            <DiffSection title="Added">{diff.added.map((t) => <Row key={t.path} token={t} />)}</DiffSection>
            <DiffSection title="Changed">
                {diff.changed.map(({ before, after }) => (
                    <div className="tokens-row" key={after.path}>
                        <div className="tokens-diff-pair">
                            <TokenPreview token={before} />
                            <TokenPreview token={after} />
                        </div>
                        <div>
                            <div>{after.path}</div>
                            <code>{after.cssVar}</code>
                        </div>
                        <code>{before.value}</code>
                        <code>→ {after.value}</code>
                    </div>
                ))}
            </DiffSection>
            <DiffSection title="Removed">{diff.removed.map((t) => <Row key={t.path} token={t} />)}</DiffSection>
        </div>
    );
}

export default {
    Tokens: <TokensPage />,
    'Tokens diff': <TokensDiffPage />,
};
