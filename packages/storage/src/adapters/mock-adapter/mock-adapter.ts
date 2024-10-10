import type { StorageService } from '../../types';

export class MockStorageService implements StorageService {
  private storage: Map<string, unknown> = new Map();

  async getItem<Value = unknown>(key: string) {
    return this.storage.get(key) as Value | null;
  }

  public getItemSync<Value = unknown>(key: string) {
    return (this.storage.get(key) || null) as Value | null;
  }

  public async setItem<Value = unknown>(key: string, value: Value) {
    this.storage.set(key, value);
  }

  public setItemSync<Value = unknown>(key: string, value: Value) {
    this.storage.set(key, value);
  }

  public clearItem(key: string) {
    this.storage.delete(key);
  }

  public clear() {
    this.storage.clear();
  }

  public has(key: string) {
    return this.storage.has(key);
  }
}
