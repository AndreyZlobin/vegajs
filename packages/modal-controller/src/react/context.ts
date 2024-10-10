import { createContext } from 'react';
import type { ModalController } from '../vanilla';

export const ModalContext = createContext<{ controller: ModalController }>({
  controller: null as unknown as ModalController,
});
