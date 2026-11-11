import { useRef } from 'react';
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

export default {
    'Popover at a point': <PopoverAtPoint />,
    Menu: <MenuFixture />,
    'Menu with submenu': <CascadeFixture />,
    Dialog: <DialogFixture />,
};
