import type { EventBus } from '@vegajs/event-bus';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Status } from '../types';
import type { EventsData } from '../types';
import { Mutation } from './mutation';

const createEventBusMock = () => {
  return {
    emit: vi.fn(),
  } as unknown as EventBus<EventsData>;
};

describe('Mutation', () => {
  let eventBus: EventBus<EventsData>;

  beforeEach(() => {
    eventBus = createEventBusMock();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should set status to "Idle" and clear error when reset() is called', () => {
    const mutation = new Mutation({
      fn: vi.fn(),
      eventBus,
    });

    mutation.reset();
    expect(eventBus.emit).toHaveBeenCalledWith('toolkit:status', Status.IDLE);
    expect(eventBus.emit).toHaveBeenCalledWith('toolkit:error', null);
  });

  it('should call onSuccess after a successful mutation', async () => {
    const SUCCESS_DATA = 'success data';
    const OPTIONS = 'options';

    const fnMock = vi.fn().mockResolvedValue(SUCCESS_DATA);
    const onSuccessMock = vi.fn();

    const mutation = new Mutation({
      fn: fnMock,
      onSuccess: onSuccessMock,
      eventBus,
    });

    const result = await mutation.mutate(OPTIONS);

    expect(result).toBe(SUCCESS_DATA);
    expect(onSuccessMock).toHaveBeenCalledWith(SUCCESS_DATA, OPTIONS);
  });

  it('should call onError and emit error on a failed mutation', async () => {
    const ERROR = new Error('mutation failed');
    const OPTIONS = 'options';

    const fnMock = vi.fn().mockRejectedValue(ERROR);
    const onErrorMock = vi.fn();

    const mutation = new Mutation({
      fn: fnMock,
      onError: onErrorMock,
      eventBus,
    });

    await expect(mutation.mutate(OPTIONS)).rejects.toThrow('mutation failed');
    expect(onErrorMock).toHaveBeenCalledWith(ERROR, OPTIONS);
    expect(eventBus.emit).toHaveBeenCalledWith('toolkit:error', ERROR);
  });

  it('should set status to "Loading" before starting the mutation', async () => {
    const SUCCESS_DATA = 'success data';
    const OPTIONS = 'options';

    const fnMock = vi.fn().mockResolvedValue(SUCCESS_DATA);

    const mutation = new Mutation({
      fn: fnMock,
      eventBus,
    });

    const mutatePromise = mutation.mutate(OPTIONS);

    expect(eventBus.emit).toHaveBeenCalledWith(
      'toolkit:status',
      Status.LOADING,
    );

    await mutatePromise;
  });

  it('should not call onSuccess if not provided', async () => {
    const SUCCESS_DATA = 'success data';
    const OPTIONS = 'options';

    const fnMock = vi.fn().mockResolvedValue(SUCCESS_DATA);

    const mutation = new Mutation({
      fn: fnMock,
      eventBus,
    });

    const result = await mutation.mutate(OPTIONS);

    expect(result).toBe(SUCCESS_DATA);

    expect(eventBus.emit).toHaveBeenCalledWith(
      'toolkit:status',
      Status.LOADING,
    );
  });

  it('should not call onError if not provided on failure', async () => {
    const ERROR = new Error('mutation failed');
    const OPTIONS = 'options';

    const fnMock = vi.fn().mockRejectedValue(ERROR);

    const mutation = new Mutation({
      fn: fnMock,
      eventBus,
    });

    await expect(mutation.mutate(OPTIONS)).rejects.toThrow('mutation failed');
    expect(eventBus.emit).toHaveBeenCalledWith('toolkit:error', ERROR);
  });

  it('should handle synchronous mutateSync call and run mutation', () => {
    const SUCCESS_DATA = 'sync success';
    const OPTIONS = 'sync options';

    const fnMock = vi.fn().mockResolvedValue(SUCCESS_DATA);
    const onSuccessMock = vi.fn();

    const mutation = new Mutation({
      fn: fnMock,
      onSuccess: onSuccessMock,
      eventBus,
    });

    mutation.mutateSync(OPTIONS);
    expect(fnMock).toHaveBeenCalledWith(OPTIONS);
  });

  it('should ensure events are emitted in the right order during success', async () => {
    const SUCCESS_DATA = 'success data';
    const OPTIONS = 'options';

    const fnMock = vi.fn().mockResolvedValue(SUCCESS_DATA);

    const mutation = new Mutation({
      fn: fnMock,
      eventBus,
    });

    await mutation.mutate(OPTIONS);
    expect(eventBus.emit).toHaveBeenCalledWith('toolkit:error', null);

    expect(eventBus.emit).toHaveBeenCalledWith(
      'toolkit:status',
      Status.LOADING,
    );

    expect(eventBus.emit).toHaveBeenCalledWith(
      'toolkit:status',
      Status.SUCCESS,
    );
  });

  it('should ensure events are emitted in the right order during failure', async () => {
    const ERROR = new Error('mutation failed');
    const OPTIONS = 'options';

    const fnMock = vi.fn().mockRejectedValue(ERROR);

    const mutation = new Mutation({
      fn: fnMock,
      eventBus,
    });

    await expect(mutation.mutate(OPTIONS)).rejects.toThrow('mutation failed');
    expect(eventBus.emit).toHaveBeenCalledWith('toolkit:error', null); // clearing any prior error

    expect(eventBus.emit).toHaveBeenCalledWith(
      'toolkit:status',
      Status.LOADING,
    );

    expect(eventBus.emit).toHaveBeenCalledWith('toolkit:error', ERROR);
    expect(eventBus.emit).toHaveBeenCalledWith('toolkit:status', Status.ERROR);
  });
});
