import type { signal } from '@preact/signals-react';
import { EventBus } from '@vegajs/event-bus';
import type {
  EventsData,
  MutationOptions,
  QueryOptions,
} from '@vegajs/toolkit-core';
import { Mutation } from '../mutation';
import { Query } from '../query';

class Toolkit {
  private queries = new Map<
    string,
    { instance: Query; eventBus: EventBus<EventsData> }
  >();

  public createQuery = <TData = unknown, TError = unknown, TOptions = void>(
    options: QueryOptions<TData, TError, TOptions> & { key: string },
  ) => {
    const { key, ...restOptions } = options || {};

    if (key) {
      const cachedQuery = this.queries.get(key);

      if (cachedQuery) {
        return cachedQuery.instance as Query<TData, TError, TOptions>;
      }
    }

    const eventBus = new EventBus<EventsData<TData, TError>>();

    const newQuery = new Query<TData, TError, TOptions>({
      ...restOptions,
      eventBus,
    }) as Query;

    if (key) {
      this.queries.set(key, { instance: newQuery, eventBus });
    }

    return newQuery;
  };

  public createMutation<TData = unknown, TError = unknown, TOptions = unknown>(
    options: MutationOptions<TData, TError, TOptions>,
  ): Mutation<TData, TError, TOptions> {
    return new Mutation<TData, TError, TOptions>({
      ...options,
      eventBus: new EventBus<EventsData<TData, TError>>(),
    });
  }

  public invalidate = (key: string) => {
    const query = this.queries.get(key);

    if (query) {
      query.instance.refetch();
    }
  };

  public getQueryData = <TData = unknown>(key: string) => {
    const query = this.queries.get(key);

    return query?.instance?.data as
      | ReturnType<typeof signal<TData>>
      | undefined;
  };

  /**
   * Method for invalidate all queries
   */
  public invalidateQueries = () => {
    this.queries.forEach((q) => q.instance.refetch());
  };

  public resetQueries = () => {
    this.queries.forEach((q) => q.instance.reset());
    this.queries.clear();
  };

  public resetQuery = (key: string) => {
    this.queries.get(key)?.instance.reset();
    this.queries.delete(key);
  };
}

const createToolkit = () => {
  return new Toolkit();
};

export { createToolkit, Toolkit };
