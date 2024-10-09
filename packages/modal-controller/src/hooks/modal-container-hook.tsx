import type { ReactNode } from 'react';
import { createElement, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useModal } from './use-modal';

export const ModalContainer = ({
  BackdropComponent,
}: {
  BackdropComponent?: ({ children }: { children: ReactNode }) => ReactNode;
}) => {
  const { current, onClose, onResolve, closeAll } = useModal();

  const modalRootRef = useRef(document.createElement('div'));

  useEffect(() => {
    const modalRoot = modalRootRef.current;

    modalRoot.id = 'modal-container';
    document.body.appendChild(modalRoot);

    return () => {
      closeAll();
      document.body.removeChild(modalRoot);
    };
  }, []);

  if (!current) {
    return null;
  }

  const props = {
    onClose,
    onResolve,
    isOpen: true,
  };

  const modalContent = (
    <>
      {BackdropComponent && (
        <BackdropComponent children={createElement(current.component, props)} />
      )}
      {!BackdropComponent && createElement(current.component, props)}
    </>
  );

  return createPortal(modalContent, modalRootRef.current);
};
