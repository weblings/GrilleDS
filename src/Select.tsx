import { useRef } from 'react';
import { Icon } from './Icon';
import { chevronDownIcon } from './icons';
import { Button, ListBox, ListBoxItem, Popover, Select as AriaSelect, SelectValue, Label } from 'react-aria-components';

export interface SelectOption {
    id: string;
    label: string;
}

export interface SelectProps {
    label: string;
    // A plain string is both shown and returned. {id, label} shows the label and returns the id.
    options: (string | SelectOption)[];
    value: string;
    // Fires only for a choice made in the open list, never for arrow keys on the closed trigger.
    onChange: (value: string) => void;
    // Renders the list open on first render. For fixtures and screenshots.
    defaultOpen?: boolean;
    isDisabled?: boolean;
    // Trigger fills the control column instead of sizing to its content.
    fullWidth?: boolean;
}

export function Select({ label, options, value, onChange, defaultOpen, isDisabled, fullWidth }: SelectProps) {
    const open = useRef(false);
    return (
        <AriaSelect
            className="ui-field ui-select"
            selectedKey={value}
            defaultOpen={defaultOpen}
            isDisabled={isDisabled}
            data-full-width={fullWidth || undefined}
            onOpenChange={(o) => { open.current = o; }}
            onSelectionChange={(key) => { if (open.current && key !== null) onChange(String(key)); }}
        >
            <Label className="ui-field-label">{label}</Label>
            <Button className="ui-select-trigger"><SelectValue /><Icon icon={chevronDownIcon} size="sm" /></Button>
            <Popover className="ui-popover">
                <ListBox className="ui-listbox">
                    {options.map((o) => {
                        const { id, label: text } = typeof o === 'string' ? { id: o, label: o } : o;
                        return <ListBoxItem key={id} id={id} className="ui-option">{text}</ListBoxItem>;
                    })}
                </ListBox>
            </Popover>
        </AriaSelect>
    );
}
