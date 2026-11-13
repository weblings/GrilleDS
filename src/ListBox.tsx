import type { ReactNode } from 'react';
import { Header } from './Header';
import { ListBox as AriaListBox, ListBoxItem as AriaListBoxItem, ListBoxSection } from 'react-aria-components';

export interface ListBoxProps {
    'aria-label': string;
    onAction?: (id: string) => void;
    // Shown when filtering leaves nothing.
    emptyMessage?: string;
    children: ReactNode;
}

export function ListBox({ 'aria-label': label, onAction, emptyMessage, children }: ListBoxProps) {
    return (
        <AriaListBox
            className="ui-listbox"
            aria-label={label}
            onAction={onAction ? (key) => onAction(String(key)) : undefined}
            renderEmptyState={emptyMessage ? () => <div className="ui-listbox-empty">{emptyMessage}</div> : undefined}
        >
            {children}
        </AriaListBox>
    );
}

export interface ListBoxItemProps {
    id: string;
    // Text used for filtering and typeahead. Defaults to string children.
    textValue?: string;
    children: ReactNode;
}

export function ListBoxItem({ id, textValue, children }: ListBoxItemProps) {
    return <AriaListBoxItem id={id} textValue={textValue} className="ui-option">{children}</AriaListBoxItem>;
}

export interface SectionProps {
    // The group's heading and its accessible label (its text content).
    title: ReactNode;
    children: ReactNode;
}

// A Section with no visible items drops out while an Autocomplete filters.
export function Section({ title, children }: SectionProps) {
    return (
        <ListBoxSection className="ui-section">
            <Header>{title}</Header>
            {children}
        </ListBoxSection>
    );
}
