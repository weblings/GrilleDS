import { useState } from 'react';
import { Button, Dialog, DialogActions, MessageRow, Modal, TextField } from './index';

function NameEffect() {
    const [open, setOpen] = useState(true);
    const [name, setName] = useState('');
    const invalid = name.trim() === '';
    return (
        <>
            <Button onPress={() => setOpen(true)}>Name effect…</Button>
            <Modal isOpen={open} onOpenChange={setOpen}>
                <Dialog title="Name effect">
                    <TextField
                        aria-label="Name"
                        autoFocus
                        placeholder="Effect name"
                        value={name}
                        onChange={setName}
                        isInvalid={invalid}
                        aria-describedby={invalid ? 'name-error' : undefined}
                    />
                    {invalid && <MessageRow id="name-error" tone="error" message="Enter a name." />}
                    <DialogActions>
                        <Button size="action" onPress={() => setOpen(false)}>Cancel</Button>
                        <Button size="action" variant="primary" isDisabled={invalid} onPress={() => setOpen(false)}>Create</Button>
                    </DialogActions>
                </Dialog>
            </Modal>
        </>
    );
}

export default {
    'Name effect': <NameEffect />,
};
