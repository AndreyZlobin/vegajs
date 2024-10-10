
# @vegajs/http-client-adapter

[![npm version](https://badge.fury.io/js/%40vegajs%2Fhttp-client-adapter.svg)](https://badge.fury.io/js/%40vegajs%2Fhttp-client-adapter)

## Overview

`@vegajs/http-client-adapter` is a flexible and extensible HTTP client library designed to work with TypeScript. The package implements the adapter pattern, allowing you to easily switch between different HTTP clients, including a ready-made adapter for Axios. The library is highly type-safe, making it easy to manage HTTP requests in your application.

### Key Features

- **Adapter Pattern**: Decouple the HTTP client from the logic and allow easy swapping between clients.
- **Generics for Type Safety**: Strong typing ensures that responses and errors are correctly typed, reducing runtime errors.
- **Pre-built Axios Adapter**: A fully functioning adapter for Axios comes out of the box.
- **Flexible**: Easily extend the library by creating custom adapters for other HTTP clients.
- **Easy Integration**: Integrates seamlessly with any TypeScript-based project.

## Installation

Install the package via npm:

```bash
npm install @vegajs/http-client-adapter
```

## Quick Start

### Using the Axios Adapter

The package provides a ready-to-use adapter for Axios. You can create an HTTP service using this adapter and begin making requests right away.

```ts
import { createHttpService, AxiosAdapter } from '@vegajs/http-client-adapter';

const httpService = createHttpService(new AxiosAdapter());

httpService.get('/api/data')
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```

### Customizing Axios Configuration

If you need to customize the Axios instance (e.g., setting timeouts or base URLs), you can pass a callback to modify the Axios instance when initializing the `AxiosAdapter`:

```ts
const customAxiosAdapter = new AxiosAdapter((instance) => {
  instance.defaults.timeout = 5000;
});

const httpService = createHttpService(customAxiosAdapter);
```

### Creating a Custom HTTP Client Adapter

To create a custom adapter, you need to implement the `HttpClient` interface. This allows you to replace Axios with any other HTTP client, such as Fetch, Superagent, or your own implementation.

```ts
import { HttpClient, MethodParams, InitParams } from '@vegajs/http-client-adapter';

class CustomAdapter implements HttpClient {
  async get<Data>(point: string, params?: MethodParams): Promise<Data> {
    const response = await fetch(point);
    return response.json();
  }

  async post<Data, Body>(point: string, body: Body): Promise<Data> {
    const response = await fetch(point, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return response.json();
  }

  // Implement other HTTP methods...

  addHeaders(headers: Headers): void {
    // Custom logic to add headers
  }

  init(params: InitParams): void {
    // Custom logic to initialize with baseURL or other params
  }
}

const customService = createHttpService(new CustomAdapter());
```

### Advanced Usage

#### Generic Typing for Responses and Errors

One of the key strengths of this package is its support for generics, allowing you to define response types for better type safety.

```ts
interface UserData {
  id: string;
  name: string;
}

interface ErrorResponse {
  message: string;
}

httpService.get<UserData, ErrorResponse>('/api/user')
  .then((data) => {
    console.log(data.id); // Type-safe access
  })
  .catch((error) => {
    console.error(error.message); // Type-safe error handling
  });
```

#### Adding Headers

You can dynamically add headers to your HTTP client using the `addHeaders` method, which is helpful for setting authorization tokens or other custom headers.

```ts
httpService.addHeaders({
  Authorization: 'Bearer token',
  'Content-Type': 'application/json',
});
```

#### Initializing Base URL and Other Configurations

You can set a base URL and other configurations for the HTTP client during initialization using the `init` method.

```ts
httpService.init({
  baseURL: 'https://api.example.com',
});
```

## Testing

Testing your HTTP service is easy, as the adapter pattern allows you to mock your HTTP client by providing a custom adapter.

```ts
import { HttpClient } from '@vegajs/http-client-adapter';

class MockAdapter implements HttpClient {
  async get<Data>(point: string): Promise<Data> {
    return Promise.resolve({ data: 'mock data' } as unknown as Data);
  }

  // Other methods can also be mocked...
}

const mockService = createHttpService(new MockAdapter());

describe('HttpClient', () => {
  it('should return mock data', async () => {
    const data = await mockService.get('/mock-endpoint');
    expect(data).toEqual({ data: 'mock data' });
  });
});
```

## API Reference

### `HttpClient` Interface

The `HttpClient` interface defines the methods that any adapter must implement.

```ts
export interface HttpClient {
  get<Data = unknown, Params = SearchParams>(
    point: string,
    params?: MethodParams<Params>
  ): Promise<Data>;

  post<Data = unknown, Body = unknown, Params = SearchParams>(
    point: string,
    body: Body,
    params?: MethodParams<Params>
  ): Promise<Data>;

  put<Data = unknown, Body = unknown, Params = SearchParams>(
    point: string,
    body: Body,
    params?: MethodParams<Params>
  ): Promise<Data>;

  patch<Data = unknown, Body = unknown, Params = SearchParams>(
    point: string,
    body: Body,
    params?: MethodParams<Params>
  ): Promise<Data>;

  delete<Data = unknown, Params = SearchParams>(
    point: string,
    params?: MethodParams<Params>
  ): Promise<Data>;

  addHeaders(headers: Headers): void;

  init(params: InitParams): void;
}
```

### `MethodParams`

`MethodParams` is a utility type that allows passing search parameters, headers, and an abort signal for cancellation.

```ts
export type MethodParams<P = SearchParams> = {
  searchParams?: P;
  headers?: Headers;
  signal?: AbortSignal;
};
```

### `InitParams`

`InitParams` is used to initialize the HTTP client with basic settings like the base URL.

```ts
export type InitParams = {
  baseURL?: string;
};
```

### `AxiosAdapter`

The `AxiosAdapter` class provides an out-of-the-box integration with Axios. It implements the `HttpClient` interface and offers methods for HTTP verbs (`get`, `post`, `put`, etc.), while also allowing header management and client initialization.

```ts
export class AxiosAdapter implements HttpClient {
  constructor(instanceCb?: (instance: AxiosInstance) => unknown) { ... }

  public async get<Data = unknown, Params = SearchParams>(...) { ... }

  public async post<Data = unknown, Body = unknown, Params = SearchParams>(...) { ... }

  public addHeaders(headers: Headers): void { ... }

  public init(params: InitParams): void { ... }
}
```

## Conclusion

`@vegajs/http-client-adapter` is a powerful, type-safe, and flexible tool that simplifies working with HTTP clients in TypeScript projects. Whether you use the built-in Axios adapter or create your own, this library provides a clean and maintainable way to manage HTTP requests in your application.

