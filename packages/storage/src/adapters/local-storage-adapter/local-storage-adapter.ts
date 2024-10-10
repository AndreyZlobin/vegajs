import { isJsonString } from '@vegajs/shared';
import type { StorageService } from '../../types';

const notSupportedError = new Error('localStorage is not supported');

export class LocalStorageAdapter implements StorageService {
  private readonly storage?: Storage;

  constructor() {
    this.storage =
      typeof window !== 'undefined' ? window?.localStorage : undefined;
  }

  private assertStorageAvailable(): void {
    if (!this.storage) {
      throw notSupportedError;
    }
  }

  public clearItem(key: string) {
    this.assertStorageAvailable();
    this.storage!.removeItem(key);
  }

  public clear() {
    this.assertStorageAvailable();
    this.storage!.clear();
  }

  public getItem<T = unknown>(key: string): Promise<T | null> {
    return new Promise((resolve) => resolve(this.getItemSync(key)));
  }

  public getItemSync<T = unknown>(key: string): T | null {
    this.assertStorageAvailable();

    const stringItem = this.storage!.getItem(key);

    if (!stringItem) {
      return null;
    }

    try {
      if (!isJsonString(stringItem)) {
        return stringItem as T;
      }

      return JSON.parse(stringItem) as T;
    } catch (e) {
      return null;
    }
  }

  public setItem<T = unknown>(key: string, value: T): Promise<void> {
    return new Promise((resolve) => resolve(this.setItemSync(key, value)));
  }

  public setItemSync<T = unknown>(key: string, value: T): void {
    this.assertStorageAvailable();

    let val: string | T = value;

    if (typeof value !== 'string') {
      val = JSON.stringify(val);
    }

    this.storage!.setItem(key, val as string);
  }

  public has(key: string): boolean {
    this.assertStorageAvailable();

    return Boolean(this.storage!.getItem(key));
  }
}
