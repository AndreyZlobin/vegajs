import { EventBus } from '@vegajs/event-bus';
import type {
  EventsData,
  MutationOptions,
  QueryOptions,
} from '@vegajs/toolkit-core';
import { Mutation } from '../mutation';
import { Query } from '../query';

class WrappedMutation<TData = unknown, TError = unknown, TOptions = void> {
  constructor(
    private readonly options: MutationOptions<TData, TError, TOptions>,
  ) {}

  get instance() {
    const eventBus = new EventBus<EventsData<TData, TError>>();

    return new Mutation<TData, TError, TOptions>({
      ...this.options,
      eventBus,
    });
  }
}

class WrappedQuery<TData = unknown, TError = unknown, TOptions = void> {
  constructor(
    private readonly options: QueryOptions<TData, TError, TOptions>,
  ) {}

  get instance() {
    const eventBus = new EventBus<EventsData<TData, TError>>();

    return new Query<TData, TError, TOptions>({
      ...this.options,
      eventBus,
    }) as Query;
  }
}

class Toolkit {
  private queries = new Map<string, Query>();

  public createQuery = <TData = unknown, TError = unknown, TOptions = void>(
    options: QueryOptions<TData, TError, TOptions> & { key: string },
  ) => {
    const { key, ...restOptions } = options || {};

    if (key) {
      const cachedQuery = this.queries.get(key);

      if (cachedQuery) {
        return cachedQuery as Query<TData, TError, TOptions>;
      }
    }

    const newQuery = new WrappedQuery<TData, TError, TOptions>(restOptions)
      .instance as Query;

    if (key) {
      this.queries.set(key, newQuery);
    }

    return newQuery;
  };

  public createMutation<TData = unknown, TError = unknown, TOptions = unknown>(
    options: MutationOptions<TData, TError, TOptions>,
  ): Mutation<TData, TError, TOptions> {
    return new WrappedMutation<TData, TError, TOptions>(options).instance;
  }

  public invalidate = (key: string) => {
    const query = this.queries.get(key);

    if (query) {
      query.refetch();
    }
  };

  public getQueryData = <TData = unknown>(key: string) => {
    const query = this.queries.get(key) as Query<TData>;

    return query?.data;
  };

  /**
   * Method for invalidate all queries
   */
  public invalidateQueries = () => {
    this.queries.forEach((q) => q.refetch());
  };

  public resetQueries = () => {
    this.queries.forEach((q) => q.reset());
    this.queries.clear();
  };

  public resetQuery = (key: string) => {
    this.queries.get(key)?.reset();
    this.queries.delete(key);
  };
}

const createToolkit = () => {
  return new Toolkit();
};

export { createToolkit, Toolkit };
