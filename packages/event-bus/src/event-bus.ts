import type { EventBus as IEventBus } from './types';

export class EventBus<EventMap> implements IEventBus<EventMap> {
  private listeners: {
    [K in keyof EventMap]?: Array<(event: EventMap[K]) => void>;
  } = {};

  public on<K extends keyof EventMap>(
    eventName: K,
    handler: (event: EventMap[K]) => void,
  ) {
    this.listeners[eventName] ||= [];
    this.listeners[eventName]!.push(handler);
  }

  public off<K extends keyof EventMap>(
    eventName: K,
    handler: (event: EventMap[K]) => void,
  ) {
    if (!this.listeners[eventName]) {
      return;
    }

    this.listeners[eventName] = this.listeners[eventName]!.filter(
      (h) => h !== handler,
    );
  }

  emit<K extends keyof EventMap>(eventName: K, event: EventMap[K]) {
    if (!this.listeners[eventName]) {
      return;
    }

    this.listeners[eventName]!.forEach((handler) => handler(event));
  }

  public offAll() {
    this.listeners = {};
  }
}
