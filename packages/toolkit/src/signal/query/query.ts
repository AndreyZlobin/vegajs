import { DataStorage } from '../data-storage';
import { batch, signal } from '../external';
import { Fetcher } from '../fetcher';
import { Status, StatusFactory } from '../status-factory';
import type { QueryOptions } from '../types';

export class Query<TData = unknown, TError = unknown, TOptions = unknown> {
  private readonly fn: (options: TOptions) => Promise<TData>;

  private readonly onSuccess: (data: TData, options: TOptions) => void;

  private readonly onError: (error: TError, options: TOptions) => void;

  private options = signal<TOptions | undefined>(undefined);

  private refetchInterval = signal<number | null>(null);

  private dataStorage = new DataStorage<TData>();

  private statusFactory = new StatusFactory<TError>();

  private fetcher = new Fetcher<TData>(this.statusFactory);

  constructor({
    fn,
    onSuccess,
    onError,
    initialData,
  }: QueryOptions<TData, TError, TOptions>) {
    this.fn = fn;
    this.onSuccess = onSuccess || (() => {});
    this.onError = onError || (() => {});

    if (initialData) {
      this.dataStorage.set(initialData as TData);
    }
  }

  public reset() {
    batch(() => {
      this.setOptions(undefined);
      this.dataStorage.set(undefined);
      this.statusFactory.setStatus(Status.IDLE);
      this.statusFactory.setError(null);
    });

    if (this.refetchInterval.value) {
      clearInterval(this.refetchInterval.value);
    }
  }

  public update(data?: TData): void {
    batch(() => {
      this.dataStorage.set(data);
      this.statusFactory.setStatus(Status.SUCCESS);
      this.statusFactory.setError(null);
    });
  }

  public get data() {
    return this.dataStorage.data;
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

  private setOptions(options?: TOptions) {
    this.options.value = options;
  }

  public refetch() {
    return this.fetchSync(this.options.value as TOptions);
  }

  public async startPolling(interval: number, options: TOptions) {
    await this.fetch(options as TOptions);

    if (interval < 0) {
      throw new Error('Interval must be greater than 0');
    }

    if (this.refetchInterval.value) {
      clearInterval(this.refetchInterval.value);
    }

    // @ts-ignore
    this.refetchInterval.value = setInterval(() => {
      this.fetch(options as TOptions);
    }, interval);
  }

  public stopPolling() {
    if (this.refetchInterval.value) {
      clearInterval(this.refetchInterval.value);
    }

    this.refetchInterval.value = null;
  }

  public fetchSync(options: TOptions) {
    this.fetch(options);
  }

  public async fetch(options: TOptions) {
    return this.fetcher
      .getRequestPromise(() => this.fn(options))
      .then((data) => {
        this.setOptions(options);
        this.dataStorage.set(data);
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
