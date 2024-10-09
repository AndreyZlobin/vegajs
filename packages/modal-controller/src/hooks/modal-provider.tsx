import type { PropsWithChildren, ReactNode } from 'react';
import { useCallback, useRef, useState } from 'react';
import { EventEmitter } from '..//event-emitter';
import type { ModalUnit, ResolveObject, ServiceModalUnit } from '../types';
import { createConfirmId, isConfirmModalUnit, isModalUnit } from '../utils';
import { ModalContainer } from './modal-container-hook';
import { ModalContext } from './use-modal';

export const ModalProvider = ({
  children,
  BackdropComponent,
}: PropsWithChildren<{
  BackdropComponent?: ({ children }: { children: ReactNode }) => ReactNode;
}>) => {
  const [queue, setQueue] = useState<ServiceModalUnit[]>([]);
  const modalEmitter = useRef(new EventEmitter<ResolveObject<unknown>>());

  const current = queue[queue.length - 1];

  const isConfirm = isConfirmModalUnit(current!);

  const closeConfirm = useCallback(() => {
    setQueue((prevQueue) => {
      const newQueue = [...prevQueue];

      newQueue.pop();

      return newQueue;
    });
  }, []);

  const closeLastListener = useCallback(() => {
    const listener = modalEmitter.current.listeners.at(-1);

    if (listener) {
      modalEmitter.current.unsubscribe(listener);
    }
  }, []);

  const onResolve = useCallback(
    <T = unknown,>(status: boolean, data: T) => {
      if (modalEmitter.current.listeners.length > 0) {
        modalEmitter.current.emit({ status, data });
      }

      if (status && modalEmitter.current.listeners.length > 0) {
        closeLastListener();
      }

      if (isConfirm) {
        closeConfirm();
      }

      if (status) {
        setQueue((prevQueue) => {
          const newQueue = [...prevQueue];

          newQueue.pop();

          return newQueue;
        });
      }
    },
    [isConfirm, closeConfirm, closeLastListener],
  );
  const show = useCallback(
    <T = unknown,>(modal: ModalUnit) => {
      setQueue((prevQueue) => [
        ...prevQueue,
        {
          ...modal,
          onResolve: onResolve,
        },
      ]);

      return modalEmitter.current as EventEmitter<ResolveObject<T>>;
    },
    [onResolve],
  );

  const onClose = useCallback(() => {
    if (!current) {
      return;
    }

    if (isModalUnit(current) && current.confirmComponent) {
      show({
        id: createConfirmId(current.id),
        component: current.confirmComponent,
      });

      return;
    }

    if (isConfirm) {
      closeConfirm();

      return;
    }

    if (modalEmitter.current.listeners.length > 0) {
      closeLastListener();
    }

    setQueue((prevQueue) => {
      const newQueue = [...prevQueue];

      newQueue.pop();

      return newQueue;
    });
  }, [current, isConfirm, show, closeConfirm, closeLastListener]);

  const closeAll = useCallback(() => {
    setQueue([]);

    modalEmitter.current.listeners.forEach((l) => {
      modalEmitter.current.unsubscribe(l);
    });
  }, []);

  return (
    <ModalContext.Provider
      value={{ show, onClose, onResolve, closeAll, current }}
    >
      <ModalContainer BackdropComponent={BackdropComponent} />
      {children}
    </ModalContext.Provider>
  );
};
