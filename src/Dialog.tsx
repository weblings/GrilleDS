import type { ReactNode } from 'react';
import { Dialog as AriaDialog } from 'react-aria-components';

export interface DialogProps {
    'aria-label': string;
    children: ReactNode;
}

// For a Popover that holds a field and command items together. Use Menu when it is only commands.
export function Dialog(props: DialogProps) {
    return <AriaDialog {...props} className="ui-dialog" />;
}
