# ConfigService

## Description

`ConfigService` is a class that manages the application configuration. It allows you to initialize the configuration, set its values, and access individual configuration parameters.

## General Usage

To create an instance of `ConfigService`, you can pass a default configuration object. Then, using the `init` method, you can initialize the configuration.

```typescript
type InitialConfig = {
  apiUrl: string;
}

const configService = new ConfigService<InitialConfig>();

configService.init({ apiUrl: 'https://new-api.example.com' });
```

## Constructor

### `constructor(defaultConfig?: Config)`

- `defaultConfig` (optional): a configuration object that will be set as the default when creating an instance.

## Methods

### `init(config: Config): void`

Initializes the configuration with a new object.

- `config`: the configuration object.

### `get config(): Config`

Returns the current configuration object. If the configuration has not been initialized, it throws an error.

Example:
```typescript
const currentConfig = configService.config;
```

### `get<K extends keyof Config>(key: K): Config[K]`

Returns the value of a configuration parameter by its key. If the configuration has not been initialized, it throws an error.

- `key`: the key whose value needs to be retrieved from the configuration.

Example:
```typescript
const apiUrl = configService.get('apiUrl');
```

## Errors

- If you try to access the configuration before it is initialized, an error will be thrown: `ConfigService is not initialized`.
