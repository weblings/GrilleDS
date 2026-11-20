import { useState } from 'react';
import { Button, Dialog, MessageRow, Modal, TextField } from './index';

function FieldDialog({ multiline }: { multiline?: boolean }) {
    const [open, setOpen] = useState(true);
    const [text, setText] = useState('');
    const invalid = text.trim() === '';
    const errorId = multiline ? 'tooltip-error' : 'name-error';
    return (
        <>
            <Button onPress={() => setOpen(true)}>{multiline ? 'Edit tooltip…' : 'Rename…'}</Button>
            <Modal isOpen={open} onOpenChange={setOpen}>
                <Dialog aria-label={multiline ? 'Edit tooltip' : 'Rename'}>
                    <TextField
                        aria-label={multiline ? 'Tooltip' : 'Name'}
                        value={text}
                        onChange={setText}
                        placeholder={multiline ? 'Tooltip' : 'Untitled effect'}
                        multiline={multiline}
                        autoFocus
                        isInvalid={invalid}
                        aria-describedby={invalid ? errorId : undefined}
                    />
                    {invalid && <MessageRow id={errorId} tone="error" message="Enter some text." />}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <Button onPress={() => setOpen(false)}>Cancel</Button>
                        <Button onPress={() => setOpen(false)}>Save</Button>
                    </div>
                </Dialog>
            </Modal>
        </>
    );
}

export default {
    'TextField in a Dialog': <FieldDialog />,
    'TextField, multi-line in a Dialog': <FieldDialog multiline />,
};
