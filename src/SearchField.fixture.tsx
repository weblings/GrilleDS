import { useState } from 'react';
import { FieldList, SearchField } from './index';

function Demo({ initial = '' }: { initial?: string }) {
    const [q, setQ] = useState(initial);
    return <FieldList><SearchField label="Search" value={q} onChange={setQ} placeholder="Type to search" /></FieldList>;
}

export default { empty: <Demo />, filled: <Demo initial="reverb" /> };
