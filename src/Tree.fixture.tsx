import { useRef, useState } from 'react';
import { Button, Drawer, Icon, Menu, MenuItem, Popover, Tree, TreeCard, TreeSection } from './index';
import { gripIcon, menuHorizontalIcon } from './icons';

const sections = [
    { id: 'general', title: 'General', cards: ['Threshold', 'Blur radius'] },
    { id: 'colour', title: 'Colour', cards: ['Hue', 'Saturation', 'A control with a label long enough to be truncated by the row'] },
    { id: 'empty', title: 'Empty section', cards: [] as string[] },
];

function RowMenu({ label }: { label: string }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);
    return (
        <>
            <span ref={ref} style={{ display: 'inline-flex' }}>
                <Button variant="ghost" size="sm" icon aria-label={label} aria-expanded={open} onPress={() => setOpen((o) => !o)}><Icon icon={menuHorizontalIcon} size="sm" /></Button>
            </span>
            <Popover isOpen={open} onOpenChange={setOpen} triggerRef={ref} isNonModal>
                <Menu aria-label={label} autoFocus="first" onAction={() => setOpen(false)}><MenuItem id="rename">Rename</MenuItem><MenuItem id="delete">Delete</MenuItem></Menu>
            </Popover>
        </>
    );
}

function Controlled() {
    const [expanded, setExpanded] = useState<Set<string>>(new Set(['general']));
    return (
        <>
            <Button onPress={() => setExpanded(new Set())}>Collapse all</Button>
            <Button onPress={() => setExpanded(new Set(sections.map((s) => s.id)))}>Expand all</Button>
            <p>Expanded: {Array.from(expanded).join(', ') || 'none'}</p>
            <div style={{ maxWidth: 320 }}>
                <Tree aria-label="Controls" expandedKeys={expanded} onExpandedChange={setExpanded}>
                    {sections.map((s) => (
                        <TreeSection
                            key={s.id}
                            id={s.id}
                            title={s.title}
                            count={s.cards.length}
                            drag={<span aria-hidden="true"><Icon icon={gripIcon} size="sm" /></span>}
                            menu={<RowMenu label={`${s.title} section actions`} />}
                        >
                            {s.cards.map((c) => (
                                <TreeCard key={c} id={`${s.id}:${c}`} textValue={c}>
                                    <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c}</span>
                                </TreeCard>
                            ))}
                        </TreeSection>
                    ))}
                </Tree>
            </div>
        </>
    );
}

function InDrawer() {
    return (
        <Drawer isOpen onOpenChange={() => {}} title="Controls" hideControls top={0}>
            <Controlled />
        </Drawer>
    );
}

export default {
    'Sections and cards': <Controlled />,
    'In a drawer': <InDrawer />,
};
