export type EventBus<EventMap> = {
  on<K extends keyof EventMap>(
    eventName: K,
    handler: (event: EventMap[K]) => void,
  ): void;
  off<K extends keyof EventMap>(
    eventName: K,
    handler: (event: EventMap[K]) => void,
  ): void;
  emit<K extends keyof EventMap>(eventName: K, event: EventMap[K]): void;
};
