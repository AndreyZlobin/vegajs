import type { EventBus } from '@vegajs/event-bus';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Status } from '../types';
import type { EventsData } from '../types';
import { Query } from './query';

const createEventBusMock = <TData = unknown, TError = unknown>() => {
  return {
    emit: vi.fn(),
  } as unknown as EventBus<EventsData<TData, TError>>;
};

describe('Query', () => {
  let eventBus: EventBus<EventsData<{ foo: string }, Error>>;
  let fnMock: ReturnType<typeof vi.fn>;
  let onSuccessMock: (data: { foo: string }, options: { opt: string }) => void;
  let onErrorMock: (error: Error, options: { opt: string }) => void;
  let query: Query<{ foo: string }, Error, { opt: string }>;

  beforeEach(() => {
    eventBus = createEventBusMock<{ foo: string }, Error>();
    fnMock = vi.fn();
    onSuccessMock = vi.fn();
    onErrorMock = vi.fn();

    query = new Query({
      fn: fnMock,
      onSuccess: onSuccessMock,
      onError: onErrorMock,
      eventBus,
      initialData: undefined,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should initialize with initial data if provided', () => {
    const INITIAL_DATA = { foo: 'bar' };

    new Query({
      fn: fnMock,
      onSuccess: onSuccessMock,
      onError: onErrorMock,
      eventBus,
      initialData: INITIAL_DATA,
    });

    expect(eventBus.emit).toHaveBeenCalledWith('toolkit:data', INITIAL_DATA);
  });

  it('should reset the query state when reset() is called', () => {
    query.reset();
    expect(eventBus.emit).toHaveBeenCalledWith('toolkit:data', undefined);
    expect(eventBus.emit).toHaveBeenCalledWith('toolkit:status', Status.IDLE);
    expect(eventBus.emit).toHaveBeenCalledWith('toolkit:error', null);
  });

  it('should update data and set status to success when update() is called', () => {
    const DATA = { foo: 'bar' };

    query.update(DATA);
    expect(eventBus.emit).toHaveBeenCalledWith('toolkit:data', DATA);

    expect(eventBus.emit).toHaveBeenCalledWith(
      'toolkit:status',
      Status.SUCCESS,
    );

    expect(eventBus.emit).toHaveBeenCalledWith('toolkit:error', null);
  });

  it('should fetch data successfully and trigger onSuccess callback', async () => {
    const DATA = { foo: 'bar' };
    const OPTIONS = { opt: 'test' };

    fnMock.mockResolvedValue(DATA);

    const result = await query.fetch(OPTIONS);

    expect(result).toBe(DATA);
    expect(eventBus.emit).toHaveBeenCalledWith('toolkit:data', DATA);
    expect(onSuccessMock).toHaveBeenCalledWith(DATA, OPTIONS);
  });

  it('should handle fetch failure and trigger onError callback', async () => {
    const ERROR = new Error('fetch failed');
    const OPTIONS = { opt: 'test' };

    fnMock.mockRejectedValue(ERROR);
    await expect(query.fetch(OPTIONS)).rejects.toThrow(ERROR);
    expect(onErrorMock).toHaveBeenCalledWith(ERROR, OPTIONS);
  });

  it('should start polling at the given interval and fetch data', async () => {
    const DATA = { foo: 'bar' };
    const OPTIONS = { opt: 'test' };
    const INTERVAL = 100;

    fnMock.mockResolvedValue(DATA);
    vi.useFakeTimers();
    await query.startPolling(INTERVAL, OPTIONS, true);
    expect(fnMock).toHaveBeenCalledWith(OPTIONS);
    expect(eventBus.emit).toHaveBeenCalledWith('toolkit:data', DATA);
    vi.advanceTimersByTime(INTERVAL);
    expect(fnMock).toHaveBeenCalledTimes(2);
  });

  it('should stop polling when stopPolling() is called', async () => {
    const OPTIONS = { opt: 'test' };
    const INTERVAL = 100;

    vi.useFakeTimers();
    await query.startPolling(INTERVAL, OPTIONS);
    query.stopPolling();
    vi.advanceTimersByTime(INTERVAL);
    expect(fnMock).toHaveBeenCalledTimes(0);
  });

  it('should throw an error if polling interval is less than 0', async () => {
    const OPTIONS = { opt: 'test' };
    const INTERVAL = -1;

    await expect(query.startPolling(INTERVAL, OPTIONS)).rejects.toThrow(
      'Interval must be greater than 0',
    );
  });

  it('should refetch data when refetch() is called', async () => {
    const DATA = { foo: 'bar' };
    const OPTIONS = { opt: 'test' };

    fnMock.mockResolvedValue({ foo: 'bar' });
    query.fetchSync(OPTIONS);
    expect(fnMock).toHaveBeenCalledWith(OPTIONS);
    fnMock.mockResolvedValue(DATA);
    query.refetch();
    expect(fnMock).toHaveBeenCalledWith(OPTIONS);
  });

  it('should fetch synchronously when fetchSync() is called', () => {
    const OPTIONS = { opt: 'test' };

    fnMock.mockResolvedValue({ foo: 'bar' });
    query.fetchSync(OPTIONS);
    expect(fnMock).toHaveBeenCalledWith(OPTIONS);
  });
});
