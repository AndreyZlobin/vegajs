import { Fetcher } from '../fetcher';
import { StatusFactory } from '../status-factory';
import type { MutationOptions } from '../types';

export class Mutation<TData = unknown, TError = unknown, TOptions = unknown> {
  private readonly statusFactory = new StatusFactory<TError>();

  private fetcher = new Fetcher<TData>(this.statusFactory);

  private readonly fn: (options: TOptions) => Promise<TData>;

  private readonly onSuccess: (data: TData, options: TOptions) => void;

  private readonly onError: (error: TError, options: TOptions) => void;

  constructor({
    fn,
    onSuccess,
    onError,
  }: MutationOptions<TData, TError, TOptions>) {
    this.fn = fn;
    this.onSuccess = onSuccess || (() => {});
    this.onError = onError || (() => {});
  }

  public get isIdle() {
    return this.statusFactory.isIdle;
  }

  public get isSuccess() {
    return this.statusFactory.isSuccess;
  }

  public get isError() {
    return this.statusFactory.isError;
  }

  public get isLoading() {
    return this.statusFactory.isLoading;
  }

  public get error() {
    return this.statusFactory.error;
  }

  public mutate(options: TOptions) {
    this.mutateAsync(options);
  }

  public async mutateAsync(options: TOptions) {
    return this.fetcher
      .getRequestPromise(() => this.fn(options))
      .then((data) => {
        this.onSuccess(data, options);

        return data;
      })
      .catch((error) => {
        this.statusFactory.setError(error);
        this.onError(error, options);

        return Promise.reject(error);
      });
  }
}
