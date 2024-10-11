import { createSignalToolkit } from './toolkit';

export type { Query } from './query';

export type { Mutation } from './mutation';

export type { SignalToolkit } from './toolkit';

export {
  type MutationOptions as SignalMutationOptions,
  type QueryOptions as SignalQueryOptions,
} from './types';

export const signalToolkit = createSignalToolkit();
