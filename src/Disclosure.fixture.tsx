import { Disclosure } from './index';

export default {
    default: <Disclosure title="Disclosure"><p>Panel content.</p></Disclosure>,
    'long text': (
        <div style={{ maxWidth: 320 }}>
            <Disclosure title="A disclosure title long enough that it wraps onto a second line"><p>A long line of text that keeps going well past the width of the container so that it has to wrap onto several lines and shows how the component copes with it.</p></Disclosure>
        </div>
    ),
};
