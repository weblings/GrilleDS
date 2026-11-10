import { useState } from 'react';
import { FieldList, FieldNote, FileTrigger, Select, Slider, TextField } from './index';

const noop = () => {};

function TextFieldDemo() {
    const [text, setText] = useState('Artist');
    return <FieldList><TextField label="TextField" value={text} onChange={setText} /></FieldList>;
}

function FileTriggerDemo() {
    const [file, setFile] = useState<string | null>(null);
    return (
        <FieldList>
            <FileTrigger label="FileTrigger" accept={['.ogg']} fileName={file} onSelect={(f) => setFile(f?.name ?? null)} />
            <FieldNote>*FieldNote text.</FieldNote>
        </FieldList>
    );
}

function SelectDemo() {
    const [choice, setChoice] = useState('Vocals');
    return <FieldList><Select label="Select" options={['Vocals', 'Backing', 'Harmony']} value={choice} onChange={setChoice} /></FieldList>;
}

function SliderDemo() {
    const [level, setLevel] = useState(1);
    return <FieldList><Slider label="Slider" min={0} max={5} step={0.5} value={level} onChange={setLevel} /></FieldList>;
}

function TextFieldLong() {
    const [text, setText] = useState('A very long value that runs past the visible width of the input and has to scroll inside it');
    return <FieldList><TextField label="A label long enough that it may wrap beside the input" value={text} onChange={setText} /></FieldList>;
}

function FileTriggerChosen({ layout }: { layout?: 'inline' }) {
    const [file, setFile] = useState<string | null>('a-very-long-file-name-that-needs-to-be-truncated-or-wrapped.ogg');
    return <FieldList><FileTrigger label="FileTrigger" layout={layout} accept={['.ogg']} fileName={file} onSelect={(f) => setFile(f?.name ?? null)} /></FieldList>;
}

function SliderAt({ value }: { value: number }) {
    const [level, setLevel] = useState(value);
    return <FieldList><Slider label="Slider" min={0} max={5} step={0.5} value={level} onChange={setLevel} /></FieldList>;
}

export default {
    TextField: <TextFieldDemo />,
    'TextField, empty': <FieldList><TextField label="TextField" value="" onChange={noop} /></FieldList>,
    'TextField, long text': <TextFieldLong />,
    FileTrigger: <FileTriggerDemo />,
    'FileTrigger, file chosen': <FileTriggerChosen />,
    'FileTrigger, inline': <FileTriggerChosen layout="inline" />,
    Select: <SelectDemo />,
    'Select, long option': <FieldList><Select label="Select" options={['An option label that is much longer than the others in the list', 'Short']} value="Short" onChange={noop} /></FieldList>,
    Slider: <SliderDemo />,
    'Slider, at minimum': <SliderAt value={0} />,
    'Slider, at maximum': <SliderAt value={5} />,
};
