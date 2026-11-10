import { useState } from 'react';
import { Button, Dialog, Modal, TextField } from './index';

function NameEffect() {
    const [open, setOpen] = useState(true);
    const [name, setName] = useState('Untitled effect');
    return (
        <>
            <Button onPress={() => setOpen(true)}>Name effect…</Button>
            <Modal isOpen={open} onOpenChange={setOpen}>
                <Dialog aria-label="Name effect">
                    <TextField label="Name" value={name} onChange={setName} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <Button onPress={() => setOpen(false)}>Cancel</Button>
                        <Button onPress={() => setOpen(false)}>Create</Button>
                    </div>
                </Dialog>
            </Modal>
        </>
    );
}

export default {
    'Name effect': <NameEffect />,
};
