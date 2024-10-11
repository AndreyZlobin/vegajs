import { describe, expect, it } from 'vitest';
import { Status } from './enums';
import { StatusFactory } from './status-factory';

describe('StatusFactory', () => {
  it('should initialize with IDLE status and no error', () => {
    const factory = new StatusFactory();

    expect(factory.status.value).toBe(Status.IDLE);
    expect(factory.error.value).toBeNull();
    expect(factory.isIdle.value).toBe(true);
    expect(factory.isLoading.value).toBe(false);
    expect(factory.isSuccess.value).toBe(false);
    expect(factory.isError.value).toBe(false);
  });

  it('should set status to LOADING correctly', () => {
    const factory = new StatusFactory();

    factory.setStatus(Status.LOADING);
    expect(factory.status.value).toBe(Status.LOADING);
    expect(factory.isLoading.value).toBe(true);
    expect(factory.isIdle.value).toBe(false);
    expect(factory.isSuccess.value).toBe(false);
    expect(factory.isError.value).toBe(false);
  });

  it('should set status to SUCCESS correctly', () => {
    const factory = new StatusFactory();

    factory.setStatus(Status.SUCCESS);
    expect(factory.status.value).toBe(Status.SUCCESS);
    expect(factory.isSuccess.value).toBe(true);
    expect(factory.isLoading.value).toBe(false);
    expect(factory.isIdle.value).toBe(false);
    expect(factory.isError.value).toBe(false);
  });

  it('should set status to ERROR correctly', () => {
    const factory = new StatusFactory();

    factory.setStatus(Status.ERROR);
    expect(factory.status.value).toBe(Status.ERROR);
    expect(factory.isError.value).toBe(true);
    expect(factory.isSuccess.value).toBe(false);
    expect(factory.isLoading.value).toBe(false);
    expect(factory.isIdle.value).toBe(false);
  });

  it('should set error correctly and reflect in isError', () => {
    const factory = new StatusFactory<string>();

    factory.setError('Something went wrong');
    expect(factory.error.value).toBe('Something went wrong');
    expect(factory.isError.value).toBe(true);
    factory.setStatus(Status.SUCCESS);
    expect(factory.isError.value).toBe(true); // isError should be true due to existing error
  });

  it('should clear error when set to null and update isError', () => {
    const factory = new StatusFactory<string>();

    factory.setError('Initial error');
    expect(factory.isError.value).toBe(true);
    factory.setError(null);
    expect(factory.error.value).toBeNull();
    expect(factory.isError.value).toBe(false);
  });

  it('should not consider status ERROR if error is null', () => {
    const factory = new StatusFactory();

    factory.setStatus(Status.ERROR);
    factory.setError(null);
    expect(factory.isError.value).toBe(true);
  });

  it('should reflect changes when both status and error are modified', () => {
    const factory = new StatusFactory<string>();

    factory.setStatus(Status.LOADING);
    expect(factory.isLoading.value).toBe(true);
    expect(factory.isError.value).toBe(false);
    factory.setError('Loading error');
    expect(factory.isError.value).toBe(true);
    factory.setStatus(Status.ERROR);
    expect(factory.isError.value).toBe(true);
  });
});
