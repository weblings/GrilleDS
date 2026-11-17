import { useRef } from 'react';
import { Button, Tooltip, TooltipTrigger } from './index';

// The box is not focusable and has no trigger: the owner opens the tooltip.
function StandaloneFixture() {
    const ref = useRef<HTMLDivElement>(null);
    return (
        <div style={{ padding: 48 }}>
            <div ref={ref} style={{ display: 'inline-block', padding: 16, border: '1px dashed currentColor' }}>A plain box</div>
            <Tooltip triggerRef={ref} isOpen>Opened by its owner, not by a trigger.</Tooltip>
        </div>
    );
}

export default {
    default: (
        <div style={{ padding: 48 }}>
            <TooltipTrigger delay={0}>
                <Button>Hover or focus me</Button>
                <Tooltip>Plain text help.</Tooltip>
            </TooltipTrigger>
        </div>
    ),
    'rich content': (
        <div style={{ padding: 48 }}>
            <TooltipTrigger delay={0}>
                <Button>Effect</Button>
                <Tooltip>
                    <p><b>Reverb</b> adds space to the sound.</p>
                    <ul><li>Mix: wet amount</li><li>Size: room length</li></ul>
                </Tooltip>
            </TooltipTrigger>
        </div>
    ),
    'standalone (isOpen)': <StandaloneFixture />,
};
