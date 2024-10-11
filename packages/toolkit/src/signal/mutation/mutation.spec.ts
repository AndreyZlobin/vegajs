import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MutationOptions } from '../types';
import { Mutation } from './mutation';

describe('Mutation', () => {
  let mutation: Mutation<number, string, {}>;
  let mockFn: Mock<(options: {}) => Promise<number>>;
  let mockOnSuccess: Mock<(data: number, options: {}) => void>;
  let mockOnError: Mock<(error: string, options: {}) => void>;

  beforeEach(() => {
    mockFn = vi.fn() as Mock<(options: {}) => Promise<number>>;
    mockOnSuccess = vi.fn();
    mockOnError = vi.fn();

    const options: MutationOptions<number, string, {}> = {
      fn: mockFn,
      onSuccess: mockOnSuccess,
      onError: mockOnError,
    };

    mutation = new Mutation(options);
  });

  // Test for successful mutation
  it('should execute a successful mutation and call onSuccess', async () => {
    mockFn.mockResolvedValueOnce(42);

    const result = await mutation.mutateAsync({});

    expect(result).toBe(42);
    expect(mockOnSuccess).toHaveBeenCalledWith(42, {});
    expect(mutation.isSuccess.value).toBe(true);
    expect(mutation.isLoading.value).toBe(false);
    expect(mutation.isError.value).toBe(false);
  });

  // Test for failed mutation
  it('should handle errors during mutation and call onError', async () => {
    const error = new Error('Mutation failed');

    mockFn.mockRejectedValueOnce(error);

    try {
      await mutation.mutateAsync({});
    } catch (e) {
      expect(e).toBe(error);
    }

    expect(mockOnError).toHaveBeenCalledWith(error, {});
    expect(mutation.isError.value).toBe(true);
    expect(mutation.error.value).toBe(error);
    expect(mutation.isLoading.value).toBe(false);
    expect(mutation.isSuccess.value).toBe(false);
  });

  it('should call mutateAsync when mutate is invoked', async () => {
    const mutateAsyncSpy = vi.spyOn(mutation, 'mutateAsync');

    mutation.mutate({});
    expect(mutateAsyncSpy).toHaveBeenCalledWith({});
  });

  it('should update status to loading, success, or error during mutation', async () => {
    expect(mutation.isIdle.value).toBe(true);
    mockFn.mockResolvedValueOnce(42);

    const promise = mutation.mutateAsync({});

    expect(mutation.isLoading.value).toBe(true);
    await promise;
    expect(mutation.isSuccess.value).toBe(true);
  });

  it('should start with an idle status', () => {
    expect(mutation.isIdle.value).toBe(true);
    expect(mutation.isSuccess.value).toBe(false);
    expect(mutation.isLoading.value).toBe(false);
    expect(mutation.isError.value).toBe(false);
  });

  it('should set error correctly when mutation fails', async () => {
    const error = new Error('Something went wrong');

    mockFn.mockRejectedValueOnce(error);

    try {
      await mutation.mutateAsync({});
    } catch (e) {
      expect(e).toBe(error);
    }

    expect(mutation.isError.value).toBe(true);
    expect(mutation.error.value).toBe(error);
  });
});
