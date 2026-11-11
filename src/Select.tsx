import { useRef } from 'react';
import { Icon } from './Icon';
import { chevronDownIcon } from './icons';
import { Button, ListBox, ListBoxItem, Popover, Select as AriaSelect, SelectValue, Label } from 'react-aria-components';

export interface SelectProps {
    label: string;
    options: string[];
    value: string;
    // Fires only for a choice made in the open list, never for arrow keys on the closed trigger.
    onChange: (value: string) => void;
    // Renders the list open on first render. For fixtures and screenshots.
    defaultOpen?: boolean;
}

export function Select({ label, options, value, onChange, defaultOpen }: SelectProps) {
    const open = useRef(false);
    return (
        <AriaSelect
            className="ui-field ui-select"
            selectedKey={value}
            defaultOpen={defaultOpen}
            onOpenChange={(o) => { open.current = o; }}
            onSelectionChange={(key) => { if (open.current && key !== null) onChange(String(key)); }}
        >
            <Label className="ui-field-label">{label}</Label>
            <Button className="ui-select-trigger"><SelectValue /><Icon icon={chevronDownIcon} size="sm" /></Button>
            <Popover className="ui-popover">
                <ListBox className="ui-listbox">
                    {options.map((o) => <ListBoxItem key={o} id={o} className="ui-option">{o}</ListBoxItem>)}
                </ListBox>
            </Popover>
        </AriaSelect>
    );
}
