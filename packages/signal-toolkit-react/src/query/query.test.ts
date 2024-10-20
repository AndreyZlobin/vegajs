import { EventBus } from '@vegajs/event-bus';
import type { EventsData } from '@vegajs/toolkit-core';
import { describe, expect, it } from 'vitest';
import { Query } from './query';

describe('Query', () => {
  it('should initialize with idle status', () => {
    const query = new Query({
      fn: () => Promise.resolve({ foo: 'foo' }),
      eventBus: new EventBus<EventsData>(),
    });

    expect(query.isIdle.value).toBe(true);
    expect(query.isLoading.value).toBe(false);
    expect(query.isError.value).toBe(false);
    expect(query.isSuccess.value).toBe(false);
  });

  it('should update data and status when "toolkit:data" event is emitted', async () => {
    const DATA = { foo: 'bar' };
    const query = new Query({
      fn: () => Promise.resolve(DATA),
      eventBus: new EventBus<EventsData>(),
    });

    expect(query.isSuccess.value).toBe(false);
    await query.fetch({ opt: '' });
    expect(query.isSuccess.value).toBe(true);
    expect(query.data.value).toEqual(DATA);
  });

  it('should update data and status when "toolkit:data" event is emitted and error occurs', async () => {
    const query = new Query({
      fn: () => Promise.reject(new Error('Fetch failed')),
      eventBus: new EventBus<EventsData>(),
    });

    expect(query.isSuccess.value).toBe(false);

    try {
      await query.fetch({ opt: '' });
    } catch (error) {
      expect(query.isError.value).toBe(true);
      expect(query.data.value).toEqual(undefined);
    }
  });
});
