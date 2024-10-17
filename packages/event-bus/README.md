# @vegajs/event-bus

A flexible and typed Event Bus implementation for TypeScript projects. This library provides a simple interface to manage events and listeners, allowing communication between different parts of your application without tight coupling.

## Installation

Install the package via npm:

```bash
npm install @vegajs/event-bus
```

## Usage

### Basic Setup

You can define your own event types and data structure, and use the `EventBus` to emit and listen to events. Here's an example:

```typescript
import { EventBus } from 'your-event-bus-package';

// Define the events for your application
type MyAppEvents = {
    'app:start': void;
    'user:login': { username: string };
    'data:update': { newData: any };
};

// Create an instance of EventBus
const eventBus = new EventBus<MyAppEvents>();

// Subscribing to an event
eventBus.on('user:login', (event) => {
    console.log(`User logged in: ${event.username}`);
});

// Emitting an event
eventBus.emit('user:login', { username: 'john_doe' });

// Unsubscribing from an event
const handler = (event: { username: string }) => console.log(`User logged in: ${event.username}`);
eventBus.on('user:login', handler);
eventBus.off('user:login', handler);
```

### Example of Multiple Event Types

You can also work with multiple types of events in a type-safe way.

```typescript
// Define a new set of events
type OtherEvents = {
    'error': { message: string };
    'notification': { text: string };
};

const anotherBus = new EventBus<OtherEvents>();

// Subscribing to different events
anotherBus.on('error', (event) => {
    console.error(`Error occurred: ${event.message}`);
});

anotherBus.on('notification', (event) => {
    console.log(`Notification: ${event.text}`);
});

// Emitting events
anotherBus.emit('error', { message: 'Something went wrong!' });
anotherBus.emit('notification', { text: 'New message received' });
```

### Asynchronous Events

The `EventBus` also supports asynchronous event handlers if necessary:

```typescript
const asyncBus = new EventBus<MyAppEvents>();

asyncBus.on('app:start', async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('App started after 1 second');
});

asyncBus.emit('app:start', undefined);
```

### Handling Events with `void` Type

If you have events that do not carry any data (i.e., `void` events), you can emit them without providing an argument:

```typescript
type VoidEvents = {
    'app:stop': void;
};

const voidBus = new EventBus<VoidEvents>();

voidBus.on('app:stop', () => {
    console.log('App stopped');
});

voidBus.emit('app:stop', undefined);
```

## API

### `on`

```typescript
on<K extends keyof EventMap>(eventName: K, handler: (event: EventMap[K]) => void): void;
```

- **eventName**: The name of the event to listen for.
- **handler**: The function to execute when the event is emitted.

### `off`

```typescript
off<K extends keyof EventMap>(eventName: K, handler: (event: EventMap[K]) => void): void;
```

- **eventName**: The name of the event to stop listening for.
- **handler**: The function to remove from the listener list.

### `emit`

```typescript
emit<K extends keyof EventMap>(eventName: K, event: EventMap[K]): void;
```

- **eventName**: The name of the event to emit.
- **event**: The data to pass to the listeners of the event.

