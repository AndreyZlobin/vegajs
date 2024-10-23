import type { DefineStore, UnwrappedState } from '../types';
import { isReactive, toObjectKeys } from '../utils';

export const persistPlugin =
  (key: string) =>
  <T extends Record<string, unknown>>(store: DefineStore<T>) => {
    const savedState = localStorage.getItem(key);

    if (savedState) {
      const parsedState = JSON.parse(savedState) as UnwrappedState<T>;

      store.action((state) => {
        toObjectKeys(parsedState).forEach((el) => {
          if (isReactive(state[el])) {
            state[el].set(() => parsedState[el]);
          }
        });
      });
    } else {
      localStorage.setItem(key, JSON.stringify(store.getSnapshot()));
    }

    store.subscribe((newState) => {
      localStorage.setItem(key, JSON.stringify(newState));
    });
  };
