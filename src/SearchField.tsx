import { Input, Label, SearchField as AriaSearchField } from 'react-aria-components';

export interface SearchFieldProps {
    label: string;
    // Omit both to use inside an Autocomplete, which owns the text.
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
}

export function SearchField({ label, value, onChange, placeholder, autoFocus }: SearchFieldProps) {
    return (
        <AriaSearchField className="ui-field ui-search-field" value={value} onChange={onChange} autoFocus={autoFocus}>
            <Label className="ui-field-label">{label}</Label>
            <Input className="ui-text-input" placeholder={placeholder} size={40} />
        </AriaSearchField>
    );
}
