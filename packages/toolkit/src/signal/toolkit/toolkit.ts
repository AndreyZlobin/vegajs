import { Mutation } from '../mutation';
import { Query } from '../query';
import type { MutationOptions, QueryOptions } from '../types';

export class SignalToolkit {
  private queries = new Map<string, Query>();

  public createQuery<TData = unknown, TError = unknown, TOptions = unknown>(
    options: QueryOptions<TData, TError, TOptions> & { key: string },
  ) {
    const { key, ...restOptions } = options || {};

    if (key) {
      const cachedQuery = this.queries.get(key);

      if (cachedQuery) {
        return cachedQuery as Query<TData, TError, TOptions>;
      }
    }

    const newQuery = new Query<TData, TError, TOptions>(restOptions);

    if (key) {
      this.queries.set(key, newQuery as Query<unknown>);
    }

    return newQuery;
  }

  public createMutation<Data = unknown, TError = unknown, TOptions = unknown>(
    options: MutationOptions<Data, TError, TOptions>,
  ) {
    return new Mutation<Data, TError, TOptions>(options);
  }

  public invalidate(key: string) {
    const query = this.queries.get(key);

    if (query) {
      query.refetch();
    }
  }

  /**
   * Method for invalidate all queries
   */
  public invalidateQueries = () => {
    this.queries.forEach((q) => q.refetch());
  };
}

export const createSignalToolkit = () => {
  return new SignalToolkit();
};
