import { useEffect, useRef, useId, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { Button } from 'react-aria-components';
import { Icon } from './Icon';
import { fullscreenArrowIcon, fullscreenArrowExitIcon, xMarkIcon } from './icons';

export interface DrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    subtitle?: string;
    // The edge it is fixed to.
    // 'bottom' spans the full width and opens at half the space below `top`, for narrow windows.
    side?: 'right' | 'left' | 'bottom';
    // Distance from the top of the viewport, so the drawer can sit below an app bar. A number is px.
    top?: number | string;
    // Bottom only: full height instead of half. Uncontrolled unless `expanded` is given.
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    children: ReactNode;
}

// An open popup (menu, popover, dialog) takes the next Escape before the drawer does.
const POPUP = '.ui-popover, .ui-modal-overlay, [role="menu"], [role="dialog"]';

// A panel fixed to one edge that stays open beside the page. Non-modal: no scrim, nothing is trapped or hidden, and
// a click outside does not close it. Escape closes it wherever focus is (unless a popup is open, which takes that
// Escape first), and so does the close button. Focus moves in on open and back to where it was on close. Showing
// one at a time is up to the owner.
export function Drawer({ isOpen, onOpenChange, title, subtitle, side = 'right', top = 0, expanded, onExpandedChange, children }: DrawerProps) {
    const [innerExpanded, setInnerExpanded] = useState(false);
    const isExpanded = expanded ?? innerExpanded;
    const toggle = () => { setInnerExpanded(!isExpanded); onExpandedChange?.(!isExpanded); };
    const onOpenChangeRef = useRef(onOpenChange);
    onOpenChangeRef.current = onOpenChange;
    const ref = useRef<HTMLElement>(null);
    const titleId = useId();
    const subtitleId = useId();

    useEffect(() => {
        if (!isOpen) return;
        // The effect runs after commit, so this is still the opener's focus.
        const a = document.activeElement;
        const previous = a instanceof HTMLElement && a !== document.body ? a : null;
        ref.current?.focus();
        return () => {
            // Skipped when the opener has gone, or when the user already moved focus to something else on the page.
            const active = document.activeElement;
            const focusLeftDrawer = active && active !== document.body && !ref.current?.contains(active);
            if (previous?.isConnected && !focusLeftDrawer) previous.focus();
        };
    }, [isOpen]);

    // Escape with focus outside the drawer (a host that keeps working beside it). Focus inside is handled by the
    // section's own onKeyDown, which stops the event before it gets here.
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: globalThis.KeyboardEvent) => {
            if (e.key !== 'Escape' || e.defaultPrevented || document.querySelector(POPUP)) return;
            onOpenChangeRef.current(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen]);

    if (!isOpen) return null;

    const onKeyDown = (e: KeyboardEvent) => {
        // A popup inside (a Select or Menu) takes its own Escape first.
        if (e.key === 'Escape' && !e.defaultPrevented) {
            e.stopPropagation();
            onOpenChange(false);
        }
    };

    const style = { '--ui-drawer-top': typeof top === 'number' ? `${top}px` : top } as CSSProperties;
    return (
        <section
            ref={ref}
            className="ui-drawer"
            data-side={side}
            data-expanded={side === 'bottom' && isExpanded ? '' : undefined}
            style={style}
            tabIndex={-1}
            aria-labelledby={titleId}
            aria-describedby={subtitle ? subtitleId : undefined}
            onKeyDown={onKeyDown}
        >
            <div className="ui-drawer-head">
                <h2 id={titleId} className="ui-drawer-title">{title}</h2>
                {side === 'bottom' ? (
                    <Button className="ui-button ui-drawer-toggle" aria-label={isExpanded ? 'Collapse' : 'Expand'} aria-expanded={isExpanded} onPress={toggle}>
                        <Icon icon={isExpanded ? fullscreenArrowExitIcon : fullscreenArrowIcon} />
                    </Button>
                ) : null}
                <Button className="ui-button ui-drawer-close" aria-label="Close" onPress={() => onOpenChange(false)}><Icon icon={xMarkIcon} /></Button>
            </div>
            {subtitle ? <p id={subtitleId} className="ui-drawer-subtitle">{subtitle}</p> : null}
            <div className="ui-drawer-body">{children}</div>
        </section>
    );
}
