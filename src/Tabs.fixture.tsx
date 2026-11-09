import { Tabs } from './index';

export default (
    <Tabs label="Tabs" tabs={[
        { id: 'a', label: 'First', content: <p>First panel.</p> },
        { id: 'b', label: 'Second', content: <p>Second panel.</p> },
    ]} />
);
