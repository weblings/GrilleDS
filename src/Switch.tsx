import { Switch as AriaSwitch } from 'react-aria-components';

export interface SwitchProps {
    label: string;
    isSelected: boolean;
    onChange: (isSelected: boolean) => void;
    isDisabled?: boolean;
}

export function Switch({ label, isSelected, onChange, isDisabled }: SwitchProps) {
    return (
        <AriaSwitch className="ui-switch" isSelected={isSelected} onChange={onChange} isDisabled={isDisabled}>
            <span className="ui-switch-label">{label}</span>
            <span className="ui-switch-track"><span className="ui-switch-knob" /></span>
        </AriaSwitch>
    );
}
