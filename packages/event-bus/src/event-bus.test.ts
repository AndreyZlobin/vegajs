import { describe, expect, it, vi } from 'vitest';
import { EventBus } from './event-bus';

type TestEvents = {
  'test:event': { message: string };
  'another:event': { count: number };
};

describe('EventBus', () => {
  let eventBus: EventBus<TestEvents>;

  beforeEach(() => {
    eventBus = new EventBus<TestEvents>();
  });

  it('should allow subscribing to an event', () => {
    const handler = vi.fn();

    eventBus.on('test:event', handler);
    eventBus.emit('test:event', { message: 'Hello' });
    expect(handler).toHaveBeenCalled();
    expect(handler).toHaveBeenCalledWith({ message: 'Hello' });
  });

  it('should handle multiple handlers for the same event', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    eventBus.on('test:event', handler1);
    eventBus.on('test:event', handler2);
    eventBus.emit('test:event', { message: 'Test message' });
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  it('should allow unsubscribing from an event', () => {
    const handler = vi.fn();

    eventBus.on('test:event', handler);
    eventBus.off('test:event', handler);
    eventBus.emit('test:event', { message: 'Test message' });
    expect(handler).not.toHaveBeenCalled();
  });

  it('should not call handler after it has been unsubscribed', () => {
    const handler = vi.fn();

    eventBus.on('test:event', handler);
    eventBus.emit('test:event', { message: 'Before unsubscription' });
    eventBus.off('test:event', handler);
    eventBus.emit('test:event', { message: 'After unsubscription' });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should not throw an error when emitting an event without listeners', () => {
    expect(() => {
      eventBus.emit('test:event', { message: 'No listeners' });
    }).not.toThrow();
  });

  it('should work with multiple event types', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    eventBus.on('test:event', handler1);
    eventBus.on('another:event', handler2);
    eventBus.emit('test:event', { message: 'Event 1' });
    eventBus.emit('another:event', { count: 42 });
    expect(handler1).toHaveBeenCalledWith({ message: 'Event 1' });
    expect(handler2).toHaveBeenCalledWith({ count: 42 });
  });

  it('should not remove other handlers when unsubscribing a specific handler', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    eventBus.on('test:event', handler1);
    eventBus.on('test:event', handler2);
    eventBus.off('test:event', handler1);
    eventBus.emit('test:event', { message: 'Remaining handler' });
    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalled();
  });

  it('should handle case when unsubscribing a handler that was not added', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    eventBus.on('test:event', handler1);
    eventBus.off('test:event', handler2);
    eventBus.emit('test:event', { message: 'Only handler1 should be called' });
    expect(handler1).toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();
  });

  it('should handle async listeners correctly', async () => {
    const asyncHandler = vi.fn(async (event) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(event.message).toBe('Async event');
          resolve();
        }, 100);
      });
    });

    eventBus.on('test:event', asyncHandler);
    eventBus.emit('test:event', { message: 'Async event' });
    expect(asyncHandler).toHaveBeenCalled();
  });

  it('should not fail if an event is emitted with undefined for void events', () => {
    type VoidEventMap = {
      'void:event': void;
    };

    const voidEventBus = new EventBus<VoidEventMap>();
    const handler = vi.fn();

    voidEventBus.on('void:event', handler);
    voidEventBus.emit('void:event', undefined);
    expect(handler).toHaveBeenCalled();
  });

  it('should correct turn off all subscriptions', () => {
    type VoidEventMap = {
      'void:event': void;
      'test:event': void;
      'test2:event': void;
    };

    const voidEventBus = new EventBus<VoidEventMap>();
    const handler = vi.fn();

    voidEventBus.on('void:event', handler);
    voidEventBus.on('test:event', handler);
    voidEventBus.on('test2:event', handler);
    voidEventBus.offAll();
    voidEventBus.emit('void:event', undefined);
    voidEventBus.emit('test:event', undefined);
    voidEventBus.emit('test2:event', undefined);
    expect(handler).not.toHaveBeenCalled();
  });
});
