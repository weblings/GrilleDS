import { useState } from 'react';
import { FieldList, FieldNote, FileTrigger, Select, Slider, TextField } from './index';

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

export default {
    TextField: <TextFieldDemo />,
    FileTrigger: <FileTriggerDemo />,
    Select: <SelectDemo />,
    Slider: <SliderDemo />,
};
