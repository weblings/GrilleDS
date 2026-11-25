import type { ReactNode } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';
import { circledExclamationIcon, circledInfoIcon, xMarkIcon, type IconData } from './icons';

export interface MessageRowProps {
    // Lets a field point aria-describedby at the message.
    id?: string;
    tone?: 'error' | 'notice';
    // Content under the message, aligned with its text (a list, a countdown, buttons).
    children?: ReactNode;
    // Adds a dismiss button at top right; dismissLabel names it.
    onDismiss?: () => void;
    dismissLabel?: string;
    message: ReactNode;
    // Replaces the tone's mark. The tone colour still applies.
    icon?: IconData;
}

// Presentational only: no role or live region, so the caller decides how the message is announced.
export function MessageRow({ id, tone = 'notice', message, children, onDismiss, dismissLabel = 'Dismiss', icon }: MessageRowProps) {
    return (
        <div id={id} className="ui-message-row" data-tone={tone}>
            <span className="ui-message-row-mark"><Icon icon={icon ?? (tone === 'error' ? circledExclamationIcon : circledInfoIcon)} /></span>
            <div className="ui-message-row-text">{message}</div>
            {onDismiss ? (
                <span className="ui-message-row-dismiss">
                    <Button icon size="sm" variant="ghost" aria-label={dismissLabel} onPress={onDismiss}>
                        <Icon icon={xMarkIcon} />
                    </Button>
                </span>
            ) : null}
            {children ? <div className="ui-message-row-slot">{children}</div> : null}
        </div>
    );
}
