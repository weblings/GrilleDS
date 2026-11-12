import { Button, Tooltip, TooltipTrigger } from './index';

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
};
