import type { ReactiveContext } from '../utils';

export const createEffect = (fn: () => void, context: ReactiveContext) => {
  const update = () => {
    context.track(fn);
  };

  update();
};
