import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';

interface BaseProps extends Omit<AriaButtonProps, 'className' | 'style'> {
    variant?: 'primary' | 'secondary' | 'strong';
    size?: 'sm' | 'md' | 'action';
}

// An icon button has no text, so it must be named.
export type ButtonProps = (BaseProps & { icon?: false }) | (BaseProps & { icon: true; 'aria-label': string });

export function Button({ variant = 'secondary', size = 'md', icon = false, ...rest }: ButtonProps) {
    return <AriaButton {...rest} className="ui-button" data-variant={variant} data-size={size} data-icon={icon || undefined} />;
}
