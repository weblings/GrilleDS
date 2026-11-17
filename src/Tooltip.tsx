import type { ReactNode, RefObject } from 'react';
import { Tooltip as AriaTooltip, TooltipTrigger as AriaTooltipTrigger, TooltipTriggerStateContext } from 'react-aria-components';

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
    // Standalone use, outside a TooltipTrigger: anchor to this element and show while isOpen is true.
    // The owner decides when to open it (a Tree row or card is focused by its parent, not by a trigger).
    triggerRef?: RefObject<Element | null>;
    isOpen?: boolean;
    // Called when the tooltip asks to close, such as on Esc or when the anchor scrolls away.
    onOpenChange?: (open: boolean) => void;
}

export function TooltipTrigger({ delay = 400, closeDelay = 100, ...rest }: TooltipTriggerProps) {
    return <AriaTooltipTrigger delay={delay} closeDelay={closeDelay} {...rest} />;
}

export function Tooltip({ children, placement = 'top', triggerRef, isOpen, onOpenChange }: TooltipProps) {
    const tip = <AriaTooltip className="ui-tooltip" placement={placement} offset={6} triggerRef={triggerRef} isOpen={isOpen}>{children}</AriaTooltip>;
    if (isOpen === undefined) return tip;
    // React Aria's standalone Tooltip reads only this context, so a minimal state is supplied.
    const state = { isOpen, shouldSkipAnimation: false, open: () => onOpenChange?.(true), close: () => onOpenChange?.(false) };
    return <TooltipTriggerStateContext.Provider value={state}>{tip}</TooltipTriggerStateContext.Provider>;
}
