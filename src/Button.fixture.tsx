import type { ReactNode } from 'react';
import { Button, Icon } from './index';
import { menuHorizontalIcon } from './icons';

const variants = ['secondary', 'primary', 'strong'] as const;
const ghostSizes = ['sm', 'md'] as const;
const sizes = ['md', 'sm', 'action'] as const;

function Row({ children }: { children: ReactNode }) {
    return <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>{children}</div>;
}

// Every variant x size x icon x disabled combination, one row per variant and size.
function Matrix() {
    return (
        <>
            {variants.flatMap((variant) => sizes.map((size) => (
                <Row key={`${variant}-${size}`}>
                    <Button variant={variant} size={size}>{variant} {size}</Button>
                    <Button variant={variant} size={size} isDisabled>Disabled</Button>
                    <Button variant={variant} size={size} icon aria-label="Add">+</Button>
                    <Button variant={variant} size={size} icon aria-label="Add" isDisabled>+</Button>
                </Row>
            )))}
        </>
    );
}

// Each variant enabled beside disabled: a disabled primary must still read as primary.
function DisabledVariants() {
    return (
        <>
            {variants.map((variant) => (
                <Row key={variant}>
                    <Button variant={variant}>{variant}</Button>
                    <Button variant={variant} isDisabled>{variant} disabled</Button>
                </Row>
            ))}
        </>
    );
}

// Ghost icon buttons at both squares. Hover, pressed and focus are forced with the data attributes React Aria sets.
function Ghost() {
    const forced = [
        ['rest', {}], ['hover', { 'data-hovered': true }], ['pressed', { 'data-pressed': true }],
        ['focus', { 'data-focus-visible': true }],
    ] as const;
    return (
        <>
            {ghostSizes.map((size) => (
                <Row key={size}>
                    <span style={{ width: 60 }}>{size}</span>
                    {forced.map(([label, attrs]) => (
                        <button key={label} type="button" aria-label={label} className="ui-button" data-variant="ghost" data-size={size} data-icon {...attrs}>
                            <Icon icon={menuHorizontalIcon} />
                        </button>
                    ))}
                    <Button variant="ghost" size={size} icon aria-label="expanded" aria-expanded="true"><Icon icon={menuHorizontalIcon} /></Button>
                    <Button variant="ghost" size={size} icon aria-label="disabled" isDisabled><Icon icon={menuHorizontalIcon} /></Button>
                </Row>
            ))}
        </>
    );
}

export default {
    default: <Button>Default</Button>,
    primary: <Button variant="primary">Primary</Button>,
    disabled: <Button isDisabled>Disabled</Button>,
    'disabled variants': <DisabledVariants />,
    'long label': <div style={{ maxWidth: 200 }}><Button>A button label long enough that it has to wrap</Button></div>,
    ghost: <Ghost />,
    matrix: <Matrix />,
};
