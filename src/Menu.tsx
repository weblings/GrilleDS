import type { KeyboardEventHandler, ReactNode } from 'react';
import { Menu as AriaMenu, MenuItem as AriaMenuItem, Separator } from 'react-aria-components';

export interface MenuProps {
    'aria-label': string;
    onAction?: (id: string) => void;
    onClose?: () => void;
    // Runs on every key in the menu, before React Aria's own handling. Stop propagation here for keys the page must not see.
    onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
    autoFocus?: boolean | 'first' | 'last';
    children: ReactNode;
}

export function Menu({ onAction, autoFocus = true, ...rest }: MenuProps) {
    return <AriaMenu {...rest} autoFocus={autoFocus} className="ui-menu" onAction={onAction ? (k) => onAction(String(k)) : undefined} />;
}

export interface MenuItemProps {
    id: string;
    // Fires for this item only, after the menu's onAction.
    onAction?: () => void;
    isDisabled?: boolean;
    children: ReactNode;
}

export function MenuItem(props: MenuItemProps) {
    return <AriaMenuItem {...props} className="ui-menu-item" />;
}

export function MenuSeparator() {
    return <Separator className="ui-menu-separator" />;
}
