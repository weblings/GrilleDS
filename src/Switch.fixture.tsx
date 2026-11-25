import { useState } from 'react';
import { Switch } from './index';

function Controlled({ initial, isDisabled }: { initial: boolean; isDisabled?: boolean }) {
    const [on, setOn] = useState(initial);
    return <Switch label="Active" isSelected={on} onChange={setOn} isDisabled={isDisabled} />;
}

export default {
    off: <Controlled initial={false} />,
    on: <Controlled initial />,
    'disabled off': <Controlled initial={false} isDisabled />,
    'disabled on': <Controlled initial isDisabled />,
    // Tab onto the switch to see the ring; the fixture can't force :focus-visible.
    'in a row': (
        <div style={{ width: 240, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Controlled initial />
            <Controlled initial={false} />
        </div>
    ),
};
