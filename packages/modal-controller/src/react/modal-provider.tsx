import type { PropsWithChildren, ReactNode } from 'react';
import { useRef } from 'react';
import { ModalController } from '../core';
import { ModalContext } from './context';
import { ModalContainer } from './modal-container';

export const ModalProvider = ({
  children,
  controller,
  BackdropComponent,
}: PropsWithChildren<{
  controller?: ModalController;
  BackdropComponent?: ({ children }: { children: ReactNode }) => ReactNode;
}>) => {
  const controllerRef = useRef<ModalController>(
    controller || new ModalController(),
  );

  return (
    <ModalContext.Provider value={{ controller: controllerRef.current }}>
      <ModalContainer
        BackdropComponent={BackdropComponent}
        controller={controllerRef.current}
      />
      {children}
    </ModalContext.Provider>
  );
};
