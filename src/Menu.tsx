import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEventHandler, ReactNode, RefObject } from 'react';
import { Icon } from './Icon';
import { checkIcon, chevronRightIcon } from './icons';
import { Header as AriaHeader, Menu as AriaMenu, MenuItem as AriaMenuItem, MenuSection as AriaMenuSection, Popover as AriaPopover, Separator, SubmenuTrigger, Text, Tooltip as AriaTooltip, TooltipTriggerStateContext } from 'react-aria-components';

export interface MenuProps {
    'aria-label': string;
    onAction?: (id: string) => void;
    onClose?: () => void;
    // Runs on every key in the menu, before React Aria's own handling. Stop propagation here for keys the page must not see.
    onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
    autoFocus?: boolean | 'first' | 'last';
    // 'single' makes the items menuitemradio and marks the chosen one with a check; picking an item closes the menu.
    selectionMode?: 'single';
    selectedKey?: string;
    onSelectionChange?: (id: string) => void;
    children: ReactNode;
}

export function Menu({ onAction, autoFocus = true, selectedKey, onSelectionChange, ...rest }: MenuProps) {
    return (
        <AriaMenu
            {...rest}
            autoFocus={autoFocus}
            className="ui-menu"
            onAction={onAction ? (k) => onAction(String(k)) : undefined}
            selectedKeys={selectedKey === undefined ? undefined : [selectedKey]}
            onSelectionChange={onSelectionChange ? (keys) => { const [id] = keys === 'all' ? [] : keys; if (id !== undefined) onSelectionChange(String(id)); } : undefined}
        />
    );
}

interface RowTooltipProps {
    // Shown on Grille's Tooltip skin on hover (after a delay) and on keyboard focus of the row; adds no focusable element.
    // Opt-in: a description alone never shows a tooltip.
    tooltip?: ReactNode;
    // Show the tooltip only when the label is actually cut off (ellipsis or clipped).
    tooltipOnlyWhenTruncated?: boolean;
}

export interface MenuItemProps extends RowTooltipProps {
    id: string;
    // Fires for this item only, after the menu's onAction.
    onAction?: () => void;
    isDisabled?: boolean;
    // Screen-reader text, read as the item's description; not shown visually.
    description?: string;
    children: ReactNode;
}

// Matches TooltipTrigger's default delay.
const HOVER_DELAY_MS = 400;

function isTruncated(el: HTMLElement | null) {
    if (!el) return false;
    return [el, ...Array.from(el.querySelectorAll<HTMLElement>('*'))].some((e) => e.scrollWidth > e.clientWidth + 1);
}

// Opens at once on keyboard focus and after a delay on hover; the row stays the only focusable element.
function RowTooltip({ content, onlyWhenTruncated, focused, hovered, suppressed, rowRef, bodyRef }: {
    content: ReactNode; onlyWhenTruncated?: boolean; focused: boolean; hovered: boolean; suppressed?: boolean;
    rowRef: RefObject<HTMLDivElement | null>; bodyRef: RefObject<HTMLElement | null>;
}) {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (suppressed || !(focused || hovered)) { setOpen(false); return; }
        const t = setTimeout(() => setOpen(!onlyWhenTruncated || isTruncated(bodyRef.current)), focused ? 0 : HOVER_DELAY_MS);
        return () => clearTimeout(t);
    }, [focused, hovered, suppressed, onlyWhenTruncated, bodyRef]);
    // The row drives open/close itself, so the tooltip gets a minimal state instead of a TooltipTrigger.
    const state = { isOpen: open, shouldSkipAnimation: false, open: () => setOpen(true), close: () => setOpen(false) };
    return (
        <TooltipTriggerStateContext.Provider value={state}>
            <AriaTooltip className="ui-tooltip" triggerRef={rowRef} placement="right" offset={6}>{content}</AriaTooltip>
        </TooltipTriggerStateContext.Provider>
    );
}

// Description text is in the DOM for assistive tech, hidden visually.
function ItemBody({ description, bodyRef, children }: { description?: string; bodyRef: RefObject<HTMLSpanElement | null>; children: ReactNode }) {
    return (
        <span className="ui-menu-item-body" ref={bodyRef}>
            {children}
            {description && <Text slot="description" className="ui-visually-hidden">{description}</Text>}
        </span>
    );
}

export function MenuItem({ description, tooltip, tooltipOnlyWhenTruncated, children, ...rest }: MenuItemProps) {
    const rowRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLSpanElement>(null);
    return (
        <AriaMenuItem {...rest} ref={rowRef} className="ui-menu-item">
            {({ selectionMode, isSelected, isFocusVisible, isHovered }) => (
                <>
                    {/* The slot is reserved on every row of a selectable menu so labels stay aligned. */}
                    {selectionMode !== 'none' && <span className="ui-menu-check">{isSelected && <Icon icon={checkIcon} size="sm" />}</span>}
                    <ItemBody description={description} bodyRef={bodyRef}>{children}</ItemBody>
                    {tooltip && <RowTooltip content={tooltip} onlyWhenTruncated={tooltipOnlyWhenTruncated} focused={isFocusVisible} hovered={isHovered} rowRef={rowRef} bodyRef={bodyRef} />}
                </>
            )}
        </AriaMenuItem>
    );
}

export interface SubmenuItemProps extends RowTooltipProps {
    id: string;
    isDisabled?: boolean;
    // Screen-reader text, as on MenuItem.
    description?: string;
    // The row's label.
    label: ReactNode;
    'aria-label': string;
    // Runs for an action in the flyout, with the item's id.
    onAction?: (id: string) => void;
    // Tallest the flyout grows before its items scroll: px as a number, or any CSS length. Defaults to the
    // --ui-size-submenu-max-height token; the flyout never exceeds the space left on screen.
    maxHeight?: number | string;
    // MenuItem and MenuSection children of the flyout.
    children: ReactNode;
}

// A row that opens a flyout menu beside it: hover or ArrowRight opens, ArrowLeft or Escape closes one level.
// Its tooltip hides while the flyout is open.
export function SubmenuItem({ id, isDisabled, description, tooltip, tooltipOnlyWhenTruncated, label, onAction, maxHeight, children, 'aria-label': ariaLabel }: SubmenuItemProps) {
    const rowRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLSpanElement>(null);
    return (
        <SubmenuTrigger>
            <AriaMenuItem id={id} ref={rowRef} isDisabled={isDisabled} textValue={ariaLabel} className="ui-menu-item ui-menu-item-submenu">
                {({ isFocusVisible, isHovered, isOpen }) => (
                    <>
                        <ItemBody description={description} bodyRef={bodyRef}>{label}</ItemBody>
                        <span className="ui-menu-chevron"><Icon icon={chevronRightIcon} size="sm" /></span>
                        {tooltip && <RowTooltip content={tooltip} onlyWhenTruncated={tooltipOnlyWhenTruncated} focused={isFocusVisible} hovered={isHovered} suppressed={isOpen} rowRef={rowRef} bodyRef={bodyRef} />}
                    </>
                )}
            </AriaMenuItem>
            <AriaPopover className="ui-popover" data-submenu="">
                <AriaMenu
                    aria-label={ariaLabel}
                    className="ui-menu"
                    style={maxHeight === undefined ? undefined : ({ '--ui-submenu-max-height': typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight } as CSSProperties)}
                    onAction={onAction ? (k) => onAction(String(k)) : undefined}>{children}</AriaMenu>
            </AriaPopover>
        </SubmenuTrigger>
    );
}

export interface MenuSectionProps {
    // The group's heading: sticky at the top of a scrolling menu, not focusable, and the group's accessible label
    // (its text content, so an icon needs visually hidden text beside it).
    title: ReactNode;
    children: ReactNode;
}

export function MenuSection({ title, children }: MenuSectionProps) {
    return (
        <AriaMenuSection className="ui-menu-section">
            <AriaHeader className="ui-menu-section-header">{title}</AriaHeader>
            {children}
        </AriaMenuSection>
    );
}

export function MenuSeparator() {
    return <Separator className="ui-menu-separator" />;
}
