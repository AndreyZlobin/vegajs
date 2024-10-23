import type { Reactive } from '../types';
import type { ReactiveContext } from '../utils';

export const createReactive = <Value>(
  initialValue: Value,
  context: ReactiveContext,
): Reactive<Value> => {
  const callbacks = new Set<(value: Value) => void>();
  const weakSet = new WeakSet<(value: Value) => void>();
  let currentValue = initialValue;

  return {
    type: 'reactive',
    get() {
      const activeReactive = context.getActive();

      if (activeReactive && !weakSet.has(activeReactive)) {
        callbacks.add(activeReactive);
        weakSet.add(activeReactive);
      }

      return currentValue;
    },
    set(value) {
      currentValue =
        typeof value === 'function'
          ? (value as (prevValue: Value) => Value)(currentValue)
          : value;

      callbacks.forEach((callback) => {
        callback(currentValue);
      });
    },
    subscribe(callback) {
      if (!weakSet.has(callback)) {
        callbacks.add(callback);
        weakSet.add(callback);
      }

      return () => {
        callbacks.delete(callback);
      };
    },
    reset() {
      currentValue = initialValue;

      callbacks.forEach((callback) => {
        callback(currentValue);
      });
    },
  };
};
// function createReactive<Value>(
//   initialValue: Value,
//   context: ReactiveContext,
// ): Reactive<Value> {
//   const callbacks = new Set<(value: Value) => void>();
//   let currentValue: Value = initialValue;
//
//   return {
//     get() {
//       const activeReactive = context.getActive();
//
//       if (activeReactive) {
//         callbacks.add(activeReactive);
//       }
//
//       return currentValue;
//     },
//     set(value) {
//       currentValue =
//         typeof value === 'function'
//           ? (value as (prevValue: Value) => Value)(currentValue)
//           : value;
//
//       callbacks.forEach((callback) => callback(currentValue));
//     },
//     subscribe(callback) {
//       callbacks.add(callback);
//
//       return () => {
//         callbacks.delete(callback);
//       };
//     },
//     reset() {
//       currentValue = initialValue;
//       callbacks.forEach((callback) => callback(currentValue));
//     },
//   };
// }
