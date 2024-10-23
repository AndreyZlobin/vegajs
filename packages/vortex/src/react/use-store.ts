import { useRef, useSyncExternalStore } from 'react';
import type { DefineStore, UnwrappedState } from '../types';
import { isEqual } from '../utils';

export const useStore = <
  T extends Record<string, unknown>,
  Selected = UnwrappedState<T>,
>(
  store: DefineStore<T>,
  selector: (store: UnwrappedState<T>) => Selected = (s) => s as Selected,
): Selected => {
  const getSelectedState = () => selector(store.getSnapshot());
  const cachedSnapshot = useRef(getSelectedState());

  return useSyncExternalStore(
    (onStoreChange) => {
      return store.subscribe((newState, oldState) => {
        const newSelected = selector(newState);
        const oldSelected = selector(oldState);

        if (!isEqual(newSelected, oldSelected)) {
          cachedSnapshot.current = newSelected;
          onStoreChange();
        }
      });
    },
    () => cachedSnapshot.current,
    () => cachedSnapshot.current,
  );
};
