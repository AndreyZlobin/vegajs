function assert<T>(
  value: T | undefined | null,
  message = 'Assertion failed: value is not defined',
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}

export class ConfigService<Config extends Record<string, unknown>> {
  #config: Config | undefined;

  constructor(private readonly defaultConfig?: Config) {
    this.#config = this.defaultConfig;
  }

  public init(config: Config) {
    this.config = config;
  }

  public get config() {
    assert(this.#config, 'ConfigService is not initialized');

    return this.#config;
  }

  public set config(config: Config) {
    this.#config = config;
  }

  public get<K extends keyof Config>(key: K): Config[K] {
    assert(this.#config, 'ConfigService is not initialized');

    return this.config[key];
  }
}
