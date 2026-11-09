import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
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

// React Aria passes the anchor to ResizeObserver, which rejects anything that is not a real Element. So a point
// anchor is a zero-size fixed element at the point, in the body for as long as the popover has that point.
function usePointAnchor(point: PopoverPoint | undefined): RefObject<Element | null> | null {
    const px = point?.x;
    const py = point?.y;
    const [anchor, setAnchor] = useState<RefObject<Element | null> | null>(null);
    useEffect(() => {
        if (px === undefined || py === undefined) { setAnchor(null); return; }
        const el = document.createElement('div');
        el.setAttribute('aria-hidden', 'true');
        el.style.cssText = `position:fixed;width:0;height:0;pointer-events:none;left:${px}px;top:${py}px`;
        document.body.appendChild(el);
        setAnchor({ current: el });
        return () => { el.remove(); setAnchor(null); };
    }, [px, py]);
    return anchor;
}

export function Popover({ isOpen, onOpenChange, triggerRef, point, isNonModal, placement = 'bottom start', onRestoreFocus, children, ...rest }: PopoverProps) {
    const px = point?.x;
    const py = point?.y;
    const virtual = usePointAnchor(point);

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

    // A point that has not got its anchor element yet renders nothing, rather than falling back to triggerRef.
    const anchor = point ? virtual : triggerRef;
    if (!anchor) return null;
    return (
        // Keyed on the point so a new point repositions the popover instead of leaving it where it was.
        <AriaPopover
            key={px === undefined ? 'ref' : `${px},${py}`}
            className="ui-popover"
            data-anchor={point ? 'point' : 'ref'}
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
