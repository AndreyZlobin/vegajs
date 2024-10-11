import { createElement, memo, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { ModalController } from '../core';
import type { ModalUnit } from '../types';

interface ModalContainerProps {
  controller: ModalController;
  BackdropComponent?: ({ children }: { children: ReactNode }) => ReactNode;
}

export const ModalContainer = memo(
  ({ controller, BackdropComponent }: ModalContainerProps) => {
    const [currentModal, setCurrentModal] = useState<ModalUnit | null>(null);
    const modalRootRef = useRef(document.createElement('div'));

    useEffect(() => {
      const modalRoot = modalRootRef.current;

      modalRoot.id = 'modal-container';
      document.body.appendChild(modalRoot);

      const unsubscribe = controller.subscribe((modal) => {
        setCurrentModal(modal);
      });

      return () => {
        document.body.removeChild(modalRoot);
        unsubscribe();
      };
    }, [controller]);

    if (!currentModal) {
      return null;
    }

    const props = {
      onClose: controller.onClose,
      onResolve: controller.onResolve,
      isOpen: true,
    };

    const modalContent = (
      <>
        {BackdropComponent && (
          <BackdropComponent>
            {createElement(currentModal.component, props)}
          </BackdropComponent>
        )}
        {!BackdropComponent && createElement(currentModal.component, props)}
      </>
    );

    return createPortal(modalContent, modalRootRef.current);
  },
);
