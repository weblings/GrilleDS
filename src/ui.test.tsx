// @vitest-environment jsdom
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { useRef, useState } from 'react';
import * as icons from './icons';
import { chevronDownIcon, type IconData } from './icons';
import { Icon, Autocomplete, ListBox, ListBoxItem, Section, SearchField, Button, Callout, Dialog, Drawer, Menu, MenuItem, SubmenuItem, Modal, Popover, Disclosure, FieldList, FieldNote, FileTrigger, mountIsland, Select, Slider, StatusMessage, Tabs, TextField } from './index';

afterEach(cleanup);

async function expectNoViolations(container: HTMLElement) {
    const results = await axe(container);
    expect(results.violations).toEqual([]);
}

describe('Button', () => {
    it('fires onPress and respects isDisabled', async () => {
        const onPress = vi.fn();
        const { rerender } = render(<Button onPress={onPress}>Go</Button>);
        await userEvent.click(screen.getByRole('button', { name: 'Go' }));
        expect(onPress).toHaveBeenCalledTimes(1);

        rerender(<Button isDisabled onPress={onPress}>Go</Button>);
        await userEvent.click(screen.getByRole('button', { name: 'Go' }));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('has no axe violations', async () => {
        const { container } = render(<Button variant="primary">Download</Button>);
        await expectNoViolations(container);
    });
});

describe('TextField', () => {
    it('is named by its label and reports typed values', async () => {
        const onChange = vi.fn();
        render(<TextField label="Artist" value="" onChange={onChange} />);
        await userEvent.type(screen.getByRole('textbox', { name: 'Artist' }), 'A');
        expect(onChange).toHaveBeenLastCalledWith('A');
    });

    it('has no axe violations', async () => {
        const { container } = render(<FieldList><TextField label="Artist" value="x" onChange={() => {}} /></FieldList>);
        await expectNoViolations(container);
    });
});

describe('FileTrigger', () => {
    it('shows the filename from props and a placeholder when empty', () => {
        const { rerender } = render(<FileTrigger label="Audio" accept={['.ogg']} fileName={null} onSelect={() => {}} />);
        expect(screen.getByText('No file chosen')).toBeTruthy();
        rerender(<FileTrigger label="Audio" accept={['.ogg']} fileName="song.ogg" onSelect={() => {}} />);
        expect(screen.getByText('song.ogg')).toBeTruthy();
    });

    it('passes the chosen file to onSelect', async () => {
        const onSelect = vi.fn();
        const { container } = render(<FileTrigger label="Audio" accept={['.ogg']} fileName={null} onSelect={onSelect} />);
        const file = new File(['x'], 'song.ogg', { type: 'audio/ogg' });
        await userEvent.upload(container.querySelector('input[type="file"]')!, file);
        expect(onSelect).toHaveBeenCalledWith(file);
    });

    it('has no axe violations', async () => {
        const { container } = render(
            <FieldList>
                <FileTrigger label="Audio" accept={['.ogg']} fileName="song.ogg" onSelect={() => {}} />
                <FieldNote>*Audio must be .ogg format.</FieldNote>
            </FieldList>,
        );
        await expectNoViolations(container);
    });
});

describe('Select', () => {
    const options = ['Vocals', 'Backing', 'Harmony'];

    it('fires onChange once when an option is picked from the open list', async () => {
        const onChange = vi.fn();
        render(<Select label="Lyrics from" options={options} value="Vocals" onChange={onChange} />);
        await userEvent.click(screen.getByRole('button', { name: /Lyrics from/ }));
        await userEvent.click(screen.getByRole('option', { name: 'Backing' }));
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('Backing');
    });

    it('does not fire onChange for arrow keys on the closed trigger', async () => {
        const onChange = vi.fn();
        render(<Select label="Lyrics from" options={options} value="Vocals" onChange={onChange} />);
        screen.getByRole('button', { name: /Lyrics from/ }).focus();
        await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowLeft}');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('draws the chevron as an icon, not a text glyph', () => {
        render(<Select label="Lyrics from" options={options} value="Vocals" onChange={() => {}} />);
        const trigger = screen.getByRole('button');
        expect(trigger.querySelector('svg.ui-icon')).toBeTruthy();
        expect(trigger.textContent).toBe('Vocals');
    });

    it('marks the chevron so an open trigger flips it, on Select and on plain buttons', () => {
        render(<Select label="Lyrics from" options={options} value="Vocals" onChange={() => {}} />);
        expect(screen.getByRole('button').querySelector('svg.ui-icon[data-chevron]')).toBeTruthy();
        const { container } = render(<Button aria-expanded="true">View <Icon icon={chevronDownIcon} size="sm" /></Button>);
        expect(container.querySelector('[aria-expanded="true"] > svg[data-chevron]')).toBeTruthy();
    });

    it('has no axe violations', async () => {
        const { container } = render(<FieldList><Select label="Lyrics from" options={options} value="Vocals" onChange={() => {}} /></FieldList>);
        await expectNoViolations(container);
    });
});

describe('Slider', () => {
    it('steps with arrow keys and reports numeric values', async () => {
        const onChange = vi.fn();
        render(<Slider label="Difficulty" min={0} max={5} step={0.5} value={1} onChange={onChange} />);
        screen.getByRole('slider').focus();
        await userEvent.keyboard('{ArrowRight}');
        expect(onChange).toHaveBeenCalledWith(1.5);
    });

    it('fills the track up to the thumb', () => {
        const { container } = render(<Slider label="Difficulty" min={0} max={5} step={0.5} value={1.5} onChange={() => {}} />);
        const fill = container.querySelector<HTMLElement>('.ui-slider-fill');
        expect(fill?.style.width).toBe('30%');
    });

    it('has no axe violations', async () => {
        const { container } = render(<FieldList><Slider label="Difficulty" min={0} max={5} step={0.5} value={1} onChange={() => {}} /></FieldList>);
        await expectNoViolations(container);
    });
});

describe('Disclosure', () => {
    it('toggles its panel from the trigger', async () => {
        render(<Disclosure title="Show log"><p>log text</p></Disclosure>);
        const trigger = screen.getByRole('button', { name: 'Show log' });
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
        await userEvent.click(trigger);
        expect(trigger.getAttribute('aria-expanded')).toBe('true');
        expect(screen.getByText('log text')).toBeTruthy();
    });

    it('draws its chevron as an icon, not a text glyph', () => {
        render(<Disclosure title="Show log"><p>log text</p></Disclosure>);
        const trigger = screen.getByRole('button', { name: 'Show log' });
        expect(trigger.querySelector('svg.ui-icon')).toBeTruthy();
        expect(trigger.textContent).toBe('Show log');
    });

    it('has no axe violations', async () => {
        const { container } = render(<Disclosure title="Show log"><p>log text</p></Disclosure>);
        await expectNoViolations(container);
    });
});

describe('Tabs', () => {
    const tabs = [
        { id: 'a', label: 'First', content: <p>first body</p> },
        { id: 'b', label: 'Second', content: <p>second body</p> },
    ];

    it('switches tabs and keeps hidden panels mounted', async () => {
        render(<Tabs label="Converter" tabs={tabs} />);
        expect(screen.getByRole('tab', { name: 'First' }).getAttribute('aria-selected')).toBe('true');
        await userEvent.click(screen.getByRole('tab', { name: 'Second' }));
        expect(screen.getByRole('tab', { name: 'Second' }).getAttribute('aria-selected')).toBe('true');
        expect(screen.getByText('first body', { selector: 'p' })).toBeTruthy();
        expect(screen.getByRole('tabpanel').textContent).toBe('second body');
    });

    it('has no axe violations', async () => {
        const { container } = render(<Tabs label="Converter" tabs={tabs} />);
        await expectNoViolations(container);
    });
});

describe('Callout', () => {
    it('draws the warning mark as an icon, not a text glyph', () => {
        render(<Callout title="Heads up"><p>details</p></Callout>);
        const title = screen.getByText('Heads up');
        expect(title.querySelector('svg.ui-icon')).toBeTruthy();
        expect(title.textContent).toBe('Heads up');
    });

    it('renders as a note with its title and body', () => {
        render(<Callout title="Heads up"><p>details</p></Callout>);
        expect(screen.getByRole('note').textContent).toContain('Heads up');
        expect(screen.getByText('details')).toBeTruthy();
    });

    it('has no axe violations', async () => {
        const { container } = render(<Callout title="Heads up"><p>details</p></Callout>);
        await expectNoViolations(container);
    });
});

describe('StatusMessage', () => {
    it('is a polite status region by default and stays mounted when empty', () => {
        render(<StatusMessage />);
        const region = screen.getByRole('status');
        expect(region.getAttribute('aria-live')).toBe('polite');
        expect(region.textContent).toBe('');
    });

    it('becomes an assertive alert with an icon in the error tone when urgent', () => {
        render(<StatusMessage tone="error" urgent>Failed</StatusMessage>);
        const region = screen.getByRole('alert');
        expect(region.getAttribute('data-tone')).toBe('error');
        expect(region.textContent).toBe('Failed');
        expect(region.querySelector('svg.ui-icon')).toBeTruthy();
    });

    it('prefixes the warning tone with a warning icon', () => {
        render(<StatusMessage tone="warning">Partly done</StatusMessage>);
        const region = screen.getByRole('status');
        expect(region.getAttribute('data-tone')).toBe('warning');
        expect(region.textContent).toBe('Partly done');
        expect(region.querySelector('svg.ui-icon')).toBeTruthy();
    });

    it('has no axe violations', async () => {
        const { container } = render(<StatusMessage tone="error">Failed</StatusMessage>);
        await expectNoViolations(container);
    });
});

describe('mountIsland', () => {
    function mount(el: HTMLElement, node: React.ReactNode) {
        let unmount = () => {};
        act(() => { unmount = mountIsland(el, node); });
        return () => act(() => unmount());
    }

    it('renders into the element and clears it on unmount', () => {
        const el = document.createElement('div');
        const unmount = mount(el, <Button>Save</Button>);
        expect(el.querySelector('button')?.textContent).toBe('Save');
        unmount();
        expect(el.childElementCount).toBe(0);
    });

    it('can mount again on the same element', () => {
        const el = document.createElement('div');
        mount(el, <Button>First</Button>)();
        const unmount = mount(el, <Button>Second</Button>);
        expect(el.textContent).toBe('Second');
        unmount();
    });

    it('removes an open popover on unmount', async () => {
        const el = document.body.appendChild(document.createElement('div'));
        const unmount = mount(el, <Select label="Part" options={['Lead', 'Bass']} value="Lead" onChange={() => {}} />);
        await userEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('listbox')).toBeTruthy();
        unmount();
        expect(screen.queryByRole('listbox')).toBeNull();
        el.remove();
    });
});

function Harness({ point, nonModal, onAction, onRestore, onKeyDown }: {
    point?: { x: number; y: number }; nonModal?: boolean; onAction?: (id: string) => void;
    onRestore?: (el: HTMLElement | null) => void; onKeyDown?: (e: React.KeyboardEvent) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLButtonElement>(null);
    return (
        <>
            <button ref={ref} onClick={() => setOpen(true)}>Open</button>
            <button>Elsewhere</button>
            <Popover isOpen={open} onOpenChange={setOpen} triggerRef={ref} point={point} isNonModal={nonModal} onRestoreFocus={onRestore} aria-label="Pop">
                <Menu aria-label="Actions" onAction={(id) => { onAction?.(id); setOpen(false); }} onKeyDown={onKeyDown}>
                    <MenuItem id="save">Save</MenuItem>
                    <MenuItem id="rename">Rename</MenuItem>
                </Menu>
            </Popover>
        </>
    );
}

describe('Menu single selection', () => {
    function Picker({ onChange }: { onChange?: (id: string) => void }) {
        const [mode, setMode] = useState('once');
        return (
            <Menu aria-label="Mode" autoFocus={false} selectionMode="single" selectedKey={mode} onSelectionChange={(id) => { setMode(id); onChange?.(id); }}>
                <MenuItem id="once">Once</MenuItem>
                <MenuItem id="live">Live</MenuItem>
            </Menu>
        );
    }

    it('marks the chosen item as a checked menuitemradio and moves the check on pick', async () => {
        const onChange = vi.fn();
        render(<Picker onChange={onChange} />);
        const once = screen.getByRole('menuitemradio', { name: 'Once' });
        const live = screen.getByRole('menuitemradio', { name: 'Live' });
        expect(once.getAttribute('aria-checked')).toBe('true');
        expect(live.getAttribute('aria-checked')).toBe('false');
        expect(once.querySelector('.ui-menu-check svg')).not.toBeNull();
        expect(live.querySelector('.ui-menu-check')).not.toBeNull();
        expect(live.querySelector('.ui-menu-check svg')).toBeNull();
        await userEvent.click(live);
        expect(onChange).toHaveBeenCalledWith('live');
        expect(screen.getByRole('menuitemradio', { name: 'Live' }).getAttribute('aria-checked')).toBe('true');
    });

    it('leaves plain menus without a check slot', () => {
        render(<Menu aria-label="Plain" autoFocus={false}><MenuItem id="a">A</MenuItem></Menu>);
        expect(screen.getByRole('menuitem', { name: 'A' }).querySelector('.ui-menu-check')).toBeNull();
    });
});

describe('Popover and Menu', () => {
    it('anchors to a point and repositions when the point changes', async () => {
        const { rerender } = render(<Harness point={{ x: 40, y: 50 }} />);
        await userEvent.click(screen.getByRole('button', { name: 'Open' }));
        const first = screen.getByRole('menu').closest('.ui-popover')!;
        expect(first.getAttribute('data-anchor')).toBe('point');
        rerender(<Harness point={{ x: 300, y: 200 }} />);
        const second = screen.getByRole('menu').closest('.ui-popover')!;
        expect(second).not.toBe(first);
    });

    it('runs onAction and passes keys through onKeyDown', async () => {
        const onAction = vi.fn();
        const onKeyDown = vi.fn();
        render(<Harness onAction={onAction} onKeyDown={onKeyDown} />);
        await userEvent.click(screen.getByRole('button', { name: 'Open' }));
        await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
        expect(onKeyDown).toHaveBeenCalled();
        expect(onAction).toHaveBeenCalledWith('rename');
    });

    it('lets the page behind take clicks when non-modal, and reports the focus to restore on close', async () => {
        const onRestore = vi.fn();
        render(<Harness nonModal onRestore={onRestore} />);
        const open = screen.getByRole('button', { name: 'Open' });
        await userEvent.click(open);
        expect(screen.getByRole('menu')).toBeTruthy();
        expect(document.querySelector('[data-react-aria-top-layer]')?.getAttribute('aria-hidden')).not.toBe('true');
        expect(screen.getByRole('button', { name: 'Elsewhere' }).closest('[aria-hidden="true"]')).toBeNull();
        await userEvent.keyboard('{Escape}');
        expect(screen.queryByRole('menu')).toBeNull();
        expect(onRestore).toHaveBeenCalledTimes(1);
        expect(onRestore).toHaveBeenCalledWith(open);
    });

    it('leaves a non-modal popover closed when its trigger is clicked while open, and still closes on Tab out', async () => {
        function Toggle() {
            const [open, setOpen] = useState(false);
            const ref = useRef<HTMLButtonElement>(null);
            return (
                <>
                    <button ref={ref} onClick={() => setOpen((o) => !o)}>Toggle</button>
                    <button>Elsewhere</button>
                    <Popover isOpen={open} onOpenChange={setOpen} triggerRef={ref} isNonModal aria-label="Pop">
                        <Menu aria-label="Actions"><MenuItem id="a">A</MenuItem></Menu>
                    </Popover>
                </>
            );
        }
        render(<Toggle />);
        const toggle = screen.getByRole('button', { name: 'Toggle' });
        await userEvent.click(toggle);
        expect(screen.getByRole('menu')).toBeTruthy();
        await userEvent.click(toggle);
        expect(screen.queryByRole('menu')).toBeNull();
        await userEvent.click(toggle);
        expect(screen.getByRole('menu')).toBeTruthy();
        await userEvent.tab();
        await userEvent.tab();
        expect(screen.queryByRole('menu')).toBeNull();
    });

    it('has no axe violations', async () => {
        const { container } = render(<Harness />);
        await userEvent.click(screen.getByRole('button', { name: 'Open' }));
        await expectNoViolations(container);
    });
});

describe('Dialog in a Popover', () => {
    function TitleMenu({ onAction }: { onAction: (id: string) => void }) {
        const [open, setOpen] = useState(true);
        const [name, setName] = useState('Effect');
        const ref = useRef<HTMLButtonElement>(null);
        return (
            <>
                <button ref={ref}>Title</button>
                <Popover isOpen={open} onOpenChange={setOpen} triggerRef={ref} isNonModal>
                    <Dialog aria-label="Effect">
                        <TextField label="Name" value={name} onChange={setName} />
                        <Menu aria-label="File" onAction={onAction} autoFocus={false}>
                            <MenuItem id="save">Save</MenuItem>
                            <MenuItem id="new">New empty effect</MenuItem>
                        </Menu>
                    </Dialog>
                </Popover>
            </>
        );
    }

    it('holds a field and command items that take arrow keys and focus', async () => {
        const onAction = vi.fn();
        render(<TitleMenu onAction={onAction} />);
        expect(screen.getByRole('dialog', { name: 'Effect' })).toBeTruthy();
        const name = screen.getByRole('textbox', { name: 'Name' });
        act(() => name.focus());
        expect(document.activeElement).toBe(name);
        const items = screen.getAllByRole('menuitem');
        act(() => items[0].focus());
        await userEvent.keyboard('{ArrowDown}');
        expect(document.activeElement).toBe(items[1]);
        await userEvent.keyboard('{Enter}');
        expect(onAction).toHaveBeenCalledWith('new');
    });
});

describe('Modal', () => {
    function NameEffect({ dismissable, onRename }: { dismissable?: boolean; onRename?: (name: string) => void }) {
        const [open, setOpen] = useState(false);
        const [name, setName] = useState('Effect');
        return (
            <>
                <button onClick={() => setOpen(true)}>Name</button>
                <button>Behind</button>
                <Modal isOpen={open} onOpenChange={setOpen} isDismissable={dismissable}>
                    <Dialog aria-label="Name effect">
                        <TextField label="Name" value={name} onChange={setName} />
                        <Button onPress={() => { onRename?.(name); setOpen(false); }}>Create</Button>
                    </Dialog>
                </Modal>
            </>
        );
    }

    async function open() {
        const trigger = screen.getByRole('button', { name: 'Name' });
        await userEvent.click(trigger);
        return trigger;
    }

    it('opens a named dialog over a scrim and hides the page behind', async () => {
        render(<NameEffect />);
        await open();
        const dialog = screen.getByRole('dialog', { name: 'Name effect' });
        expect(dialog.closest('.ui-modal')).toBeTruthy();
        expect(dialog.closest('.ui-modal-overlay')).toBeTruthy();
        expect(screen.queryByRole('button', { name: 'Behind' })).toBeNull();
    });

    it('traps focus and takes typing in a TextField', async () => {
        const onRename = vi.fn();
        render(<NameEffect onRename={onRename} />);
        await open();
        const dialog = screen.getByRole('dialog');
        const field = screen.getByRole('textbox', { name: 'Name' });
        await userEvent.click(field);
        await userEvent.clear(field);
        await userEvent.type(field, 'Glow');
        for (let i = 0; i < 4; i++) {
            await userEvent.tab();
            expect(dialog.contains(document.activeElement)).toBe(true);
        }
        await userEvent.click(screen.getByRole('button', { name: 'Create' }));
        expect(onRename).toHaveBeenCalledWith('Glow');
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('closes on Escape and returns focus to the trigger', async () => {
        render(<NameEffect />);
        const trigger = await open();
        await userEvent.keyboard('{Escape}');
        expect(screen.queryByRole('dialog')).toBeNull();
        // React Aria restores focus asynchronously, so a slow runner can get here first.
        await waitFor(() => expect(document.activeElement).toBe(trigger));
    });

    it('closes on a scrim click unless dismissal is off', async () => {
        const { rerender } = render(<NameEffect />);
        await open();
        await userEvent.click(document.querySelector('.ui-modal-overlay')!);
        expect(screen.queryByRole('dialog')).toBeNull();
        rerender(<NameEffect dismissable={false} />);
        await open();
        await userEvent.click(document.querySelector('.ui-modal-overlay')!);
        expect(screen.getByRole('dialog')).toBeTruthy();
    });

    it('has no axe violations', async () => {
        render(<NameEffect />);
        await open();
        await expectNoViolations(document.body);
    });
});

describe('Button size and icon', () => {
    it('sets size and icon markers and names an icon button', () => {
        render(<Button icon size="sm" aria-label="More">⋯</Button>);
        const b = screen.getByRole('button', { name: 'More' });
        expect(b.getAttribute('data-size')).toBe('sm');
        expect(b.hasAttribute('data-icon')).toBe(true);
    });
});

describe('Autocomplete', () => {
    function Browser() {
        const [q, setQ] = useState('');
        return (
            <Autocomplete label="Add node" value={q} onChange={setQ}>
                <ListBox aria-label="Nodes" emptyMessage="No matches">
                    <Section title="Audio"><ListBoxItem id="gain">Gain</ListBoxItem><ListBoxItem id="mixer">Mixer</ListBoxItem></Section>
                    <Section title="Effects"><ListBoxItem id="delay">Delay</ListBoxItem><ListBoxItem id="reverb">Reverb</ListBoxItem></Section>
                </ListBox>
            </Autocomplete>
        );
    }

    it('filters in list order and drops empty sections', async () => {
        render(<Browser />);
        expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Gain', 'Mixer', 'Delay', 'Reverb']);
        await userEvent.type(screen.getByRole('searchbox', { name: 'Add node' }), 'e');
        expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Mixer', 'Delay', 'Reverb']);
        await userEvent.type(screen.getByRole('searchbox', { name: 'Add node' }), 'v');
        expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Reverb']);
        expect(screen.queryByText('Audio')).toBeNull();
        expect(screen.getByText('Effects')).toBeTruthy();
    });

    it('shows the empty message when nothing matches', async () => {
        render(<Browser />);
        await userEvent.type(screen.getByRole('searchbox', { name: 'Add node' }), 'zzz');
        expect(screen.getByText('No matches')).toBeTruthy();
    });

    it('focuses the search field on mount only when autoFocus is set', () => {
        const { unmount } = render(<Autocomplete label="Add node" value="" onChange={() => {}}><ListBox aria-label="Nodes"><ListBoxItem id="a">A</ListBoxItem></ListBox></Autocomplete>);
        expect(document.activeElement).not.toBe(screen.getByRole('searchbox', { name: 'Add node' }));
        unmount();
        render(<Autocomplete label="Add node" value="" onChange={() => {}} autoFocus><ListBox aria-label="Nodes"><ListBoxItem id="a">A</ListBoxItem></ListBox></Autocomplete>);
        expect(document.activeElement).toBe(screen.getByRole('searchbox', { name: 'Add node' }));
    });

    it('focuses the search field when mounted inside a Popover', async () => {
        render(
            <Popover isOpen onOpenChange={() => {}} point={{ x: 10, y: 10 }} aria-label="Add node">
                <Autocomplete label="Add node" value="" onChange={() => {}} autoFocus>
                    <ListBox aria-label="Nodes"><ListBoxItem id="a">A</ListBoxItem></ListBox>
                </Autocomplete>
            </Popover>,
        );
        await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('searchbox', { name: 'Add node' })));
    });

    it('has no axe violations', async () => {
        const { container } = render(<Browser />);
        await expectNoViolations(container);
    });
});

describe('SearchField', () => {
    it('is named by its label and reports typed values', async () => {
        const onChange = vi.fn();
        render(<SearchField label="Search" value="" onChange={onChange} />);
        await userEvent.type(screen.getByRole('searchbox', { name: 'Search' }), 'a');
        expect(onChange).toHaveBeenLastCalledWith('a');
    });
});

describe('SubmenuItem', () => {
    function Cascade({ onAction }: { onAction: (id: string) => void }) {
        return (
            <Menu aria-label="Add node" autoFocus="first" onAction={onAction}>
                <SubmenuItem id="math" aria-label="Math" label="Math" description="Numeric nodes" onAction={onAction}>
                    <MenuItem id="add" description="Adds two numbers">Add</MenuItem>
                    <MenuItem id="mul">Multiply</MenuItem>
                </SubmenuItem>
                <MenuItem id="out">Output</MenuItem>
            </Menu>
        );
    }

    it('opens the flyout on ArrowRight, closes one level on ArrowLeft', async () => {
        render(<Cascade onAction={() => {}} />);
        const row = screen.getByRole('menuitem', { name: /Math/ });
        expect(row.getAttribute('aria-haspopup')).toBe('menu');
        act(() => row.focus());
        await userEvent.keyboard('{ArrowRight}');
        expect(await screen.findByRole('menu', { name: /Math/ })).toBeTruthy();
        await userEvent.keyboard('{ArrowLeft}');
        await waitFor(() => expect(screen.queryByRole('menu', { name: /Math/ })).toBeNull());
        expect(screen.getByRole('menu', { name: 'Add node' })).toBeTruthy();
    });

    it('closes only the flyout on Escape', async () => {
        render(<Cascade onAction={() => {}} />);
        act(() => screen.getByRole('menuitem', { name: /Math/ }).focus());
        await userEvent.keyboard('{ArrowRight}');
        await screen.findByRole('menu', { name: /Math/ });
        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('menu', { name: /Math/ })).toBeNull());
        expect(screen.getByRole('menu', { name: 'Add node' })).toBeTruthy();
    });

    it('opens on hover and runs an action from the flyout', async () => {
        const onAction = vi.fn();
        render(<Cascade onAction={onAction} />);
        await userEvent.hover(screen.getByRole('menuitem', { name: /Math/ }));
        const add = await screen.findByRole('menuitem', { name: /Add/ });
        await userEvent.click(add);
        expect(onAction).toHaveBeenCalledWith('add');
    });

    it('exposes the description as a tooltip and an accessible description', async () => {
        render(<Cascade onAction={() => {}} />);
        await userEvent.hover(screen.getByRole('menuitem', { name: /Math/ }));
        const add = await screen.findByRole('menuitem', { name: /Add/ });
        expect(add.querySelector('[title="Adds two numbers"]')).toBeTruthy();
        expect(add.getAttribute('aria-describedby')).toBeTruthy();
    });
});

describe('Drawer', () => {
    function DrawerHarness({ onChange }: { onChange?: (open: boolean) => void }) {
        const [open, setOpen] = useState(false);
        const [clicks, setClicks] = useState(0);
        return (
            <>
                <button onClick={() => setOpen(true)}>Open</button>
                <button onClick={() => setClicks(clicks + 1)}>Page {clicks}</button>
                <Drawer isOpen={open} onOpenChange={(o) => { onChange?.(o); setOpen(o); }} title="Details" subtitle="About this node.">
                    <input aria-label="Label" />
                </Drawer>
            </>
        );
    }

    it('is a labelled region, not a dialog, and renders nothing when closed', async () => {
        render(<DrawerHarness />);
        expect(screen.queryByRole('region')).toBeNull();
        await userEvent.click(screen.getByRole('button', { name: 'Open' }));
        expect(screen.getByRole('region', { name: 'Details' })).toBeTruthy();
        expect(screen.queryByRole('dialog')).toBeNull();
        expect(screen.getByRole('heading', { name: 'Details' })).toBeTruthy();
    });

    it('moves focus in on open and back to the opener on close', async () => {
        render(<DrawerHarness />);
        const open = screen.getByRole('button', { name: 'Open' });
        await userEvent.click(open);
        expect(screen.getByRole('region').contains(document.activeElement)).toBe(true);
        await userEvent.click(screen.getByRole('button', { name: 'Close' }));
        expect(screen.queryByRole('region')).toBeNull();
        expect(document.activeElement).toBe(open);
    });

    it('draws the close button as an icon, not a text glyph', async () => {
        render(<DrawerHarness />);
        await userEvent.click(screen.getByRole('button', { name: 'Open' }));
        const close = screen.getByRole('button', { name: 'Close' });
        expect(close.querySelector('svg.ui-icon')).toBeTruthy();
        expect(close.textContent).toBe('');
    });

    it('closes on Escape while focus is inside', async () => {
        const onChange = vi.fn();
        render(<DrawerHarness onChange={onChange} />);
        const open = screen.getByRole('button', { name: 'Open' });
        await userEvent.click(open);
        await userEvent.click(screen.getByRole('textbox', { name: 'Label' }));
        await userEvent.keyboard('{Escape}');
        expect(onChange).toHaveBeenLastCalledWith(false);
        expect(screen.queryByRole('region')).toBeNull();
        expect(document.activeElement).toBe(open);
    });

    it('stays open on an outside click, and the page behind stays interactive', async () => {
        render(<DrawerHarness />);
        await userEvent.click(screen.getByRole('button', { name: 'Open' }));
        await userEvent.click(screen.getByRole('button', { name: 'Page 0' }));
        expect(screen.getByRole('button', { name: 'Page 1' })).toBeTruthy();
        expect(screen.getByRole('region')).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Page 1' }).closest('[aria-hidden="true"]')).toBeNull();
    });

    it('closes on Escape when focus is outside it', async () => {
        render(<DrawerHarness />);
        await userEvent.click(screen.getByRole('button', { name: 'Open' }));
        await userEvent.click(screen.getByRole('button', { name: 'Page 0' }));
        await userEvent.keyboard('{Escape}');
        expect(screen.queryByRole('region')).toBeNull();
    });

    it('leaves Escape to a menu open over it, then closes on the next one', async () => {
        function Host() {
            const [open, setOpen] = useState(true);
            const [menu, setMenu] = useState(false);
            const ref = useRef<HTMLButtonElement>(null);
            return (
                <>
                    <button ref={ref} onClick={() => setMenu(true)}>Menu trigger</button>
                    <Drawer isOpen={open} onOpenChange={setOpen} title="Details"><input aria-label="Label" /></Drawer>
                    <Popover isOpen={menu} onOpenChange={setMenu} triggerRef={ref}>
                        <Menu aria-label="Actions" autoFocus="first"><MenuItem id="a">Add</MenuItem></Menu>
                    </Popover>
                </>
            );
        }
        render(<Host />);
        await userEvent.click(screen.getByRole('button', { name: 'Menu trigger' }));
        await screen.findByRole('menu');
        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
        expect(screen.getByRole('region')).toBeTruthy();
        await userEvent.keyboard('{Escape}');
        expect(screen.queryByRole('region')).toBeNull();
    });

    it('bottom side toggles half and full with aria-expanded, and still closes on Escape', async () => {
        function Bottom() {
            const [open, setOpen] = useState(true);
            return <Drawer isOpen={open} onOpenChange={setOpen} title="Details" side="bottom"><input aria-label="Label" /></Drawer>;
        }
        render(<Bottom />);
        const region = screen.getByRole('region', { name: 'Details' });
        const toggle = screen.getByRole('button', { name: 'Expand' });
        expect(toggle.querySelector('svg.ui-icon')).toBeTruthy();
        expect(toggle.textContent).toBe('');
        expect(region.dataset.side).toBe('bottom');
        expect(toggle.getAttribute('aria-expanded')).toBe('false');
        await userEvent.click(toggle);
        const collapse = screen.getByRole('button', { name: 'Collapse' });
        expect(collapse.getAttribute('aria-expanded')).toBe('true');
        expect(region.hasAttribute('data-expanded')).toBe(true);
        await userEvent.click(collapse);
        expect(region.hasAttribute('data-expanded')).toBe(false);
        await userEvent.keyboard('{Escape}');
        expect(screen.queryByRole('region')).toBeNull();
    });

    it('side drawers have no toggle', () => {
        render(<Drawer isOpen onOpenChange={() => {}} title="Details"><input aria-label="Label" /></Drawer>);
        expect(screen.queryByRole('button', { name: 'Expand' })).toBeNull();
    });

    it('has no axe violations', async () => {
        const { container } = render(<DrawerHarness />);
        await userEvent.click(screen.getByRole('button', { name: 'Open' }));
        await expectNoViolations(container);
    });
});

describe('Icon', () => {
    const all = Object.entries(icons).filter((entry): entry is [string, IconData] => 'viewBox' in entry[1]);

    it('exports every vendored icon', () => {
        expect(all.length).toBe(21);
    });

    it.each(all)('%s has a viewBox and renders decorative with currentColor', (_name, icon) => {
        expect(icon.viewBox).toMatch(/^0 0 \d+ \d+$/);
        const { container } = render(<Icon icon={icon} />);
        const svg = container.querySelector('svg')!;
        expect(svg.getAttribute('viewBox')).toBe(icon.viewBox);
        expect(svg.getAttribute('aria-hidden')).toBe('true');
        expect(svg.getAttribute('fill')).toBe('currentColor');
        for (const path of container.querySelectorAll('path')) {
            expect([null, 'currentColor', 'none']).toContain(path.getAttribute('fill'));
            if (path.getAttribute('fill') === 'none') expect(path.getAttribute('stroke')).toBe('currentColor');
        }
    });

    it('is named only when given a label', () => {
        render(<Icon icon={icons.playIcon} label="Play" />);
        expect(screen.getByRole('img', { name: 'Play' })).toBeTruthy();
    });

    it('names an icon button and has no axe violations', async () => {
        const { container } = render(<Button icon aria-label="Play"><Icon icon={icons.playIcon} /></Button>);
        await expectNoViolations(container);
    });
});
