import type { ComponentType, PropsWithChildren } from 'react';

export type OnResolve<T = unknown> = (status: boolean, data?: T) => void;

export type ResolveObject<T = unknown> = {
  status: Parameters<OnResolve<T>>[0];
  data: Parameters<OnResolve<T>>[1];
};

export type ModalProps<T = unknown> = {
  onClose: () => void;
  onResolve: OnResolve<T>;
  isOpen: boolean;
};

export type WithModalProps<Props extends object> =
  PropsWithChildren<ModalProps> & Props;

export type ModalComponent = ComponentType<ModalProps>;

export type BaseModalUnit<T = unknown> = {
  id: string;
  component: ModalComponent;
  confirmComponent?: ModalComponent;
  onResolve: OnResolve<T>;
};

export type ConfirmModalServiceUnit = Omit<BaseModalUnit, 'confirmComponent'>;

export type ServiceModalUnit = BaseModalUnit | ConfirmModalServiceUnit;

export type ModalUnit =
  | Omit<BaseModalUnit, 'onResolve'>
  | Omit<ConfirmModalServiceUnit, 'onResolve'>;
