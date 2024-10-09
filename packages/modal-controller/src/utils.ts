import { CONFIRM_ID } from './constants';
import type {
  BaseModalUnit,
  ConfirmModalServiceUnit,
  ModalUnit,
} from './types';

export function isModalUnit(unit: ModalUnit): unit is BaseModalUnit {
  return !(unit as BaseModalUnit)?.id?.startsWith(CONFIRM_ID);
}

export function isConfirmModalUnit(
  unit: ModalUnit,
): unit is ConfirmModalServiceUnit {
  return (unit as ConfirmModalServiceUnit)?.id?.startsWith(CONFIRM_ID);
}

export const createConfirmId = (id: string) => `${CONFIRM_ID}_${id}`;
