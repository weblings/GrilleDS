import type { ReactNode } from 'react';
import { Modal as AriaModal, ModalOverlay } from 'react-aria-components';

export interface ModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    // A click on the scrim closes the modal. Turn it off when closing would lose unsaved input.
    isDismissable?: boolean;
    // Escape closes the modal unless this is set.
    isKeyboardDismissDisabled?: boolean;
    // Put a Dialog inside, which names the modal and holds its content.
    children: ReactNode;
}

// A centred surface over a scrim. Focus is trapped inside while open and returns to where it was on close.
export function Modal({ isOpen, onOpenChange, isDismissable = true, isKeyboardDismissDisabled = false, children }: ModalProps) {
    return (
        <ModalOverlay
            className="ui-modal-overlay"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={isDismissable}
            isKeyboardDismissDisabled={isKeyboardDismissDisabled}
        >
            <AriaModal className="ui-modal">{children}</AriaModal>
        </ModalOverlay>
    );
}
