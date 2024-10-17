import type { EventBus } from '@vegajs/event-bus';
import type { EventsData, Status } from '../types';

export class StateEmitter<TData = unknown, TError = unknown> {
  constructor(private readonly eventBus: EventBus<EventsData<TData, TError>>) {}

  public setData(data?: TData) {
    this.eventBus.emit('toolkit:data', data);
  }

  public setError(error: TError | null) {
    this.eventBus.emit('toolkit:error', error);
  }

  public setStatus(status: Status) {
    this.eventBus.emit('toolkit:status', status);
  }
}
