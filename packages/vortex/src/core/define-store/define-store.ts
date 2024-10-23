import type {
  DefineApi,
  DefineLocalApi,
  DefineStore,
  Reactive,
  StoreOptions,
  UnwrappedState,
  WatchCallback,
} from '../../types';
import {
  ReactiveContext,
  isComputed,
  isEqual,
  isReactive,
  toObjectKeys,
} from '../../utils';
import { createComputed } from '../create-computed';
import { createEffect } from '../create-effect';
import { createReactive } from '../create-reactive';

export const defineStore = <
  T extends Record<string, unknown>,
  DIDeps extends Record<string, unknown> | undefined = undefined,
>(
  setup: (args: DefineApi<DIDeps>) => T,
  options?: StoreOptions<T, DIDeps>,
): DefineStore<T> => {
  const listeners: Array<WatchCallback<UnwrappedState<T>>> = [];

  const { plugins = [], DI } = options || {};
  const localContext = new ReactiveContext();

  const reactive = <Value>(initialValue: Value) =>
    createReactive(initialValue, localContext);
  const computed = <Value>(fn: () => Value) => createComputed(fn, localContext);
  const effect = (fn: () => void) => createEffect(fn, localContext);

  const createApi = () => {
    const creators: DefineLocalApi<DIDeps> = { reactive, computed, effect };

    if (DI) {
      creators.DI = DI;
    }

    return creators as DefineApi<DIDeps>;
  };

  const state = setup(createApi());

  const action = (cb: (state: T) => unknown) => {
    cb(state);
  };

  const getSnapshot = () => {
    return toObjectKeys(state).reduce((acc, key) => {
      const reactiveUnit = state[key];

      if (isReactive(reactiveUnit) || isComputed(reactiveUnit)) {
        acc[key] = reactiveUnit.get() as UnwrappedState<T>[typeof key];
      } else {
        acc[key] = reactiveUnit as UnwrappedState<T>[typeof key];
      }

      return acc;
    }, {} as UnwrappedState<T>);
  };

  let prevState = getSnapshot();

  const subscribe = (callback: WatchCallback<UnwrappedState<T>>) => {
    listeners.push(callback);

    return () => {
      const index = listeners.indexOf(callback);

      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  };

  const triggerWatchers = (
    newState: UnwrappedState<T>,
    oldState: UnwrappedState<T>,
  ) => {
    if (!isEqual(newState, oldState)) {
      listeners.forEach((listener) => listener(newState, oldState));
    }
  };

  const observeReactivity = () => {
    const reactiveUnits = Object.keys(state).filter(
      (key) => isReactive(state[key]) || isComputed(state[key]),
    );

    reactiveUnits.forEach((key) => {
      const reactiveUnit = state[key] as Reactive<unknown>;

      reactiveUnit.subscribe(() => {
        const newState = getSnapshot();

        triggerWatchers(newState, prevState);
        prevState = newState;
      });
    });
  };

  observeReactivity();

  const store: DefineStore<T> = { state, getSnapshot, action, subscribe };

  plugins.forEach((plugin) => plugin(store));

  return store;
};
