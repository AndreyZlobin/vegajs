import type { EventBus } from '@vegajs/event-bus';
import { Fetcher } from '../fetcher';
import { StateEmitter } from '../state-emitter';
import type { EventsData, PrivateMutationOptions } from '../types';
import { Status } from '../types';

export class Mutation<TData = unknown, TError = unknown, TOptions = unknown> {
  readonly #fn: (options: TOptions) => Promise<TData>;

  readonly #onSuccess: (data: TData, options: TOptions) => void;

  readonly #onError: (error: TError, options: TOptions) => void;

  readonly eventBus: EventBus<EventsData<TData, TError>>;

  readonly #stateFactory: StateEmitter<TData, TError>;

  readonly #fetcher: Fetcher<TData, TError>;

  constructor({
    fn,
    onSuccess,
    onError,
    eventBus,
  }: PrivateMutationOptions<TData, TError, TOptions>) {
    this.#fn = fn;
    this.#onSuccess = onSuccess || (() => {});
    this.#onError = onError || (() => {});
    this.eventBus = eventBus;
    this.#stateFactory = new StateEmitter(this.eventBus);
    this.#fetcher = new Fetcher(this.#stateFactory);
  }

  public reset() {
    this.#stateFactory.setStatus(Status.IDLE);
    this.#stateFactory.setError(null);
  }

  public mutateSync = (options: TOptions) => {
    this.mutate(options);
  };

  public mutate = async (options: TOptions) => {
    return this.#fetcher
      .getRequestPromise(() => this.#fn(options))
      .then((data) => {
        this.#onSuccess(data, options);

        return data;
      })
      .catch((error) => {
        this.#stateFactory.setError(error);
        this.#onError(error, options);

        return Promise.reject(error);
      });
  };
}
