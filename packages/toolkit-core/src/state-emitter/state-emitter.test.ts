import type { EventBus } from '@vegajs/event-bus';
import { describe, expect, it, vi } from 'vitest';
import { type EventsData, Status } from '../types';
import { StateEmitter } from './state-emitter';

const createMockEventBus = <TData = unknown, TError = unknown>() => {
  return {
    emit: vi.fn(),
  } as unknown as EventBus<EventsData<TData, TError>>;
};

describe('StateEmitter', () => {
  it('should emit the correct data event', () => {
    const mockEventBus = createMockEventBus();
    const emitter = new StateEmitter(mockEventBus);
    const testData = { key: 'value' };

    emitter.setData(testData);
    expect(mockEventBus.emit).toHaveBeenCalledWith('toolkit:data', testData);
  });

  it('should emit undefined when no data is provided', () => {
    const mockEventBus = createMockEventBus();
    const emitter = new StateEmitter(mockEventBus);

    emitter.setData();
    expect(mockEventBus.emit).toHaveBeenCalledWith('toolkit:data', undefined);
  });

  it('should emit the correct error event', () => {
    const mockEventBus = createMockEventBus();
    const emitter = new StateEmitter(mockEventBus);
    const testError = new Error('Test error');

    emitter.setError(testError);
    expect(mockEventBus.emit).toHaveBeenCalledWith('toolkit:error', testError);
  });

  it('should emit null when no error is provided', () => {
    const mockEventBus = createMockEventBus();
    const emitter = new StateEmitter(mockEventBus);

    emitter.setError(null);
    expect(mockEventBus.emit).toHaveBeenCalledWith('toolkit:error', null);
  });

  it('should emit the correct status event', () => {
    const mockEventBus = createMockEventBus();
    const emitter = new StateEmitter(mockEventBus);

    emitter.setStatus(Status.LOADING);

    expect(mockEventBus.emit).toHaveBeenCalledWith(
      'toolkit:status',
      Status.LOADING,
    );
  });

  it('should handle all statuses correctly', () => {
    const mockEventBus = createMockEventBus();
    const emitter = new StateEmitter(mockEventBus);

    const statuses = [
      Status.IDLE,
      Status.LOADING,
      Status.ERROR,
      Status.SUCCESS,
    ];

    statuses.forEach((status) => {
      emitter.setStatus(status);
      expect(mockEventBus.emit).toHaveBeenCalledWith('toolkit:status', status);
    });
  });
});
