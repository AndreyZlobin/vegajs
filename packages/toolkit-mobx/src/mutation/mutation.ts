import {
  Mutation as MutationCore,
  type PrivateMutationOptions,
  type State,
  Status,
} from '@vegajs/toolkit-core';
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';

export class Mutation<
  TData = unknown,
  TError = unknown,
  TOptions = unknown,
> extends MutationCore<TData, TError, TOptions> {
  private readonly state: Omit<State<TData, TError>, 'data'> = {
    status: Status.IDLE,
    error: null,
  };

  constructor(options: PrivateMutationOptions<TData, TError, TOptions>) {
    super(options);

    makeObservable(this as ThisType<this>, {
      state: observable,
      subscribe: action,
      mutateSync: action,
      mutate: action,
      error: computed,
      isError: computed,
      isIdle: computed,
      isSuccess: computed,
      isLoading: computed,
    });

    this.subscribe();
  }

  private subscribe() {
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
