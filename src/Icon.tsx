import { chevronDownIcon, type IconData } from './icons';

export interface IconProps {
    icon: IconData;
    /** Accessible name. Without it the icon is decorative and hidden from assistive tech. */
    label?: string;
    size?: 'sm' | 'md';
}

export function Icon({ icon, label, size = 'md' }: IconProps) {
    return (
        <svg
            className="ui-icon"
            data-size={size}
            {...(icon === chevronDownIcon ? { 'data-chevron': '' } : {})}
            {...(icon.tight ? { 'data-tight': '' } : {})}
            viewBox={icon.viewBox}
            fill="currentColor"
            focusable="false"
            {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
        >
            {icon.paths.map((path, i) => (
                <path
                    key={i}
                    d={path.d}
                    fillRule={path.fillRule}
                    {...(path.stroke ? { fill: 'none', stroke: 'currentColor', strokeWidth: path.stroke.width } : {})}
                />
            ))}
        </svg>
    );
}
