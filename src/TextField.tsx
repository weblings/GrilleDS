import { Input, Label, TextArea, TextField as AriaTextField } from 'react-aria-components';

interface TextFieldBaseProps {
    value: string;
    onChange: (value: string) => void;
    id?: string;
    // Shown while the field is empty.
    placeholder?: string;
    // Focus the field when it mounts, e.g. the only field of a dialog.
    autoFocus?: boolean;
    // Sets aria-invalid and an error-coloured border. Pair with an error message and aria-describedby.
    isInvalid?: boolean;
    // The id of the element that describes the field, e.g. its error message. The field does not look for it.
    'aria-describedby'?: string;
    // Renders a textarea that resizes vertically only.
    multiline?: boolean;
    // Visible lines of a multiline field.
    rows?: number;
}

// A visible label, or an aria-label when the surroundings already name the field (a dialog title).
export type TextFieldProps = TextFieldBaseProps & (
    | { label: string; 'aria-label'?: undefined }
    | { label?: undefined; 'aria-label': string }
);

// Fills its container, except inside a FieldList where the control keeps its own width.
export function TextField({
    label, 'aria-label': ariaLabel, value, onChange, id, placeholder, autoFocus, isInvalid,
    'aria-describedby': describedBy, multiline, rows = 3,
}: TextFieldProps) {
    return (
        <AriaTextField
            className="ui-field ui-text-field"
            data-multiline={multiline ? '' : undefined}
            value={value}
            onChange={onChange}
            aria-label={ariaLabel}
            aria-describedby={describedBy}
            autoFocus={autoFocus}
            isInvalid={isInvalid}
        >
            {label !== undefined && <Label className="ui-field-label">{label}</Label>}
            {multiline
                ? <TextArea id={id} className="ui-text-input ui-textarea" rows={rows} placeholder={placeholder} />
                : <Input id={id} className="ui-text-input" size={40} placeholder={placeholder} />}
        </AriaTextField>
    );
}
