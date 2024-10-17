import { describe, expect, it, vi } from 'vitest';
import type { StateEmitter } from '../state-emitter';
import { Status } from '../types';
import { Fetcher } from './fetcher';

const createMockStateEmitter = <TData = unknown, TError = unknown>() => {
  return {
    setData: vi.fn(),
    setError: vi.fn(),
    setStatus: vi.fn(),
  } as unknown as StateEmitter<TData, TError>;
};

describe('Fetcher', () => {
  it('should execute the request and update state on success', async () => {
    const mockStateEmitter = createMockStateEmitter();
    const fetcher = new Fetcher(mockStateEmitter);

    const mockResult = { data: 'success' };
    const mockExecutor = vi.fn().mockResolvedValue(mockResult);

    const result = await fetcher.getRequestPromise(mockExecutor);

    expect(mockExecutor).toHaveBeenCalled();
    expect(result).toEqual(mockResult);
    expect(mockStateEmitter.setError).toHaveBeenCalledWith(null);
    expect(mockStateEmitter.setStatus).toHaveBeenCalledWith(Status.LOADING);
    expect(mockStateEmitter.setStatus).toHaveBeenCalledWith(Status.SUCCESS);
  });

  it('should execute the request and update state on failure', async () => {
    const mockStateEmitter = createMockStateEmitter();
    const fetcher = new Fetcher(mockStateEmitter);

    const mockError = new Error('Request failed');
    const mockExecutor = vi.fn().mockRejectedValue(mockError);

    await expect(fetcher.getRequestPromise(mockExecutor)).rejects.toThrow(
      mockError,
    );

    expect(mockExecutor).toHaveBeenCalled();
    expect(mockStateEmitter.setError).toHaveBeenCalledWith(null);
    expect(mockStateEmitter.setStatus).toHaveBeenCalledWith(Status.LOADING);
    expect(mockStateEmitter.setStatus).toHaveBeenCalledWith(Status.ERROR);
    expect(mockStateEmitter.setError).toHaveBeenCalledWith(mockError);
  });

  it('should prevent race conditions by reusing the same promise', async () => {
    const mockStateEmitter = createMockStateEmitter();
    const fetcher = new Fetcher(mockStateEmitter);

    const mockResult = { data: 'success' };
    const mockExecutor = vi.fn().mockResolvedValue(mockResult);

    // Запускаем два запроса подряд
    const promise1 = fetcher.getRequestPromise(mockExecutor);
    const promise2 = fetcher.getRequestPromise(mockExecutor);

    expect(mockExecutor).toHaveBeenCalledTimes(1);
    expect(promise1).toBe(promise2);
    await promise1;
    await promise2;
    expect(mockStateEmitter.setStatus).toHaveBeenCalledWith(Status.SUCCESS);
  });

  it('should reset the requestPromise after the request completes', async () => {
    const mockStateEmitter = createMockStateEmitter();
    const fetcher = new Fetcher(mockStateEmitter);

    const mockResult = { data: 'success' };
    const mockExecutor = vi.fn().mockResolvedValue(mockResult);

    await fetcher.getRequestPromise(mockExecutor);

    const promiseAfterCompletion = fetcher.getRequestPromise(mockExecutor);

    expect(promiseAfterCompletion).not.toBe(mockExecutor);
  });
});
