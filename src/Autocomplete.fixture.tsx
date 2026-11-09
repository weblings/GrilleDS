import { useState } from 'react';
import { Autocomplete, FieldList, ListBox, ListBoxItem, Section } from './index';

function Browser({ initial = '', flat = false }: { initial?: string; flat?: boolean }) {
    const [q, setQ] = useState(initial);
    return (
        <FieldList>
            <Autocomplete label="Add node" value={q} onChange={setQ} placeholder="Search">
                <ListBox aria-label="Nodes" emptyMessage="No matches">
                    {flat ? (
                        <>
                            <ListBoxItem id="gain">Gain</ListBoxItem>
                            <ListBoxItem id="mixer">Mixer</ListBoxItem>
                            <ListBoxItem id="delay">Delay</ListBoxItem>
                        </>
                    ) : (
                        <>
                            <Section title="Audio">
                                <ListBoxItem id="gain">Gain</ListBoxItem>
                                <ListBoxItem id="mixer">Mixer</ListBoxItem>
                            </Section>
                            <Section title="Effects">
                                <ListBoxItem id="delay">Delay</ListBoxItem>
                                <ListBoxItem id="reverb">Reverb</ListBoxItem>
                            </Section>
                        </>
                    )}
                </ListBox>
            </Autocomplete>
        </FieldList>
    );
}

export default {
    'sectioned': <Browser />,
    'flat': <Browser flat />,
    'filtered, one section left': <Browser initial="rev" />,
    'filtered, no matches': <Browser initial="zzz" />,
};
