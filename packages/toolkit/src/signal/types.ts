export interface QueryOptions<
  TData = unknown,
  TError = unknown,
  TOptions = unknown,
> {
  fn: (options: TOptions) => Promise<TData>;
  onSuccess?: (data: TData, options: TOptions) => void;
  onError?: (error: TError, options: TOptions) => void;
  initialData?: TData extends object ? Partial<TData> : TData;
}

export interface MutationOptions<
  TData = unknown,
  TError = unknown,
  TOptions = unknown,
> {
  fn: (options: TOptions) => Promise<TData>;
  onSuccess?: (data: TData, options: TOptions) => void;
  onError?: (error: TError, options: TOptions) => void;
}
