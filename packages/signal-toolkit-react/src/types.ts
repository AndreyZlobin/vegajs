import type { signal } from '@preact/signals-react';
import type { State } from '@vegajs/toolkit-core';

export type ReactiveState<TData = unknown, TError = unknown> = {
  [K in keyof State<TData, TError>]: ReturnType<
    typeof signal<State<TData, TError>[K]>
  >;
};
