import { useState } from 'react';
import { Button, Drawer, TextField } from './index';

function BottomDetails() {
    const [open, setOpen] = useState(true);
    const [clicks, setClicks] = useState(0);
    return (
        <>
            <Button onPress={() => setClicks(clicks + 1)}>Canvas clicks: {clicks}</Button>
            <Button onPress={() => setOpen(true)}>Details</Button>
            <Drawer isOpen={open} onOpenChange={setOpen} title="Sample zones" side="bottom" top={48}>
                <TextField label="Label" value="Sample zones" onChange={() => {}} />
            </Drawer>
        </>
    );
}

function NodeDetails() {
    const [open, setOpen] = useState(true);
    const [label, setLabel] = useState('Sample zones');
    return (
        <>
            <Button onPress={() => setOpen(true)}>Details</Button>
            <Drawer isOpen={open} onOpenChange={setOpen} title="Sample zones" subtitle="What this node does to the image." top={48}>
                <TextField label="Label" value={label} onChange={setLabel} />
            </Drawer>
        </>
    );
}

export default {
    'Node details': <NodeDetails />,
    'Bottom, half or full': <BottomDetails />,
};
