
# Toolkit Documentation

The `Toolkit` class is a utility designed to manage and simplify the execution of asynchronous queries and mutations in MobX-based applications. It provides features like query caching, invalidation, and polling, making it easier to handle data fetching and state management.

## Features

- **Query Creation**: Caches and manages asynchronous queries to prevent redundant network requests.
- **Mutation Creation**: Allows for the creation and handling of mutations (write operations).
- **Query Caching**: Caches queries by a unique key, preventing the recreation of the same query.
- **Query Invalidation**: Provides the ability to invalidate single or multiple queries, allowing refetching of stale data.
- **Polling**: Supports polling to periodically refetch queries.

---

## Class: `Toolkit`

### Constructor

The `Toolkit` class has no required parameters and is instantiated with a basic `constructor`. It initializes an internal cache for queries, stored in a `Map`.

```ts
constructor();
```

### Properties

- **`queries: Map<string, Query>`**  
  A cache of queries, where each query is mapped to a unique key.

### Methods

#### `createQuery`

Creates a new `Query` object based on the provided options. If a query with the same key already exists in the cache, the cached query is returned to avoid redundant fetch operations.

##### Parameters:
- **`options: QueryOptions<TData, TError, TOptions> & { key: string }`**  
  An object containing options for the query:
    - **`fn: (options: TOptions) => Promise<TData>`**: The function that performs the query.
    - **`onSuccess: (data: TData, options: TOptions) => void`**: A callback executed on successful data retrieval.
    - **`onError: (error: TError, options: TOptions) => void`**: A callback executed when an error occurs.
    - **`key: string`**: A unique key for caching the query.

##### Returns:
- **`Query<TData, TError, TOptions>`**: The created or cached query instance.

##### Example:

```ts
const query = toolkit.createQuery({
  fn: fetchData,
  onSuccess: (data) => console.log('Data fetched:', data),
  onError: (error) => console.error('Error fetching data:', error),
  key: 'fetchDataQuery',
});
```

#### `createMutation`

Creates a new `Mutation` object based on the provided options. This method allows you to execute write operations (mutations) and handle success and error callbacks.

##### Parameters:
- **`options: MutationOptions<TData, TError, TOptions>`**  
  An object containing options for the mutation:
    - **`fn: (options: TOptions) => Promise<TData>`**: The function that performs the mutation.
    - **`onSuccess: (data: TData, options: TOptions) => void`**: A callback executed on successful mutation.
    - **`onError: (error: TError, options: TOptions) => void`**: A callback executed when an error occurs.

##### Returns:
- **`Mutation<TData, TError, TOptions>`**: The created mutation instance.

##### Example:

```ts
const mutation = toolkit.createMutation({
  fn: saveData,
  onSuccess: (data) => console.log('Data saved:', data),
  onError: (error) => console.error('Error saving data:', error),
});
```

#### `invalidate`

Invalidates a query identified by its key, forcing it to refetch data the next time it is accessed. This is useful when you know that the data behind the query may have become stale.

##### Parameters:
- **`key: string`**  
  The unique key of the query you want to invalidate.

##### Example:

```ts
toolkit.invalidate('fetchDataQuery');
```

#### `invalidateQueries`

Invalidates all queries stored in the cache, causing all of them to refetch the next time they are accessed.

##### Example:

```ts
toolkit.invalidateQueries();
```

---

## Query Class

The `Query` class represents a single data-fetching operation. It is responsible for managing the state (loading, error, success) of the request, caching the data, and handling refetching and polling.

### Key Methods:
- **`fetch(options: TOptions)`**: Executes the query.
- **`refetch()`**: Refetches the data for the query.
- **`startPolling(interval: number, options: TOptions)`**: Starts polling the query at a specified interval.
- **`stopPolling()`**: Stops the polling.

---

## Mutation Class

The `Mutation` class represents a write operation that can be executed with the provided function (`fn`). Like the `Query` class, it manages state (loading, error, success) and executes success/error callbacks.

### Key Methods:
- **`mutate(options: TOptions)`**: Executes the mutation.
- **`mutateAsync(options: TOptions)`**: Executes the mutation asynchronously.

---

## Usage Example

Here’s a simple example that demonstrates creating a `Toolkit` instance, creating a query, and invalidating it.

```ts
import { createToolkit } from './Toolkit';

const toolkit = createToolkit();

// Define a function for fetching data
const fetchData = async () => {
  const response = await fetch('/api/data');
  return response.json();
};

// Create a query
const query = toolkit.createQuery({
  fn: fetchData,
  onSuccess: (data) => console.log('Data:', data),
  onError: (error) => console.error('Error:', error),
  key: 'uniqueQueryKey',
});

// Execute the query
query.fetchSync({});

// Invalidate the query to refetch the data
toolkit.invalidate('uniqueQueryKey');
```

---

## Conclusion

The `Toolkit` class simplifies working with asynchronous operations in MobX, handling query caching, invalidation, and mutation operations efficiently. By leveraging this class, you can reduce redundancy, avoid race conditions, and ensure your app's state remains up-to-date.
