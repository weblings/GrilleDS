import { useRef, useState } from 'react';
import { Button, Drawer, FieldList, Icon, Menu, MenuItem, Popover, TextField } from './index';
import { menuHorizontalIcon } from './icons';

function BottomDetails() {
    const [open, setOpen] = useState(true);
    const [clicks, setClicks] = useState(0);
    return (
        <>
            <Button onPress={() => setClicks(clicks + 1)}>Canvas clicks: {clicks}</Button>
            <Button onPress={() => setOpen(true)}>Details</Button>
            <Drawer isOpen={open} onOpenChange={setOpen} title="Sample zones" side="bottom" top={48}>
                <FieldList><TextField label="Label" value="Sample zones" onChange={() => {}} /></FieldList>
            </Drawer>
        </>
    );
}

function NodeDetails() {
    const [open, setOpen] = useState(true);
    const [label, setLabel] = useState('Sample zones');
    return (
        <>
            <Button onPress={() => setOpen(true)}>Details</Button>
            <Drawer isOpen={open} onOpenChange={setOpen} title="Sample zones" subtitle="What this node does to the image." top={48}>
                <FieldList><TextField label="Label" value={label} onChange={setLabel} /></FieldList>
            </Drawer>
        </>
    );
}

// A head menu button (ghost icon) with a count, and no built-in controls: the host closes from a menu item.
function HeadMenu({ side }: { side: 'right' | 'bottom' }) {
    const [open, setOpen] = useState(true);
    const [menu, setMenu] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);
    return (
        <>
            <Button onPress={() => setOpen(true)}>Tuning</Button>
            <Drawer
                isOpen={open}
                onOpenChange={setOpen}
                title="Tuning"
                count={12}
                side={side}
                top={48}
                hideControls
                actions={
                    <span ref={ref} style={{ display: 'inline-flex' }}>
                        <Button variant="ghost" icon aria-label="Tuning menu" aria-expanded={menu} onPress={() => setMenu((m) => !m)}><Icon icon={menuHorizontalIcon} /></Button>
                    </span>
                }
            >
                <FieldList><TextField label="Label" value="Sample zones" onChange={() => {}} /></FieldList>
            </Drawer>
            <Popover isOpen={menu} onOpenChange={setMenu} triggerRef={ref} isNonModal>
                <Menu aria-label="Tuning" autoFocus="first" onAction={(key) => { setMenu(false); if (key === 'hide') setOpen(false); }}>
                    <MenuItem id="add">Add section</MenuItem>
                    <MenuItem id="hide">Hide Tuning</MenuItem>
                </Menu>
            </Popover>
        </>
    );
}

// Actions beside the built-in close: the divider between them draws on its own.
function ActionsWithControls() {
    const [open, setOpen] = useState(true);
    return (
        <Drawer
            isOpen={open}
            onOpenChange={setOpen}
            title="Tuning"
            count={12}
            top={48}
            actions={<Button variant="ghost" icon aria-label="Tuning menu"><Icon icon={menuHorizontalIcon} /></Button>}
        >
            <FieldList><TextField label="Label" value="Sample zones" onChange={() => {}} /></FieldList>
        </Drawer>
    );
}

export default {
    'Node details': <NodeDetails />,
    'Bottom, half or full': <BottomDetails />,
    'Head menu and count, right': <HeadMenu side="right" />,
    'Head menu and count, bottom': <HeadMenu side="bottom" />,
    'Actions with built-in controls': <ActionsWithControls />,
};
