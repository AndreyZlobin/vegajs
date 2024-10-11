import type { StorageService as IStorageService } from './types';

export class StorageService implements IStorageService {
  #adapter: IStorageService;

  constructor(adapter: IStorageService) {
    this.#adapter = adapter;
  }

  getItem<Value = unknown>(key: string) {
    return this.#adapter.getItem<Value>(key);
  }

  getItemSync<Value = unknown>(key: string) {
    return this.#adapter.getItemSync<Value>(key);
  }

  setItem<Value = unknown>(key: string, value: Value) {
    return this.#adapter.setItem(key, value);
  }

  setItemSync<Value = unknown>(key: string, value: Value) {
    return this.#adapter.setItemSync(key, value);
  }

  clearItem(key: string) {
    return this.#adapter.clearItem(key);
  }

  clear() {
    this.#adapter.clear();
  }

  public has(key: string) {
    return this.#adapter.has(key);
  }
}
