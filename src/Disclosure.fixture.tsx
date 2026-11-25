import { useState } from 'react';
import { Button, Disclosure } from './index';

function Driven() {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ maxWidth: 320, padding: '0 21px' }}>
            <Button onPress={() => setOpen(true)}>See all zones</Button>
            <Disclosure variant="accordion" title="Bridge" isExpanded={open} onExpandedChange={setOpen}><p>Zones list.</p></Disclosure>
        </div>
    );
}

export default {
    default: <Disclosure title="Disclosure"><p>Panel content.</p></Disclosure>,
    'long text': (
        <div style={{ maxWidth: 320 }}>
            <Disclosure title="A disclosure title long enough that it wraps onto a second line"><p>A long line of text that keeps going well past the width of the container so that it has to wrap onto several lines and shows how the component copes with it.</p></Disclosure>
        </div>
    ),
    'accordion closed': <div style={{ maxWidth: 320, padding: '0 21px' }}><Disclosure variant="accordion" title="Tuning"><p>Panel content.</p></Disclosure></div>,
    'accordion open': <div style={{ maxWidth: 320, padding: '0 21px' }}><Disclosure variant="accordion" title="Tuning" defaultExpanded><p>Panel content.</p></Disclosure></div>,
    'accordion driven from outside': <Driven />,
};
