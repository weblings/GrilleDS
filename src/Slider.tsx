import { useEffect, useRef } from 'react';
import { Label, Slider as AriaSlider, SliderOutput, SliderThumb, SliderTrack } from 'react-aria-components';

export interface SliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (value: number) => void;
    /** Fires once per gesture: pointer release, or key up/blur after keyboard steps. */
    onChangeEnd?: (value: number) => void;
    /** Header row (label left, value right) above a full-width track. */
    fullWidth?: boolean;
}

export function Slider({ label, value, min, max, step = 1, onChange, onChangeEnd, fullWidth }: SliderProps) {
    const keyHeld = useRef(false);
    const pending = useRef<number | null>(null);
    const root = useRef<HTMLDivElement>(null);
    // React Aria ends a keyboard gesture on every key repeat, so hold the end until key up or blur.
    const flush = () => {
        keyHeld.current = false;
        if (pending.current === null) return;
        const v = pending.current;
        pending.current = null;
        onChangeEnd?.(v);
    };
    const flushRef = useRef(flush);
    flushRef.current = flush;
    useEffect(() => {
        const el = root.current;
        if (!el) return;
        const down = () => { keyHeld.current = true; };
        const up = () => flushRef.current();
        el.addEventListener('keydown', down, true);
        el.addEventListener('keyup', up);
        el.addEventListener('focusout', up);
        return () => {
            el.removeEventListener('keydown', down, true);
            el.removeEventListener('keyup', up);
            el.removeEventListener('focusout', up);
        };
    }, []);
    const handleEnd = (v: number) => {
        if (keyHeld.current) pending.current = v;
        else onChangeEnd?.(v);
    };
    return (
        <AriaSlider
            ref={root}
            className="ui-field ui-slider"
            data-full-width={fullWidth || undefined}
            value={value}
            minValue={min}
            maxValue={max}
            step={step}
            onChange={onChange}
            onChangeEnd={onChangeEnd ? handleEnd : undefined}
        >
            {fullWidth ? (
                <div className="ui-slider-header">
                    <Label className="ui-field-label">{label}</Label>
                    <SliderOutput className="ui-slider-output" />
                </div>
            ) : <Label className="ui-field-label">{label}</Label>}
            <div className="ui-slider-control">
                <SliderTrack className="ui-slider-track">
                    {({ state }) => (
                        <>
                            <div className="ui-slider-fill" style={{ width: `${state.getThumbPercent(0) * 100}%` }} />
                            <SliderThumb className="ui-slider-thumb" />
                        </>
                    )}
                </SliderTrack>
                {!fullWidth && <SliderOutput className="ui-slider-output" />}
            </div>
        </AriaSlider>
    );
}
