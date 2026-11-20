import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';

interface BaseProps extends Omit<AriaButtonProps, 'className' | 'style'> {
    /** 'ghost' is a borderless icon button for row and head menus: with `icon`, size sm is a 24px square and md the 31px square. */
    variant?: 'primary' | 'secondary' | 'strong' | 'ghost';
    size?: 'sm' | 'md' | 'action';
}

// An icon button has no text, so it must be named.
export type ButtonProps = (BaseProps & { icon?: false }) | (BaseProps & { icon: true; 'aria-label': string });

export function Button({ variant = 'secondary', size = 'md', icon = false, ...rest }: ButtonProps) {
    return <AriaButton {...rest} className="ui-button" data-variant={variant} data-size={size} data-icon={icon || undefined} />;
}
