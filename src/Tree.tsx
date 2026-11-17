import type { ReactNode } from 'react';
import { Button as AriaButton, DropIndicator, Tree as AriaTree, TreeItem, TreeItemContent, type DragAndDropHooks, type DropIndicatorProps } from 'react-aria-components';
import { Button } from './Button';
import { Icon } from './Icon';
import { chevronDownIcon, gripIcon } from './icons';

export interface TreeProps {
    'aria-label': string;
    /** Ids of the expanded sections. The caller owns it: update it from `onExpandedChange`. */
    expandedKeys: Iterable<string>;
    onExpandedChange: (keys: Set<string>) => void;
    /** From React Aria's useDragAndDrop. Its getDropOperation holds the drop rules, and renderDropIndicator can return a TreeDropIndicator. */
    dragAndDropHooks?: DragAndDropHooks;
    /** TreeSection elements, each holding TreeCard elements. */
    children: ReactNode;
}

export function Tree({ 'aria-label': label, expandedKeys, onExpandedChange, dragAndDropHooks, children }: TreeProps) {
    return (
        <AriaTree
            className="ui-tree"
            aria-label={label}
            dragAndDropHooks={dragAndDropHooks}
            expandedKeys={expandedKeys}
            onExpandedChange={(keys) => onExpandedChange(new Set(Array.from(keys, String)))}
        >
            {children}
        </AriaTree>
    );
}

export interface TreeSectionProps {
    id: string;
    /** The row's text and its accessible name. */
    title: string;
    /** Muted number after the title. */
    count?: number;
    /** Slot before the title for a drag handle. */
    drag?: ReactNode;
    /** Slot before the chevron for a row menu. */
    menu?: ReactNode;
    /** TreeCard elements. */
    children?: ReactNode;
}

export function TreeSection({ id, title, count, drag, menu, children }: TreeSectionProps) {
    return (
        <TreeItem id={id} textValue={title} hasChildItems className="ui-tree-section-item">
            <TreeItemContent>
                {({ isExpanded }) => (
                    <div className="ui-tree-section">
                        {drag}
                        <span className="ui-tree-section-title">{title}</span>
                        {count === undefined ? null : <span className="ui-tree-count">{count}</span>}
                        {menu}
                        <Button slot="chevron" variant="ghost" size="sm" icon aria-label={isExpanded ? 'Collapse' : 'Expand'}>
                            <Icon icon={chevronDownIcon} size="sm" />
                        </Button>
                    </div>
                )}
            </TreeItemContent>
            {children}
        </TreeItem>
    );
}

export interface TreeCardProps {
    id: string;
    /** The row's accessible name. */
    textValue: string;
    /** Row content: a label, plus any drag handle or menu the caller places. */
    children: ReactNode;
}

export function TreeCard({ id, textValue, children }: TreeCardProps) {
    return (
        <TreeItem id={id} textValue={textValue} className="ui-tree-card-item">
            <TreeItemContent>
                <div className="ui-tree-card">{children}</div>
            </TreeItemContent>
        </TreeItem>
    );
}

export interface TreeDragHandleProps {
    /** The handle's accessible name, such as "Drag Threshold". */
    'aria-label': string;
}

/** The grip button for TreeSection's `drag` slot or a TreeCard's content. Needs dragAndDropHooks on the Tree. */
export function TreeDragHandle({ 'aria-label': label }: TreeDragHandleProps) {
    return (
        <AriaButton slot="drag" className="ui-tree-grip" aria-label={label}>
            <Icon icon={gripIcon} size="sm" />
        </AriaButton>
    );
}

export interface TreeDropIndicatorProps extends DropIndicatorProps {
    /** Indent the line to the card level, for a target between cards. */
    child?: boolean;
}

/** The 2px drop line, for the `renderDropIndicator` of useDragAndDrop. */
export function TreeDropIndicator({ child, ...rest }: TreeDropIndicatorProps) {
    return <DropIndicator {...rest} className={child ? 'ui-tree-drop ui-tree-drop-child' : 'ui-tree-drop'} />;
}
