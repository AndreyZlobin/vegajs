export interface StorageService {
  getItem<Value>(key: string): Promise<Value | null>;
  getItemSync<Value>(key: string): Value | null;
  setItem<Value>(key: string, value: Value): Promise<void>;
  setItemSync<Value>(key: string, value: Value): void;
  has(key: string): boolean;
  clearItem(key: string): void;
  clear(): void;
}
