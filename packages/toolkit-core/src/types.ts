import type { EventBus } from '@vegajs/event-bus';

export enum Status {
  IDLE = 'Idle',
  LOADING = 'Loading',
  ERROR = 'Error',
  SUCCESS = 'Success',
}

export type EventsData<TData = unknown, TError = unknown> = {
  'toolkit:data': TData | undefined;
  'toolkit:error': TError | null;
  'toolkit:status': Status;
};

export type QueryOptions<
  TData = unknown,
  TError = unknown,
  TOptions = unknown,
> = {
  fn: (options: TOptions) => Promise<TData>;
  onSuccess?: (data: TData, options: TOptions) => void;
  onError?: (error: TError, options: TOptions) => void;
  initialData?: TData extends object ? Partial<TData> : TData;
};

type WithEventBus<TData = unknown, TError = unknown> = {
  eventBus: EventBus<EventsData<TData, TError>>;
};

export type PrivateQueryOptions<
  TData = unknown,
  TError = unknown,
  TOptions = unknown,
> = QueryOptions<TData, TError, TOptions> & WithEventBus<TData, TError>;

export type MutationOptions<
  TData = unknown,
  TError = unknown,
  TOptions = unknown,
> = {
  fn: (options: TOptions) => Promise<TData>;
  onSuccess?: (data: TData, options: TOptions) => void;
  onError?: (error: TError, options: TOptions) => void;
};

export type PrivateMutationOptions<
  TData = unknown,
  TError = unknown,
  TOptions = unknown,
> = MutationOptions<TData, TError, TOptions> & WithEventBus<TData, TError>;

export type State<TData = unknown, TError = unknown> = {
  data: TData | undefined;
  status: Status;
  error: TError | null;
};
