import type { KeyboardEventHandler, ReactNode } from 'react';
import { Icon } from './Icon';
import { checkIcon, chevronRightIcon } from './icons';
import { Menu as AriaMenu, MenuItem as AriaMenuItem, Popover as AriaPopover, Separator, SubmenuTrigger, Text } from 'react-aria-components';

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
    // MenuItem children of the flyout.
    children: ReactNode;
}

// A row that opens a flyout menu beside it: hover or ArrowRight opens, ArrowLeft or Escape closes one level.
export function SubmenuItem({ id, isDisabled, description, label, onAction, children, 'aria-label': ariaLabel }: SubmenuItemProps) {
    return (
        <SubmenuTrigger>
            <AriaMenuItem id={id} isDisabled={isDisabled} textValue={ariaLabel} className="ui-menu-item ui-menu-item-submenu">
                <ItemBody description={description}>{label}</ItemBody>
                <span className="ui-menu-chevron"><Icon icon={chevronRightIcon} size="sm" /></span>
            </AriaMenuItem>
            <AriaPopover className="ui-popover" data-submenu="">
                <AriaMenu aria-label={ariaLabel} className="ui-menu" onAction={onAction ? (k) => onAction(String(k)) : undefined}>{children}</AriaMenu>
            </AriaPopover>
        </SubmenuTrigger>
    );
}

export function MenuSeparator() {
    return <Separator className="ui-menu-separator" />;
}
