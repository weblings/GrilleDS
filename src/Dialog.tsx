import type { ReactNode } from 'react';
import { Dialog as AriaDialog, Heading } from 'react-aria-components';

interface DialogBaseProps {
    children: ReactNode;
}

// A title is a heading that names the dialog; without one, aria-label does.
export type DialogProps = DialogBaseProps & (
    | { title: string; 'aria-label'?: string }
    | { title?: undefined; 'aria-label': string }
);

// In a Popover, a field and command items together (use Menu for commands only). In a Modal, a titled
// dialog: title, field, message and DialogActions.
export function Dialog({ title, children, ...rest }: DialogProps) {
    return (
        <AriaDialog {...rest} className="ui-dialog">
            {title !== undefined && <Heading slot="title" className="ui-dialog-title">{title}</Heading>}
            {children}
        </AriaDialog>
    );
}

// Centred row of action-size buttons for the bottom of a Dialog. Put the primary button last.
export function DialogActions({ children }: { children: ReactNode }) {
    return <div className="ui-dialog-actions">{children}</div>;
}
