import { Tabs } from './index';

const panel = (text: string) => <p>{text}</p>;

export default {
    default: (
        <Tabs label="Tabs" tabs={[
            { id: 'a', label: 'First', content: panel('First panel.') },
            { id: 'b', label: 'Second', content: panel('Second panel.') },
        ]} />
    ),
    'second selected': (
        <Tabs label="Tabs" selectedKey="b" tabs={[
            { id: 'a', label: 'First', content: panel('First panel.') },
            { id: 'b', label: 'Second', content: panel('Second panel.') },
        ]} />
    ),
    'long labels': (
        <div style={{ maxWidth: 320 }}>
            <Tabs label="Tabs" tabs={[
                { id: 'a', label: 'A tab label that is rather long', content: panel('First panel.') },
                { id: 'b', label: 'Another long tab label', content: panel('Second panel.') },
                { id: 'c', label: 'Third', content: panel('Third panel.') },
            ]} />
        </div>
    ),
};
