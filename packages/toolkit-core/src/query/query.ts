import type { EventBus } from '@vegajs/event-bus';
import { Fetcher } from '../fetcher';
import { StateEmitter } from '../state-emitter';
import type { EventsData, PrivateQueryOptions } from '../types';
import { Status } from '../types';

export class Query<TData = unknown, TError = unknown, TOptions = unknown> {
  readonly #fn: (options: TOptions) => Promise<TData>;

  readonly #onSuccess: (data: TData, options: TOptions) => void;

  readonly #onError: (error: TError, options: TOptions) => void;

  readonly eventBus: EventBus<EventsData<TData, TError>>;

  readonly #stateFactory: StateEmitter<TData, TError>;

  readonly #fetcher: Fetcher<TData, TError>;

  #options: TOptions | undefined = undefined;

  #refetchInterval: ReturnType<typeof setInterval> | null = null;

  constructor({
    fn,
    onSuccess,
    onError,
    initialData,
    eventBus,
  }: PrivateQueryOptions<TData, TError, TOptions>) {
    this.#fn = fn;
    this.#onSuccess = onSuccess || (() => {});
    this.#onError = onError || (() => {});
    this.eventBus = eventBus;
    this.#stateFactory = new StateEmitter(this.eventBus);
    this.#fetcher = new Fetcher(this.#stateFactory);

    if (initialData) {
      this.#stateFactory.setData(initialData as TData);
    }
  }

  public reset() {
    this.setOptions(undefined);
    this.#stateFactory.setData(undefined);
    this.#stateFactory.setStatus(Status.IDLE);
    this.#stateFactory.setError(null);
    this.#clearInterval();
  }

  public update = (data?: TData) => {
    this.#stateFactory.setData(data);
    this.#stateFactory.setStatus(Status.SUCCESS);
    this.#stateFactory.setError(null);
  };

  protected setOptions = (options?: TOptions) => {
    this.#options = options;
  };

  public refetch = () => {
    return this.fetchSync(this.#options as TOptions);
  };

  public startPolling = async (
    interval: number,
    options: TOptions,
    immediate = false,
  ) => {
    if (immediate) {
      await this.fetch(options as TOptions);
    }

    if (interval < 0) {
      throw new Error('Interval must be greater than 0');
    }

    this.#clearInterval();

    this.#refetchInterval = setInterval(() => {
      this.fetch(options as TOptions);
    }, interval);
  };

  public stopPolling = () => {
    this.#clearInterval();
    this.#refetchInterval = null;
  };

  #clearInterval = () => {
    if (this.#refetchInterval) {
      clearInterval(this.#refetchInterval);
    }
  };

  public fetchSync = (options: TOptions) => {
    this.fetch(options);
  };

  public fetch = async (options: TOptions) => {
    return this.#fetcher
      .getRequestPromise(() => this.#fn(options))
      .then((data) => {
        this.setOptions(options);
        this.#stateFactory.setData(data);
        this.#onSuccess(data, options);

        return data;
      })
      .catch((error) => {
        this.#onError(error, options);

        return Promise.reject(error);
      });
  };
}
