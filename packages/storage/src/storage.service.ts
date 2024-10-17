import type { StorageService as IStorageService } from './types';

export class StorageService implements IStorageService {
  #adapter: IStorageService;

  constructor(adapter: IStorageService) {
    this.#adapter = adapter;
  }

  public getItem<Value = unknown>(key: string) {
    return this.#adapter.getItem<Value>(key);
  }

  public getItemSync<Value = unknown>(key: string) {
    return this.#adapter.getItemSync<Value>(key);
  }

  public setItem<Value = unknown>(key: string, value: Value) {
    return this.#adapter.setItem(key, value);
  }

  public setItemSync<Value = unknown>(key: string, value: Value) {
    return this.#adapter.setItemSync(key, value);
  }

  public clearItem(key: string) {
    return this.#adapter.clearItem(key);
  }

  public clear() {
    this.#adapter.clear();
  }

  public has(key: string) {
    return this.#adapter.has(key);
  }
}
