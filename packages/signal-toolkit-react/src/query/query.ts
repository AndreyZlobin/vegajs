import { computed, signal } from '@preact/signals-react';
import { Query as CoreQuery, Status } from '@vegajs/toolkit-core';
import type { PrivateQueryOptions } from '@vegajs/toolkit-core';
import type { ReactiveState } from '../types';

export class Query<
  TData = unknown,
  TError = unknown,
  TOptions = unknown,
> extends CoreQuery<TData, TError, TOptions> {
  readonly #state: ReactiveState<TData, TError> = {
    data: signal(undefined),
    status: signal(Status.IDLE),
    error: signal(null),
  };

  constructor(options: PrivateQueryOptions<TData, TError, TOptions>) {
    super(options);
    this.#subscribe();
  }

  #subscribe = () => {
    this.eventBus.on('toolkit:data', (data) => {
      this.#state.data.value = data;
    });

    this.eventBus.on('toolkit:error', (error) => {
      this.#state.error.value = error;
    });

    this.eventBus.on('toolkit:status', (status) => {
      this.#state.status.value = status;
    });
  };

  public data = computed(() => this.#state.data.value);

  public error = computed(() => this.#state.error.value);

  /**
   * Flag indicating that the last request failed
   */
  public isError = computed(
    () =>
      this.#state.status.value === Status.ERROR || Boolean(this.error.value),
  );

  /**
   * Flag indicating that the data is in idle state
   */
  public isIdle = computed(() => this.#state.status.value === Status.IDLE);

  /**
   * Flag indicating the success of the last request
   */
  public isSuccess = computed(
    () => this.#state.status.value === Status.SUCCESS,
  );

  /**
   * Flag indicating that data is being loaded
   */
  public isLoading = computed(
    () => this.#state.status.value === Status.LOADING,
  );
}
