import type { ReactNode } from 'react';
import { Header as AriaHeader } from 'react-aria-components';

// Section heading for custom layouts. Section already renders one from its title.
export function Header({ children }: { children: ReactNode }) {
    return <AriaHeader className="ui-section-header">{children}</AriaHeader>;
}
