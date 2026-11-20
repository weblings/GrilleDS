import { useEffect, useRef, useState } from 'react';
import { Button, Dialog, Icon, Menu, MenuItem, MenuSection, MenuSeparator, Popover, SubmenuItem } from './index';
import { chevronDownIcon, dotIcon } from './icons';

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

// Open > reproduces Aurora's case: long titles cut off with an ellipsis, the full title as a row tooltip only when cut off.
const cutOff = { display: 'block', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as const;
const longTitle = 'A very long effect title that is cut off in the menu';

function RowTooltipFixture() {
    return (
        <div className="ui-popover" style={{ position: 'static', display: 'inline-block', width: 220 }}>
            <Menu aria-label="Graph" autoFocus={false}>
                <MenuItem id="rename" tooltip="Rename this effect">Rename</MenuItem>
                <SubmenuItem id="open" aria-label="Open" label="Open">
                    <MenuItem id="long" tooltip={longTitle} tooltipOnlyWhenTruncated description="Unsaved changes"><span style={cutOff}>{longTitle}</span></MenuItem>
                    <MenuItem id="short" tooltip="Sunset" tooltipOnlyWhenTruncated><span style={cutOff}>Sunset</span></MenuItem>
                </SubmenuItem>
            </Menu>
        </div>
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

const effects = (group: string, n: number) => Array.from({ length: n }, (_, i) => `${group} effect ${i + 1}`);

function LongGroupedSubmenuFixture() {
    return (
        <div className="ui-popover" style={{ position: 'static', display: 'inline-block', minWidth: 160 }}>
            <Menu aria-label="Graph" autoFocus={false}>
                <SubmenuItem id="open" aria-label="Open" label="Open">
                    <MenuSection title="Custom">
                        {effects('Custom', 12).map((e) => <MenuItem key={e} id={e}>{e}</MenuItem>)}
                    </MenuSection>
                    <MenuSection title="Built-in">
                        {effects('Built-in', 30).map((e) => <MenuItem key={e} id={e}>{e}</MenuItem>)}
                    </MenuSection>
                    <MenuSection title={<>Not saved yet <Icon icon={dotIcon} size="sm" /><span className="ui-visually-hidden">, unsaved changes</span></>}>
                        <MenuItem id="draft">Draft effect</MenuItem>
                    </MenuSection>
                </SubmenuItem>
                <SubmenuItem id="short" aria-label="Short" label="Short list" maxHeight={120}>
                    {effects('Item', 8).map((e) => <MenuItem key={e} id={e}>{e}</MenuItem>)}
                </SubmenuItem>
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

function DescribedMenuFixture() {
    return (
        <div className="ui-popover" style={{ position: 'static', display: 'inline-block' }}>
            <Dialog aria-label="Node">
                <p id="node-description" style={{ margin: 0, padding: '8px 12px' }}>Adds two numbers and outputs the sum.</p>
                <Menu aria-label="Add node actions" aria-describedby="node-description" autoFocus={false}>
                    <MenuItem id="add">Add to graph</MenuItem>
                    <MenuItem id="docs">Show help</MenuItem>
                </Menu>
            </Dialog>
        </div>
    );
}

// One anchor, popovers at offset 0, 8 and 16 and with a crossOffset. The gap is measured and shown in each popover.
function OffsetCase({ offset, crossOffset, label }: { offset?: number; crossOffset?: number; label: string }) {
    const anchor = useRef<HTMLDivElement>(null);
    const pop = useRef<HTMLDivElement>(null);
    const [gap, setGap] = useState('');
    useEffect(() => {
        const t = setTimeout(() => {
            const a = anchor.current?.getBoundingClientRect();
            const p = pop.current?.getBoundingClientRect();
            if (a && p) setGap(`gap ${Math.round(p.top - a.bottom)}px, shift ${Math.round(p.left - a.left)}px`);
        }, 100);
        return () => clearTimeout(t);
    }, []);
    return (
        <div style={{ display: 'inline-block', margin: '0 120px 120px 0', verticalAlign: 'top' }}>
            <div ref={anchor} style={{ padding: '6px 12px', border: '1px solid currentColor' }}>{label}</div>
            <Popover isOpen onOpenChange={noop} triggerRef={anchor} isNonModal offset={offset} crossOffset={crossOffset} aria-label={label}>
                <div ref={pop} style={{ padding: 8 }}>{gap || 'measuring'}</div>
            </Popover>
        </div>
    );
}

function OffsetFixture() {
    return (
        <div style={{ padding: 24 }}>
            <OffsetCase label="offset 0" offset={0} />
            <OffsetCase label="offset 8" offset={8} />
            <OffsetCase label="offset 16" offset={16} />
            <OffsetCase label="offset 8, crossOffset 24" offset={8} crossOffset={24} />
            <OffsetCase label="omitted (default)" />
        </div>
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
            <span ref={ref} style={{ display: 'inline-block' }}><Button aria-expanded>File <Icon icon={chevronDownIcon} size="sm" /></Button></span>
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
            <span ref={ref} style={{ display: 'inline-block' }}><Button aria-expanded={open} onPress={() => setOpen((o) => !o)}>View <Icon icon={chevronDownIcon} size="sm" /></Button></span>
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
    'Popover offset': <OffsetFixture />,
    'Menu with a description': <DescribedMenuFixture />,
    'Menu single select': <SingleSelectFixture />,
    'Menu with submenu': <CascadeFixture />,
    'Menu row tooltips': <RowTooltipFixture />,
    'Menu long grouped submenu': <LongGroupedSubmenuFixture />,
    Dialog: <DialogFixture />,
    'Trigger toggles open popover': <TriggerToggleFixture />,
};
