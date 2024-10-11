import type { StatusFactory } from '../status-factory';
import { Status } from '../status-factory';

/**
 * @description Request executor
 */
type Executor<TResult> = () => Promise<TResult>;

/**
 * @description Helper storage for data, to be composed in Query stores.
 * It contains loading and error flags,
 * callbacks for successful requests and errors,
 * data of the last error,
 * and it also manages a singleton promise.
 */
export class Fetcher<TResult, TError = unknown> {
  /**
   * A single promise to prevent request race conditions
   */
  private requestPromise?: Promise<TResult>;

  constructor(private readonly statusFactory: StatusFactory<TError>) {}

  /**
   * Description: A method responsible for creating a single promise
   * to prevent request race conditions
   */
  public getRequestPromise = (executor: Executor<TResult>) => {
    if (!Boolean(this.requestPromise)) {
      this.statusFactory.setError(null);
      this.statusFactory.setStatus(Status.LOADING);

      this.requestPromise = executor()
        .then((resData: TResult) => {
          this.statusFactory.setStatus(Status.SUCCESS);

          return resData;
        })
        .catch((error) => {
          this.statusFactory.setStatus(Status.ERROR);
          this.statusFactory.setError(error);

          throw error;
        })
        .finally(() => {
          this.requestPromise = undefined;
        });
    }

    return this.requestPromise as Promise<TResult>;
  };
}
