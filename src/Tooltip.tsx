import type { ReactNode } from 'react';
import { Tooltip as AriaTooltip, TooltipTrigger as AriaTooltipTrigger } from 'react-aria-components';

export interface TooltipTriggerProps {
    // A focusable element first, then a Tooltip.
    children: ReactNode;
    delay?: number;
    closeDelay?: number;
    isDisabled?: boolean;
}

export interface TooltipProps {
    // Any content: plain text, bold text, a short list.
    children: ReactNode;
    placement?: 'top' | 'bottom' | 'left' | 'right';
}

export function TooltipTrigger({ delay = 400, closeDelay = 100, ...rest }: TooltipTriggerProps) {
    return <AriaTooltipTrigger delay={delay} closeDelay={closeDelay} {...rest} />;
}

export function Tooltip({ children, placement = 'top' }: TooltipProps) {
    return <AriaTooltip className="ui-tooltip" placement={placement} offset={6}>{children}</AriaTooltip>;
}
