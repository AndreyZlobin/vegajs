import { useCallback, useRef, useSyncExternalStore } from 'react';
import type { DefineStore, UnwrappedState } from '../types';
import { shallowEqual } from '../utils';

export const useStore = <
  T extends Record<string, unknown>,
  Selected = UnwrappedState<T>,
>(
  store: DefineStore<T>,
  selector: (store: UnwrappedState<T>) => Selected = (s) => s as Selected,
): Selected => {
  const memoizedSelector = useCallback(selector, []);

  const getSelectedState = () => memoizedSelector(store.getSnapshot());
  const cachedSnapshot = useRef(getSelectedState());

  return useSyncExternalStore(
    (onStoreChange) => {
      return store.subscribe((newState, oldState) => {
        const newSelected = memoizedSelector(newState);
        const oldSelected = memoizedSelector(oldState);

        if (!shallowEqual(newSelected, oldSelected)) {
          cachedSnapshot.current = newSelected;
          onStoreChange();
        }
      });
    },
    () => cachedSnapshot.current,
    () => cachedSnapshot.current,
  );
};
