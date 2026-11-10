import type { ReactNode } from 'react';
import { Autocomplete as AriaAutocomplete, useFilter } from 'react-aria-components';
import { SearchField } from './SearchField';

export interface AutocompleteProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    // Focuses the search field on mount, for an Autocomplete that opens in a popup.
    autoFocus?: boolean;
    // A ListBox, optionally with Sections. Items keep list order while filtering.
    children: ReactNode;
}

export function Autocomplete({ label, value, onChange, placeholder, autoFocus, children }: AutocompleteProps) {
    const { contains } = useFilter({ sensitivity: 'base' });
    return (
        <AriaAutocomplete inputValue={value} onInputChange={onChange} filter={contains}>
            <div className="ui-autocomplete">
                <SearchField label={label} placeholder={placeholder} autoFocus={autoFocus} />
                {children}
            </div>
        </AriaAutocomplete>
    );
}
