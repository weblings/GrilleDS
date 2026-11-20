import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { warningIcon } from './icons';

export interface CalloutProps {
    title: string;
    children: ReactNode;
}

// Static warning card. role="note" keeps it out of live-region announcements.
export function Callout({ title, children }: CalloutProps) {
    return (
        <div className="ui-callout" role="note" data-tone="warning">
            <strong className="ui-callout-title"><Icon icon={warningIcon} />{title}</strong>
            <div className="ui-callout-body">{children}</div>
        </div>
    );
}
