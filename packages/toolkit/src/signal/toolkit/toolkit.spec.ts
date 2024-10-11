import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Mutation } from '../mutation';
import { Query } from '../query';
import type { MutationOptions, QueryOptions } from '../types';
import type { SignalToolkit } from './toolkit';
import { createSignalToolkit } from './toolkit';
type QueryWithKey = QueryOptions<number, string, {}> & { key: string };

describe('Toolkit', () => {
  let toolkit: SignalToolkit;

  beforeEach(() => {
    toolkit = createSignalToolkit();
  });

  it('should create a new query', () => {
    const mockFn = vi.fn().mockResolvedValueOnce(42);
    const options: QueryWithKey = {
      fn: mockFn,
      onSuccess: vi.fn(),
      onError: vi.fn(),
      key: 'testQuery',
    };

    const query = toolkit.createQuery(options);

    expect(query).toBeInstanceOf(Query);
    // @ts-ignore
    expect(toolkit.queries.has('testQuery')).toBe(true);
  });

  it('should return the cached query when the same key is used', () => {
    const mockFn = vi.fn().mockResolvedValueOnce(42);
    const options: QueryWithKey = {
      fn: mockFn,
      onSuccess: vi.fn(),
      onError: vi.fn(),
      key: 'testQuery',
    };

    const firstQuery = toolkit.createQuery(options);
    const secondQuery = toolkit.createQuery(options);

    expect(firstQuery).toBe(secondQuery);
  });

  it('should create a new mutation', () => {
    const mockFn = vi.fn().mockResolvedValueOnce(42);
    const options: MutationOptions<number, string, {}> = {
      fn: mockFn,
      onSuccess: vi.fn(),
      onError: vi.fn(),
    };

    const mutation = toolkit.createMutation(options);

    expect(mutation).toBeInstanceOf(Mutation);
  });

  it('should call with valid args', async () => {
    const mockFn = vi.fn().mockResolvedValueOnce(42);
    const options: MutationOptions<number, string, {}> = {
      fn: mockFn,
      onSuccess: vi.fn(),
      onError: vi.fn(),
    };

    const mutation = toolkit.createMutation(options);

    mutation.mutate({});
    expect(mockFn).toBeCalledWith({});

    const res = await mutation.mutateAsync({});

    expect(res).toBe(42);
  });

  it('should invalidate a query by key and call refetch', () => {
    const mockRefetch = vi.fn();
    const mockQuery = {
      refetch: mockRefetch,
    } as unknown as Query<unknown, unknown, unknown>;

    // @ts-ignore
    toolkit.queries.set('testQuery', mockQuery);
    toolkit.invalidate('testQuery');
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('should not throw error when invalidating a non-existent query', () => {
    expect(() => toolkit.invalidate('nonExistentQuery')).not.toThrow();
  });

  it('should invalidate all queries', () => {
    const mockRefetch1 = vi.fn();
    const mockRefetch2 = vi.fn();

    const mockQuery1 = {
      refetch: mockRefetch1,
    } as unknown as Query<unknown, unknown, unknown>;

    const mockQuery2 = {
      refetch: mockRefetch2,
    } as unknown as Query<unknown, unknown, unknown>;

    // @ts-ignore
    toolkit.queries.set('query1', mockQuery1);
    // @ts-ignore
    toolkit.queries.set('query2', mockQuery2);
    toolkit.invalidateQueries();
    expect(mockRefetch1).toHaveBeenCalled();
    expect(mockRefetch2).toHaveBeenCalled();
  });
});
