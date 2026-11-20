import { useRef, useState } from 'react';
import { useDragAndDrop, type DropTarget } from 'react-aria-components';
import { Button, Drawer, Icon, Menu, MenuItem, Popover, Tree, TreeCard, TreeDragHandle, TreeDropIndicator, TreeSection } from './index';
import { menuHorizontalIcon } from './icons';

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
                            drag={<TreeDragHandle aria-label={`Drag the ${s.title} section`} />}
                            menu={<RowMenu label={`${s.title} section actions`} />}
                        >
                            {s.cards.map((c) => (
                                <TreeCard key={c} id={`${s.id}:${c}`} textValue={c}>
                                    <TreeDragHandle aria-label={`Drag ${c}`} />
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

type Section = { id: string; title: string; cards: string[] };

function Draggable() {
    const [expanded, setExpanded] = useState<Set<string>>(new Set(['general', 'colour', 'empty']));
    const [secs, setSecs] = useState<Section[]>(sections.map((s) => ({ ...s })));
    const dragging = useRef<string | null>(null);
    const isSection = (k: string) => secs.some((x) => x.id === k);
    const { dragAndDropHooks } = useDragAndDrop({
        getItems: (keys) => [...keys].map((k) => ({ 'text/plain': String(k) })),
        onDragStart: (e) => { dragging.current = String([...e.keys][0]); },
        onDragEnd: () => { dragging.current = null; },
        // Cards cannot go before or after a section (the top level), sections never nest.
        getDropOperation: (target: DropTarget) => {
            const k = dragging.current;
            if (target.type === 'root' || !k) return 'cancel';
            const t = String(target.key);
            if (isSection(k)) return isSection(t) && t !== k && target.dropPosition !== 'on' ? 'move' : 'cancel';
            if (isSection(t)) return target.dropPosition === 'on' ? 'move' : 'cancel';
            return t === k || target.dropPosition === 'on' ? 'cancel' : 'move';
        },
        onMove: (e) => {
            const k = String([...e.keys][0]);
            const t = String(e.target.key);
            const after = e.target.dropPosition === 'after';
            setSecs((cur) => {
                if (isSection(k)) {
                    const moving = cur.find((x) => x.id === k)!;
                    const rest = cur.filter((x) => x !== moving);
                    const i = rest.findIndex((x) => x.id === t);
                    rest.splice(after ? i + 1 : i, 0, moving);
                    return rest;
                }
                const name = k.split(':')[1];
                const stripped = cur.map((x) => ({ ...x, cards: x.cards.filter((c) => c !== name) }));
                return stripped.map((x) => {
                    if (x.id === t) return { ...x, cards: [...x.cards, name] };
                    const i = x.cards.findIndex((c) => `${x.id}:${c}` === t);
                    if (i < 0) return x;
                    const cards = [...x.cards];
                    cards.splice(after ? i + 1 : i, 0, name);
                    return { ...x, cards };
                });
            });
        },
        renderDropIndicator: (target) => (
            <TreeDropIndicator target={target} child={target.type === 'item' && !isSection(String(target.key))} />
        ),
    });
    return (
        <div style={{ maxWidth: 320 }}>
            <Tree aria-label="Draggable controls" expandedKeys={expanded} onExpandedChange={setExpanded} dragAndDropHooks={dragAndDropHooks}>
                {secs.map((s) => (
                    <TreeSection key={s.id} id={s.id} title={s.title} count={s.cards.length} drag={<TreeDragHandle aria-label={`Drag the ${s.title} section`} />}>
                        {s.cards.map((c) => (
                            <TreeCard key={c} id={`${s.id}:${c}`} textValue={c}>
                                <TreeDragHandle aria-label={`Drag ${c}`} />
                                <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c}</span>
                            </TreeCard>
                        ))}
                    </TreeSection>
                ))}
            </Tree>
        </div>
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
    'Drag and drop': <Draggable />,
    'In a drawer': <InDrawer />,
};
