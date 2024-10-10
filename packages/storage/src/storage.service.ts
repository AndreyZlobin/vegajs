import type { StorageService as IStorageService } from './types';

export class StorageService implements IStorageService {
  #adapter: IStorageService;

  constructor(adapter: IStorageService) {
    this.#adapter = adapter;
  }

  getItem<Value = unknown>(key: string): Promise<Value | null> {
    return this.#adapter.getItem(key);
  }

  getItemSync<Value = unknown>(key: string): Value | null {
    return this.#adapter.getItemSync(key);
  }

  setItem<Value = unknown>(key: string, value: Value): Promise<void> {
    return this.#adapter.setItem(key, value);
  }

  setItemSync<Value = unknown>(key: string, value: Value): void {
    return this.#adapter.setItemSync(key, value);
  }

  clearItem(key: string): void {
    return this.#adapter.clearItem(key);
  }

  clear() {
    this.#adapter.clear();
  }

  public has(key: string) {
    return this.#adapter.has(key);
  }
}
