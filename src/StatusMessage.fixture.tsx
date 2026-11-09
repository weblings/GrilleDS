import { StatusMessage } from './index';

export default {
    default: <StatusMessage>Status message.</StatusMessage>,
    warning: <StatusMessage tone="warning">Warning message.</StatusMessage>,
    error: <StatusMessage tone="error" urgent>Error message.</StatusMessage>,
    'long text': (
        <div style={{ maxWidth: 320 }}>
            <StatusMessage tone="error">A long line of text that keeps going well past the width of the container so that it has to wrap onto several lines and shows how the component copes with it.</StatusMessage>
        </div>
    ),
    empty: <StatusMessage />,
};
