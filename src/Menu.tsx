import type { CSSProperties, KeyboardEventHandler, ReactNode } from 'react';
import { Icon } from './Icon';
import { checkIcon, chevronRightIcon } from './icons';
import { Header as AriaHeader, Menu as AriaMenu, MenuItem as AriaMenuItem, MenuSection as AriaMenuSection, Popover as AriaPopover, Separator, SubmenuTrigger, Text } from 'react-aria-components';

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

export interface MenuItemProps {
    id: string;
    // Fires for this item only, after the menu's onAction.
    onAction?: () => void;
    isDisabled?: boolean;
    // Shown as a hover tooltip, and read as the item's description by screen readers.
    description?: string;
    children: ReactNode;
}

// Description text is in the DOM for assistive tech and as the native tooltip, and hidden visually.
function ItemBody({ description, children }: { description?: string; children: ReactNode }) {
    if (!description) return <>{children}</>;
    return (
        <span className="ui-menu-item-body" title={description}>
            {children}
            <Text slot="description" className="ui-visually-hidden">{description}</Text>
        </span>
    );
}

export function MenuItem({ description, children, ...rest }: MenuItemProps) {
    return (
        <AriaMenuItem {...rest} className="ui-menu-item">
            {({ selectionMode, isSelected }) => (
                <>
                    {/* The slot is reserved on every row of a selectable menu so labels stay aligned. */}
                    {selectionMode !== 'none' && <span className="ui-menu-check">{isSelected && <Icon icon={checkIcon} size="sm" />}</span>}
                    <ItemBody description={description}>{children}</ItemBody>
                </>
            )}
        </AriaMenuItem>
    );
}

export interface SubmenuItemProps {
    id: string;
    isDisabled?: boolean;
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
export function SubmenuItem({ id, isDisabled, description, label, onAction, maxHeight, children, 'aria-label': ariaLabel }: SubmenuItemProps) {
    return (
        <SubmenuTrigger>
            <AriaMenuItem id={id} isDisabled={isDisabled} textValue={ariaLabel} className="ui-menu-item ui-menu-item-submenu">
                <ItemBody description={description}>{label}</ItemBody>
                <span className="ui-menu-chevron"><Icon icon={chevronRightIcon} size="sm" /></span>
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
    // The group's heading: sticky at the top of a scrolling menu, not focusable, and the group's accessible label.
    title: string;
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
