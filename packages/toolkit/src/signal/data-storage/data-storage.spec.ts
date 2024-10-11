import { describe, expect, it } from 'vitest';
import { DataStorage } from './data-storage';

describe('DataStorage', () => {
  it('should initialize with undefined data', () => {
    const storage = new DataStorage();

    expect(storage.data.value).toBeUndefined();
  });

  it('should set data correctly', () => {
    const storage = new DataStorage<number>();

    storage.set(42);
    expect(storage.data.value).toBe(42);
  });

  it('should clear data and set it to undefined', () => {
    const storage = new DataStorage<string>();

    storage.set('test');
    expect(storage.data.value).toBe('test');
    storage.clear();
    expect(storage.data.value).toBeUndefined();
  });

  it('should set data to undefined when calling set with no argument', () => {
    const storage = new DataStorage<boolean>();

    storage.set(true);
    expect(storage.data.value).toBe(true);
    storage.set();
    expect(storage.data.value).toBeUndefined();
  });

  it('should handle object data correctly', () => {
    const storage = new DataStorage<{ name: string }>();
    const obj = { name: 'SomeName' };

    storage.set(obj);
    expect(storage.data.value).toEqual(obj);
    obj.name = 'NotSomeName';
    expect(storage.data.value).toEqual({ name: 'NotSomeName' });
  });

  it('should handle undefined input in the setter method', () => {
    const storage = new DataStorage<number | undefined>();

    storage.set(100);
    expect(storage.data.value).toBe(100);
    storage.set(undefined);
    expect(storage.data.value).toBeUndefined();
  });
});
