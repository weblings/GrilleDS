import './styles/ui.css';
import { Button, Icon } from './index';
import * as icons from './icons';
import type { IconData } from './icons';

const all = Object.entries(icons).filter((entry): entry is [string, IconData] => 'viewBox' in entry[1]);
const sizes = ['md', 'sm'] as const;

// Every icon at each size, then on each button variant and size.
function Catalog() {
    return (
        <>
            {sizes.map((size) => (
                <div key={size} style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
                    {all.map(([name, icon]) => (
                        <div key={name} title={name} style={{ outline: '1px dashed #8886' }}>
                            <Icon icon={icon} size={size} />
                        </div>
                    ))}
                </div>
            ))}
        </>
    );
}

function OnButtons() {
    return (
        <>
            {(['secondary', 'primary'] as const).flatMap((variant) => sizes.map((size) => (
                <div key={`${variant}-${size}`} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                    {all.map(([name, icon]) => (
                        <Button key={name} icon variant={variant} size={size} aria-label={name}>
                            <Icon icon={icon} size={size} />
                        </Button>
                    ))}
                </div>
            )))}
        </>
    );
}

export default {
    all: <Catalog />,
    'on buttons': <OnButtons />,
    labelled: <Icon icon={icons.warningIcon} label="Warning" />,
};
