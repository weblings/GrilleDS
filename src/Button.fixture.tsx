import type { ReactNode } from 'react';
import { Button } from './index';

const variants = ['secondary', 'primary'] as const;
const sizes = ['md', 'sm'] as const;

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

export default {
    default: <Button>Default</Button>,
    primary: <Button variant="primary">Primary</Button>,
    disabled: <Button isDisabled>Disabled</Button>,
    matrix: <Matrix />,
};
