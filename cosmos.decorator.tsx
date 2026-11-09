import type { ReactNode } from 'react';
import './src/fonts.css';
import './src/tokens.css';
import './src/styles/ui.css';
import './cosmos.css';
import { Inspector } from './viewer/Inspector';

export default function Decorator({ children }: { children: ReactNode }) {
    return (
        <div className="cosmos-page">
            {children}
            <Inspector />
        </div>
    );
}
