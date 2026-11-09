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

export default {
    closed: <Demo />,
    open: <Demo open />,
    'open, option highlighted': <Highlight option="Backing"><Demo open /></Highlight>,
    'open, option selected': <Demo open initial="Harmony" />,
};
