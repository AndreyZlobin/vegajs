import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { QueryOptions } from '../types';
import { Query } from './query';

describe('Query', () => {
  let query: Query<number, string, {}>;
  let mockFn: (options: {}) => Promise<number>;
  let mockOnSuccess: (data: number, options: {}) => void;
  let mockOnError: (error: string, options: {}) => void;

  beforeEach(() => {
    mockFn = vi.fn().mockResolvedValue(42);
    mockOnSuccess = vi.fn();
    mockOnError = vi.fn();

    const options: QueryOptions<number, string, {}> = {
      fn: mockFn,
      onSuccess: mockOnSuccess,
      onError: mockOnError,
      initialData: 0,
    };

    query = new Query(options);
  });

  it('should initialize with initial data and IDLE status', () => {
    expect(query.data.value).toBe(undefined);
    expect(query.isIdle.value).toBe(true);
  });

  it('should update data and set status to SUCCESS', () => {
    query.update(100);
    expect(query.data.value).toBe(100);
    expect(query.isSuccess.value).toBe(true);
  });

  it('should reset data, status, and error', () => {
    query.update(100);
    query.reset();
    expect(query.data.value).toBeUndefined();
    expect(query.isIdle.value).toBe(true);
    expect(query.isError.value).toBe(false);
    expect(query.isSuccess.value).toBe(false);
    expect(query.error.value).toBe(null);
  });

  it('should fetch data successfully and call onSuccess', async () => {
    const result = await query.fetch({});

    expect(result).toBe(42);
    expect(query.data.value).toBe(42);
    expect(query.isSuccess.value).toBe(true);
    expect(mockOnSuccess).toHaveBeenCalledWith(42, {});
  });

  it('should handle errors during fetch and call onError', async () => {
    const error = new Error('Request failed');

    // @ts-ignore
    mockFn.mockRejectedValueOnce(error);

    try {
      await query.fetch({});
    } catch (e) {
      expect(e).toBe(error);
    }

    expect(query.isError.value).toBe(true);
    expect(mockOnError).toHaveBeenCalledWith(error, {});
  });

  it('should start and stop polling with given interval', async () => {
    vi.useFakeTimers();

    const fetchSpy = vi.spyOn(query, 'fetch');

    await query.startPolling(1000, {});
    vi.advanceTimersByTime(3000);
    expect(fetchSpy).toHaveBeenCalledTimes(4);
    query.stopPolling();
    vi.advanceTimersByTime(3000);
    expect(fetchSpy).toHaveBeenCalledTimes(4);
    vi.useRealTimers();
  });

  it('should throw an error if polling interval is less than 0', async () => {
    await expect(query.startPolling(-1, {})).rejects.toThrow(
      'Interval must be greater than 0',
    );
  });

  it('should call fetch with options in fetchSync', () => {
    const fetchSpy = vi.spyOn(query, 'fetch');

    query.fetchSync({});
    expect(fetchSpy).toHaveBeenCalledWith({});
  });
});
