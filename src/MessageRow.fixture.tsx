import { Button, MessageRow, squareChatIcon } from './index';

const one = 'Could not save the effect.';
const two = 'Could not save the effect because the name is already used by another effect in this graph.';
const six = 'Could not save the effect. The name is already used by another effect in this graph, and the graph cannot hold two effects with the same name, so pick a different one and try again. If the problem continues, check that the project is not read-only and that there is free disk space.';
const lines = { '1 line': one, '2 lines': two, '6 lines': six };

// A narrow box makes the 2 and 6 line texts wrap to roughly those line counts.
const box = (width: number, node: React.ReactNode) => <div style={{ width }}>{node}</div>;

const buttons = (
    <div style={{ display: 'flex', gap: 8 }}>
        <Button>Retry</Button>
        <Button>Stop test</Button>
    </div>
);

const fixtures: Record<string, React.ReactNode> = {};
for (const tone of ['error', 'notice'] as const) {
    for (const [name, text] of Object.entries(lines)) {
        const width = name === '1 line' ? 420 : name === '2 lines' ? 320 : 280;
        fixtures[`${tone} ${name}`] = box(width, <MessageRow tone={tone} message={text} />);
        fixtures[`${tone} ${name} with buttons`] = box(width, <MessageRow tone={tone} message={text}>{buttons}</MessageRow>);
        fixtures[`${tone} ${name} with dismiss`] = box(width, <MessageRow tone={tone} message={text} onDismiss={() => {}} />);
        fixtures[`${tone} ${name} with buttons and dismiss`] = box(width, <MessageRow tone={tone} message={text} onDismiss={() => {}}>{buttons}</MessageRow>);
    }
}

for (const tone of ['error', 'notice'] as const) {
    fixtures[`${tone} custom icon`] = box(420, <MessageRow tone={tone} icon={squareChatIcon} message={one} />);
}

export default fixtures;
