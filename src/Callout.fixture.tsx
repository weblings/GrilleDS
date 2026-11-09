import { Callout } from './index';

export default {
    default: <Callout title="Callout"><p>Callout body.</p></Callout>,
    'long text': (
        <div style={{ maxWidth: 320 }}>
            <Callout title="A callout title long enough that it wraps onto a second line">
                <p>A long line of text that keeps going well past the width of the container so that it has to wrap onto several lines and shows how the component copes with it.</p>
            </Callout>
        </div>
    ),
};
