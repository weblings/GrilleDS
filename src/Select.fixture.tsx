import { useEffect, useState, type ReactNode } from 'react';
import { FieldList, Select } from './index';

const options = ['Vocals', 'Backing', 'Harmony'];

// Moves focus to the named option once the list is open, so it shows the highlight.
function Highlight({ option, children }: { option: string; children: ReactNode }) {
    useEffect(() => {
        let tries = 0;
        let frame = 0;
        const settle = () => {
            const el = [...document.querySelectorAll<HTMLElement>('[role="option"]')].find((o) => o.textContent === option);
            if (el) el.focus();
            else if (tries++ < 20) frame = requestAnimationFrame(settle);
        };
        frame = requestAnimationFrame(settle);
        return () => cancelAnimationFrame(frame);
    }, [option]);
    return <>{children}</>;
}

function Demo({ initial = 'Vocals', open = false }: { initial?: string; open?: boolean }) {
    const [choice, setChoice] = useState(initial);
    return <FieldList><Select label="Select" options={options} value={choice} onChange={setChoice} defaultOpen={open} /></FieldList>;
}

const rates = [{ id: '0', label: 'Auto' }, { id: '60', label: '60 Hz' }, { id: '120', label: '120 Hz' }];

function Labelled({ disabled, fullWidth }: { disabled?: boolean; fullWidth?: boolean }) {
    const [id, setId] = useState('60');
    return <div style={{ width: 360 }}><FieldList><Select label="Refresh" options={rates} value={id} onChange={setId} isDisabled={disabled} fullWidth={fullWidth} /></FieldList></div>;
}

export default {
    closed: <Demo />,
    open: <Demo open />,
    'open, option highlighted': <Highlight option="Backing"><Demo open /></Highlight>,
    'open, option selected': <Demo open initial="Harmony" />,
    'id and label options': <Labelled />,
    disabled: <Labelled disabled />,
    'full width': <Labelled fullWidth />,
};
