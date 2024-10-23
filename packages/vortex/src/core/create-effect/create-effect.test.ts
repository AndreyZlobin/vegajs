import { describe, expect, it, vi } from 'vitest';
import { ReactiveContext } from '../../utils';
import { createEffect } from './create-effect';

describe('createEffect', () => {
  it('should call the provided function immediately', () => {
    const context = new ReactiveContext();
    const fn = vi.fn();

    createEffect(fn, context);
    expect(fn).toHaveBeenCalled();
  });

  it('should track the function with the context', () => {
    const context = new ReactiveContext();
    const trackSpy = vi.spyOn(context, 'track');
    const fn = vi.fn();

    createEffect(fn, context);
    expect(trackSpy).toHaveBeenCalledWith(fn);
  });

  it('should call update immediately after creation', () => {
    const context = new ReactiveContext();
    const fn = vi.fn();

    const trackSpy = vi.spyOn(context, 'track');

    createEffect(fn, context);
    expect(trackSpy).toHaveBeenCalled();
    expect(fn).toHaveBeenCalled();
  });
});
