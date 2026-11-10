import { useEffect, useRef, useId, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { Button } from 'react-aria-components';

export interface DrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    subtitle?: string;
    // The edge it is fixed to.
    side?: 'right' | 'left';
    // Distance from the top of the viewport, so the drawer can sit below an app bar. A number is px.
    top?: number | string;
    children: ReactNode;
}

// A panel fixed to one edge that stays open beside the page. Non-modal: no scrim, nothing is trapped or hidden, and
// a click outside does not close it. Escape closes it while focus is inside, and so does the close button. Focus
// moves in on open and back to where it was on close. Showing one at a time is up to the owner.
export function Drawer({ isOpen, onOpenChange, title, subtitle, side = 'right', top = 0, children }: DrawerProps) {
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
            style={style}
            tabIndex={-1}
            aria-labelledby={titleId}
            aria-describedby={subtitle ? subtitleId : undefined}
            onKeyDown={onKeyDown}
        >
            <div className="ui-drawer-head">
                <h2 id={titleId} className="ui-drawer-title">{title}</h2>
                <Button className="ui-button ui-drawer-close" aria-label="Close" onPress={() => onOpenChange(false)}>×</Button>
            </div>
            {subtitle ? <p id={subtitleId} className="ui-drawer-subtitle">{subtitle}</p> : null}
            <div className="ui-drawer-body">{children}</div>
        </section>
    );
}
