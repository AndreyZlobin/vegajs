import { createContext, useContext } from 'react';
import type { EventEmitter } from '../event-emitter';
import type { ModalUnit, ResolveObject, ServiceModalUnit } from '../types';

interface ModalContextProps {
  show: <T = unknown>(modal: ModalUnit) => EventEmitter<ResolveObject<T>>;
  onClose: () => void;
  onResolve: <T = unknown>(status: boolean, data: T) => void;
  closeAll: () => void;
  current: ServiceModalUnit | undefined;
}

export const ModalContext = createContext<ModalContextProps | null>(null);

export const useModal = (): ModalContextProps => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
};
