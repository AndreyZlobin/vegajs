import { isJsonString } from '@vegajs/shared';
import type { StorageService } from '../../types';

export class QueryStringAdapter implements StorageService {
  private searchParams: URLSearchParams;

  private readonly isSSR: boolean;

  constructor() {
    this.isSSR = typeof window === 'undefined';

    this.searchParams = new URLSearchParams(
      this.isSSR ? '' : window.location.search,
    );
  }

  private updateSearchParams(params: URLSearchParams) {
    if (!this.isSSR) {
      const newUrl = `${window.location.pathname}?${params.toString()}`;

      window.history.replaceState(null, '', newUrl);
    }
  }

  public clearItem(key: string) {
    this.searchParams.delete(key);
    this.updateSearchParams(this.searchParams);
  }

  public clear() {
    this.searchParams = new URLSearchParams();
    this.updateSearchParams(this.searchParams);
  }

  public getItem<T = unknown>(key: string) {
    return Promise.resolve(this.getItemSync<T>(key));
  }

  public getItemSync<T = unknown>(key: string) {
    const value = this.searchParams.get(key);

    if (value === null) {
      return null;
    }

    try {
      if (!isJsonString(value)) {
        return value as T;
      }

      return JSON.parse(value) as T;
    } catch (e) {
      return null;
    }
  }

  public setItem<T = unknown>(key: string, value: T) {
    return Promise.resolve(this.setItemSync(key, value));
  }

  public setItemSync<T = unknown>(key: string, value: T) {
    const stringValue =
      typeof value === 'string' ? value : JSON.stringify(value);

    this.searchParams.set(key, stringValue);
    this.updateSearchParams(this.searchParams);
  }

  public has(key: string): boolean {
    return this.searchParams.has(key);
  }
}
