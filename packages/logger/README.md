# @vegajs/logger

[![npm version](https://badge.fury.io/js/%40vegajs%2Flogger.svg)](https://badge.fury.io/js/%40vegajs%2Flogger)

## Overview

The `Logger` class is a flexible and extensible logging utility for TypeScript projects. It allows for structured logging with various log levels (`DEBUG`, `INFO`, `WARN`, `ERROR`) and supports customizable log output formats (`text` or `json`). Additionally, you can specify callbacks for log transmission (e.g., sending logs to a server or external service) and include contextual data in your logs.

### Key Features

- **Multiple Log Levels**: Choose from `DEBUG`, `INFO`, `WARN`, and `ERROR` to control the verbosity of logs.
- **Customizable Output Format**: Logs can be output as plain text or JSON format, making them easily readable or suitable for machine parsing.
- **Flexible Log Transmission**: You can define a custom callback function to handle log transmission (e.g., sending logs to an external server).
- **Contextual Logging**: Optionally include a `contextId` to tag logs with specific context information (e.g., user sessions, request IDs).
- **Synchronous and Asynchronous Log Support**: The logger works with synchronous outputs and can easily be extended for asynchronous operations.

## Installation

Install the package via npm:

```bash
npm install @vegajs/logger
```

## Quick Start

### Basic Usage

Create a logger instance and log messages with different log levels:

```ts
import { Logger } from '@vegajs/logger';

const logger = new Logger({
  isEnabled: true,
  logLevel: 'DEBUG',
  outputFormat: 'text',
});

logger.info('Application started');
logger.warn('Low disk space');
logger.error('Unexpected error occurred');
logger.debug('Debugging information');
```

### Logging with Context and Data

You can associate a logger with a context (e.g., user session or transaction) and include additional data with log messages:

```ts
const logger = new Logger({
  isEnabled: true,
  logLevel: 'INFO',
  contextId: 'user-123',
});

logger.info('User login attempt', { username: 'alice' });
logger.warn('Failed API call', { endpoint: '/api/data', status: 404 });
logger.error('Critical application failure', { error: 'OutOfMemoryError' });
```

### JSON Output Format

Change the output format to `json` for structured logging:

```ts
const logger = new Logger({
  isEnabled: true,
  logLevel: 'DEBUG',
  outputFormat: 'json',
});

logger.debug('Debugging JSON log', { userId: 456 });
```

### Sending Logs to an External Service

You can define a custom callback to handle log transmissions, such as sending logs to a remote server:

```ts
const logger = new Logger({
  isEnabled: true,
  logLevel: 'ERROR',
  sendLogCallback: (log) => {
    // Send log to a remote server
    fetch('/log', {
      method: 'POST',
      body: JSON.stringify({ log }),
    });
  },
});

logger.error('Error occurred while fetching data', { error: 'Network error' });
```

### Customizing the Log Level Dynamically

You can change the log level dynamically at runtime:

```ts
logger.setLogLevel('WARN');
logger.info('This will not be logged');  // Log level is too low
logger.warn('This will be logged');      // Log level is sufficient
```

### Disabling/Enabling the Logger

To disable or enable logging globally for your application:

```ts
logger.setEnabled(false);  // Disable all logging
logger.debug('This will not be logged');

logger.setEnabled(true);   // Re-enable logging
logger.info('Logging is enabled again');
```

## Advanced Features

### Logging with Context Identifiers

The `contextId` allows you to associate logs with specific contexts, such as a user session or request:

```ts
const logger = new Logger({
  isEnabled: true,
  logLevel: 'DEBUG',
  contextId: 'session-456',
});

logger.info('Processing request', { requestId: 'req-789' });
```

You can also update the context identifier dynamically:

```ts
logger.setContextId('session-789');
logger.info('Continuing request processing');
```

### Data Formatting

The logger automatically formats additional log data depending on the `outputFormat`. For `text` format, it will serialize the data into a readable string, and for `json` format, it will include a JSON object.

For example:

```ts
logger.warn('Fetching data from API', { endpoint: '/api/data', retries: 3 });
```

In text format, it outputs:
```
[2024-10-10T12:34:56.789Z] [WARN] Fetching data from API | Data: endpoint: "/api/data", retries: 3
```

In JSON format:
```json
{
  "timestamp": "2024-10-10T12:34:56.789Z",
  "level": "WARN",
  "message": "Fetching data from API",
  "context": "session-789",
  "data": {
    "endpoint": "/api/data",
    "retries": 3
  }
}
```

## API Reference

### `Logger` Class

#### Constructor

```ts
constructor(options?: LoggerOptions)
```

- **`options`** *(optional)*: Configuration options for the logger.
    - `isEnabled`: *(boolean)* Enable or disable logging (default: `true`).
    - `logLevel`: *(LogLevel)* Minimum log level to output (default: `DEBUG`).
    - `sendLogCallback`: *(function)* Callback function to handle log transmission.
    - `outputFormat`: `'text' | 'json'` Format for log output (default: `'text'`).
    - `contextId`: *(string)* Optional context identifier to tag logs.

#### Methods

- **`debug(message: string, data?: LogData)`**: Logs a debug message with optional data.
- **`info(message: string, data?: LogData)`**: Logs an informational message with optional data.
- **`warn(message: string, data?: LogData)`**: Logs a warning message with optional data.
- **`error(message: string, data?: LogData)`**: Logs an error message with optional data.
- **`setEnabled(enabled: boolean)`**: Enable or disable logging.
- **`setLogLevel(level: LogLevel)`**: Dynamically set the log level.
- **`setContextId(contextId: string)`**: Set or update the context identifier.

## Example Usage in Node.js/Browser

You can use the `Logger` class in both Node.js and browser environments. The flexible `sendLogCallback` allows you to adapt logging for different use cases, including browser consoles or server-side log management systems.

```ts
const logger = new Logger({
  isEnabled: true,
  logLevel: 'DEBUG',
  outputFormat: 'text',
  contextId: 'request-123',
});

logger.debug('Start request processing');
logger.info('Request processed successfully', { responseTime: '200ms' });
```

## Conclusion

The `Logger` class is a powerful, customizable logging solution for TypeScript projects. It supports different log levels, custom log outputs (text or JSON), context-aware logging, and flexible log transmission. Start using `Logger` today to improve your application’s logging capabilities!
