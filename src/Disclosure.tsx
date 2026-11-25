import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { chevronDownIcon, chevronRightIcon } from './icons';
import { Button, Disclosure as AriaDisclosure, DisclosurePanel, Heading } from 'react-aria-components';

export interface DisclosureProps {
    title: string;
    children: ReactNode;
    /** `link` is the text trigger, `accordion` a full-width header pill with a trailing chevron. */
    variant?: 'link' | 'accordion';
    isExpanded?: boolean;
    defaultExpanded?: boolean;
    onExpandedChange?: (isExpanded: boolean) => void;
}

export function Disclosure({ title, children, variant = 'link', isExpanded, defaultExpanded, onExpandedChange }: DisclosureProps) {
    const accordion = variant === 'accordion';
    const chevron = <Icon icon={accordion ? chevronDownIcon : chevronRightIcon} size="sm" />;
    return (
        <AriaDisclosure
            className="ui-disclosure"
            data-variant={variant}
            isExpanded={isExpanded}
            defaultExpanded={defaultExpanded}
            onExpandedChange={onExpandedChange}
        >
            <Heading className="ui-disclosure-heading">
                <Button slot="trigger" className="ui-disclosure-trigger">
                    {accordion ? <>{title}{chevron}</> : <>{chevron}{title}</>}
                </Button>
            </Heading>
            <DisclosurePanel className="ui-disclosure-panel">{children}</DisclosurePanel>
        </AriaDisclosure>
    );
}
