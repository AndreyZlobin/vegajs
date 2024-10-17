# @vegajs/storage

[![npm version](https://badge.fury.io/js/%40vegajs%2Fstorage.svg)](https://badge.fury.io/js/%40vegajs%2Fstorage)

## Overview

`@vegajs/storage` is a flexible, type-safe storage service interface that allows you to easily implement different storage mechanisms such as `localStorage`, `query-string`, and mock storage solutions. The service leverages the adapter pattern, making it easy to swap or implement custom storage adapters while maintaining a consistent API.

### Key Features

- **Adapter Pattern**: Decouple the storage logic from your app by providing interchangeable storage adapters.
- **Type safety**: Provides strong typing with generics for different value types, ensuring type safety.
- **Multiple Adapters**: Supports out-of-the-box adapters for `localStorage`, `query-string`, and a mock service for testing.
- **Synchronous and Asynchronous Support**: Choose between synchronous and asynchronous methods depending on your needs.

## Installation

Install the package via npm:

```bash
npm install @vegajs/storage
```

## Quick Start

### Using the LocalStorage Adapter

The package provides an adapter for `localStorage`, making it easy to persist data in the browser.

```ts
import { StorageService, LocalStorageAdapter } from '@vegajs/storage';

const storageService = new StorageService(new LocalStorageAdapter());

// Set an item asynchronously
await storageService.setItem('key', 'value');

// Retrieve the item
const value = await storageService.getItem('key');
console.log(value); // Output: 'value'

// Check if the item exists
const hasKey = storageService.has('key');
console.log(hasKey); // Output: true

// Remove the item
storageService.clearItem('key');
```

### Synchronous Usage Example

For applications that require synchronous access to storage, the storage service also supports synchronous methods.

```ts
// Set an item synchronously
storageService.setItemSync('syncKey', 'syncValue');

// Get an item synchronously
const syncValue = storageService.getItemSync('syncKey');
console.log(syncValue); // Output: 'syncValue'

// Check if the key exists
console.log(storageService.has('syncKey')); // Output: true

// Clear the item
storageService.clearItem('syncKey');
```

### Using the Query String Adapter

You can also store and retrieve data via the URL query string. This can be useful for persisting state or filters.

```ts
import { StorageService } from '@vegajs/storage-service-adapter';
import { QueryStringAdapter } from '@vegajs/storage/adapters';

const queryStringStorage = new StorageService(new QueryStringAdapter());

// Set a value in the query string
await queryStringStorage.setItem('filter', { type: 'category', id: 123 });

// Get a value from the query string
const filter = await queryStringStorage.getItem('filter');
console.log(filter); // Output: { type: 'category', id: 123 }

// Check if the query string contains a key
console.log(queryStringStorage.has('filter')); // Output: true

// Clear all query string parameters
queryStringStorage.clear();
```

### Mock Storage Service (For Testing)

Use the mock adapter for unit tests or when you need an in-memory storage implementation.

```ts
import { StorageService, MockStorageService } from '@vegajs/storage';

const mockStorage = new StorageService(new MockStorageService());

await mockStorage.setItem('key', 'mock value');

const value = await mockStorage.getItem('key');
console.log(value); // Output: 'mock value'

mockStorage.clearItem('key');
```

### Extending with Custom Adapters

You can easily create your own adapter by implementing the `StorageService` interface. This allows you to plug in any storage mechanism that meets your needs.

```ts
import { StorageService } from '@vegajs/storage';

class CustomStorageAdapter implements StorageService {
  private data = new Map<string, unknown>();

  async getItem<Value>(key: string): Promise<Value | null> {
    return this.data.get(key) || null;
  }

  getItemSync<Value>(key: string): Value | null {
    return this.data.get(key) || null;
  }

  async setItem<Value>(key: string, value: Value): Promise<void> {
    this.data.set(key, value);
  }

  setItemSync<Value>(key: string, value: Value): void {
    this.data.set(key, value);
  }

  has(key: string): boolean {
    return this.data.has(key);
  }

  clearItem(key: string): void {
    this.data.delete(key);
  }

  clear(): void {
    this.data.clear();
  }
}

// Usage
const customStorage = new StorageService(new CustomStorageAdapter());
await customStorage.setItem('customKey', 'customValue');
console.log(await customStorage.getItem('customKey')); // Output: 'customValue'
```

## Advanced Usage

### Working with JSON Values

All adapters handle JSON values seamlessly. You can store and retrieve complex objects without having to manually serialize or deserialize them.

```ts
await storageService.setItem('user', { id: 1, name: 'Alice' });

const user = await storageService.getItem<{ id: number; name: string }>('user');
console.log(user?.name); // Output: 'Alice'
```

### Error Handling

When using storage adapters like `localStorage` that might not be available in all environments, you can wrap your code in try-catch blocks to handle errors gracefully.

```ts
try {
  await storageService.setItem('session', { token: '12345' });
} catch (error) {
  console.error('Failed to store session data:', error);
}
```

## API Reference

### `StorageService` Interface

The `StorageService` interface defines the core methods that any storage adapter must implement.

```ts
export interface StorageService {
  getItem<Value>(key: string): Promise<Value | null>;
  getItemSync<Value>(key: string): Value | null;
  setItem<Value>(key: string, value: Value): Promise<void>;
  setItemSync<Value>(key: string, value: Value): void;
  has(key: string): boolean;
  clearItem(key: string): void;
  clear(): void;
}
```

### `LocalStorageAdapter`

The `LocalStorageAdapter` is a concrete implementation of the `StorageService` interface using the browser's `localStorage`.

```ts
export class LocalStorageAdapter implements StorageService {
  constructor();
  public getItem<Value = unknown>(key: string): Promise<Value | null>;
  public getItemSync<Value = unknown>(key: string): Value | null;
  public setItem<Value = unknown>(key: string, value: Value): Promise<void>;
  public setItemSync<Value = unknown>(key: string, value: Value): void;
  public has(key: string): boolean;
  public clearItem(key: string): void;
  public clear(): void;
}
```

### `QueryStringAdapter`

The `QueryStringAdapter` manages key-value pairs in the URL query string.

```ts
export class QueryStringAdapter implements StorageService {
  constructor();
  public getItem<Value = unknown>(key: string): Promise<Value | null>;
  public getItemSync<Value = unknown>(key: string): Value | null;
  public setItem<Value = unknown>(key: string, value: Value): Promise<void>;
  public setItemSync<Value = unknown>(key: string, value: Value): void;
  public has(key: string): boolean;
  public clearItem(key: string): void;
  public clear(): void;
}
```

### `MockStorageAdapter`

The `MockStorageService` is an in-memory mock implementation of the `StorageService` interface. It is useful for testing purposes.

```ts
export class MockStorageService implements StorageService {
  constructor();
  public getItem<Value = unknown>(key: string): Promise<Value | null>;
  public getItemSync<Value = unknown>(key: string): Value | null;
  public setItem<Value = unknown>(key: string, value: Value): Promise<void>;
  public setItemSync<Value = unknown>(key: string, value: Value): void;
  public has(key: string): boolean;
  public clearItem(key: string): void;
  public clear(): void;
}
```

## Conclusion

`@vegajs/storage` is a powerful and flexible library that simplifies working with storage in your applications. The library provides strong typing and offers multiple ready-to-use storage adapters. Whether you need to work with `localStorage`, query strings, or mock storage for testing, this library has you covered.
