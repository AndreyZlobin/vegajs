import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Status, StatusFactory } from '../status-factory';
import { Fetcher } from './fetcher';

describe('Fetcher', () => {
  let statusFactory: StatusFactory;
  let fetcher: Fetcher<number>;

  beforeEach(() => {
    statusFactory = new StatusFactory();
    fetcher = new Fetcher(statusFactory);
  });

  it('should execute a successful request and update status to SUCCESS', async () => {
    const executor = vi.fn().mockResolvedValue(42);

    const promise = fetcher.getRequestPromise(executor);

    expect(statusFactory.status.value).toBe(Status.LOADING);

    const result = await promise;

    expect(result).toBe(42);
    expect(statusFactory.status.value).toBe(Status.SUCCESS);
    expect(statusFactory.isError.value).toBe(false);
    expect(statusFactory.error.value).toBeNull();
  });

  it('should handle a failed request and update status to ERROR', async () => {
    const executor = vi.fn().mockRejectedValue(new Error('Request failed'));

    try {
      await fetcher.getRequestPromise(executor);
    } catch (error) {
      expect(error).toEqual(new Error('Request failed'));
    }

    expect(statusFactory.status.value).toBe(Status.ERROR);
    expect(statusFactory.isError.value).toBe(true);
    expect(statusFactory.error.value).toEqual(new Error('Request failed'));
  });

  it('should reuse the same promise while the request is still in progress', async () => {
    const executor = vi.fn().mockResolvedValue(42);

    const promise1 = fetcher.getRequestPromise(executor);
    const promise2 = fetcher.getRequestPromise(executor);

    expect(promise1).toBe(promise2);
    await promise1;
    expect(statusFactory.status.value).toBe(Status.SUCCESS);
  });

  it('should create a new request promise after the previous one is resolved', async () => {
    const executor1 = vi.fn().mockResolvedValue(42);
    const executor2 = vi.fn().mockResolvedValue(84);

    const promise1 = fetcher.getRequestPromise(executor1);

    await promise1;

    const promise2 = fetcher.getRequestPromise(executor2);

    expect(promise1).not.toBe(promise2);

    const result = await promise2;

    expect(result).toBe(84);
    expect(statusFactory.status.value).toBe(Status.SUCCESS);
  });

  it('should clear requestPromise after request completion', async () => {
    const executor = vi.fn().mockResolvedValue(42);

    const promise = fetcher.getRequestPromise(executor);

    await promise;
    // @ts-ignore
    expect(fetcher.requestPromise).toBeUndefined();
  });

  it('should set error and status correctly when the request fails', async () => {
    const error = new Error('Something went wrong');
    const executor = vi.fn().mockRejectedValue(error);

    try {
      await fetcher.getRequestPromise(executor);
    } catch (e) {
      expect(statusFactory.status.value).toBe(Status.ERROR);
      expect(statusFactory.isError.value).toBe(true);
      expect(statusFactory.error.value).toEqual(error);
    }
  });
});
