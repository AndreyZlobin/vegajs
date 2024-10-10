export class ConfigService<Config extends Record<string, unknown>> {
  private _config: Config | undefined;

  constructor(private readonly defaultConfig?: Config) {
    this._config = this.defaultConfig;
  }

  public init(config: Config) {
    this.config = config;
  }

  public get config(): Config {
    if (!this._config) {
      throw Error('ConfigService is not initialized');
    }

    return this._config;
  }

  public set config(config: Config) {
    this._config = config;
  }

  public get<K extends keyof Config>(key: K): Config[K] {
    if (!this._config) {
      throw Error('ConfigService is not initialized');
    }

    return this.config[key];
  }
}
