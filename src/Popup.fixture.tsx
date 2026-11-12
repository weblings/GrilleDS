import { useRef, useState } from 'react';
import { Button, Dialog, Icon, Menu, MenuItem, MenuSeparator, Popover, SubmenuItem } from './index';
import { chevronDownIcon } from './icons';

const noop = () => {};

function ActionsMenu() {
    return (
        <Menu aria-label="Actions" autoFocus={false}>
            <MenuItem id="save">Save</MenuItem>
            <MenuItem id="rename" isDisabled>Rename</MenuItem>
            <MenuSeparator />
            <MenuItem id="delete">Delete</MenuItem>
        </Menu>
    );
}

function CascadeFixture() {
    return (
        <div className="ui-popover" style={{ position: 'static', display: 'inline-block' }}>
            <Menu aria-label="Add node" autoFocus={false}>
                <SubmenuItem id="math" aria-label="Math" label="Math" description="Numeric nodes">
                    <MenuItem id="add" description="Adds two numbers">Add</MenuItem>
                    <MenuItem id="mul">Multiply</MenuItem>
                </SubmenuItem>
                <MenuItem id="out">Output</MenuItem>
            </Menu>
        </div>
    );
}

function SingleSelectFixture() {
    const [mode, setMode] = useState('once');
    return (
        <div className="ui-popover" style={{ position: 'static', display: 'inline-block', minWidth: 140 }}>
            <Menu aria-label="Test mode" autoFocus={false} selectionMode="single" selectedKey={mode} onSelectionChange={setMode}>
                <MenuItem id="once">Once</MenuItem>
                <MenuItem id="live">Live</MenuItem>
            </Menu>
        </div>
    );
}

function PopoverAtPoint() {
    return (
        <Popover isOpen onOpenChange={noop} point={{ x: 120, y: 80 }} isNonModal aria-label="Context">
            <ActionsMenu />
        </Popover>
    );
}

function MenuFixture() {
    return <div className="ui-popover" style={{ position: 'static', display: 'inline-block' }}><ActionsMenu /></div>;
}

function DialogFixture() {
    const ref = useRef<HTMLButtonElement>(null);
    return (
        <>
            {/* Stands in for the trigger the popover drops down from, as in a title menu. */}
            <span ref={ref} style={{ display: 'inline-block' }}><Button>File <Icon icon={chevronDownIcon} size="sm" /></Button></span>
            <Popover isOpen onOpenChange={noop} triggerRef={ref} isNonModal>
                <Dialog aria-label="Effect"><ActionsMenu /></Dialog>
            </Popover>
        </>
    );
}

// Click the trigger while the menu is open: it should close and stay closed, not flash back open.
function TriggerToggleFixture() {
    const ref = useRef<HTMLSpanElement>(null);
    const [open, setOpen] = useState(true);
    return (
        <>
            <span ref={ref} style={{ display: 'inline-block' }}><Button onPress={() => setOpen((o) => !o)}>View <Icon icon={chevronDownIcon} size="sm" /></Button></span>
            <Popover isOpen={open} onOpenChange={setOpen} triggerRef={ref} isNonModal>
                <ActionsMenu />
            </Popover>
        </>
    );
}

// Plain buttons carrying aria-expanded: the chevron flips with the attribute alone.
function ChevronStatesFixture() {
    return (
        <div style={{ display: 'flex', gap: 12 }}>
            <Button aria-expanded="false">Closed <Icon icon={chevronDownIcon} size="sm" /></Button>
            <Button aria-expanded="true">Open <Icon icon={chevronDownIcon} size="sm" /></Button>
        </div>
    );
}

export default {
    'Trigger chevron states': <ChevronStatesFixture />,
    'Popover at a point': <PopoverAtPoint />,
    Menu: <MenuFixture />,
    'Menu single select': <SingleSelectFixture />,
    'Menu with submenu': <CascadeFixture />,
    Dialog: <DialogFixture />,
    'Trigger toggles open popover': <TriggerToggleFixture />,
};
