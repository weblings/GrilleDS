import { useEffect, useMemo, useRef, type ReactNode, type RefObject } from 'react';
import { Popover as AriaPopover } from 'react-aria-components';

export interface PopoverPoint { x: number; y: number }

export interface PopoverProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    // Anchor to an element, or to a viewport point (a pointer position). A point wins if both are given.
    triggerRef?: RefObject<Element | null>;
    point?: PopoverPoint;
    // Lets clicks, wheel and right-clicks reach the page behind. The owner then handles outside dismissal.
    isNonModal?: boolean;
    placement?: 'bottom start' | 'bottom' | 'bottom end' | 'top start' | 'top' | 'top end' | 'right top' | 'left top';
    // Called once when the popover closes, with the element focused when it opened. Focus does not return on its own
    // for a point anchor or a non-modal popover, so the owner decides where it goes.
    onRestoreFocus?: (previous: HTMLElement | null) => void;
    'aria-label'?: string;
    children: ReactNode;
}

function pointRef(point: PopoverPoint): RefObject<Element | null> {
    const { x, y } = point;
    return { current: { getBoundingClientRect: () => new DOMRect(x, y, 0, 0) } as Element };
}

export function Popover({ isOpen, onOpenChange, triggerRef, point, isNonModal, placement = 'bottom start', onRestoreFocus, children, ...rest }: PopoverProps) {
    const px = point?.x;
    const py = point?.y;
    const virtual = useMemo(() => (px === undefined || py === undefined ? null : pointRef({ x: px, y: py })), [px, py]);

    // Captured in render, since the menu inside takes focus in an effect that runs before any effect here.
    const previous = useRef<HTMLElement | null>(null);
    const wasOpen = useRef(false);
    if (isOpen && !wasOpen.current) {
        const a = document.activeElement;
        previous.current = a instanceof HTMLElement && a !== document.body ? a : null;
    }
    const restore = useRef(onRestoreFocus);
    restore.current = onRestoreFocus;
    useEffect(() => {
        if (wasOpen.current && !isOpen) restore.current?.(previous.current);
        wasOpen.current = isOpen;
    }, [isOpen]);

    const anchor = virtual ?? triggerRef;
    if (!anchor) return null;
    return (
        // Keyed on the point so a new point repositions the popover instead of leaving it where it was.
        <AriaPopover
            key={px === undefined ? 'ref' : `${px},${py}`}
            className="ui-popover"
            data-anchor={virtual ? 'point' : 'ref'}
            triggerRef={anchor}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isNonModal={isNonModal}
            placement={placement}
            {...rest}
        >
            {children}
        </AriaPopover>
    );
}
