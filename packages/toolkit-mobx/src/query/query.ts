import type { State } from '@vegajs/toolkit-core';
import {
  type PrivateQueryOptions,
  Query as QueryCore,
  Status,
} from '@vegajs/toolkit-core';
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';

export class Query<
  TData = unknown,
  TError = unknown,
  TOptions = unknown,
> extends QueryCore<TData, TError, TOptions> {
  private readonly state: State<TData, TError> = {
    data: undefined,
    status: Status.IDLE,
    error: null,
  };

  constructor(options: PrivateQueryOptions<TData, TError, TOptions>) {
    super(options);
    this.subscribe();

    makeObservable(this as ThisType<this>, {
      state: observable,
      subscribe: action,
      update: action,
      refetch: action,
      startPolling: action,
      stopPolling: action,
      fetchSync: action,
      fetch: action,
      data: computed,
      error: computed,
      isError: computed,
      isIdle: computed,
      isSuccess: computed,
      isLoading: computed,
    });
  }

  private subscribe() {
    this.eventBus.on('toolkit:data', (data) => {
      runInAction(() => {
        this.state.data = data;
      });
    });

    this.eventBus.on('toolkit:error', (error) => {
      runInAction(() => {
        this.state.error = error;
      });
    });

    this.eventBus.on('toolkit:status', (status) => {
      runInAction(() => {
        this.state.status = status;
      });
    });
  }

  public get data() {
    return this.state.data;
  }

  public get error() {
    return this.state.error;
  }

  /**
   * Flag indicating that the last request failed
   */
  public get isError() {
    return this.state.status === Status.ERROR || Boolean(this.error);
  }

  /**
   * Flag indicating that the data is in idle state
   */
  public get isIdle() {
    return this.state.status === Status.IDLE;
  }

  /**
   * Flag indicating the success of the last request
   */
  public get isSuccess() {
    return this.state.status === Status.SUCCESS;
  }

  /**
   * Flag indicating that data is being loaded
   */
  public get isLoading() {
    return this.state.status === Status.LOADING;
  }
}
