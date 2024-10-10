import { beforeEach, describe, expect, it } from 'vitest';
import { ConfigService } from './config.service';

type TestConfig = {
  apiUrl: string;
  retryCount: number;
};

describe('ConfigService', () => {
  let configService: ConfigService<TestConfig>;

  beforeEach(() => {
    configService = new ConfigService<TestConfig>({
      apiUrl: 'https://api.example.com',
      retryCount: 3,
    });
  });

  it('should initialize with default configuration if provided', () => {
    expect(configService.config).toEqual({
      apiUrl: 'https://api.example.com',
      retryCount: 3,
    });
  });

  it('should allow configuration to be reinitialized via init method', () => {
    configService.init({
      apiUrl: 'https://new-api.example.com',
      retryCount: 5,
    });

    expect(configService.config).toEqual({
      apiUrl: 'https://new-api.example.com',
      retryCount: 5,
    });
  });

  it('should throw an error if trying to access config before initialization', () => {
    const uninitializedConfigService = new ConfigService<TestConfig>();

    expect(() => uninitializedConfigService.config).toThrowError(
      'ConfigService is not initialized',
    );
  });

  it('should allow getting individual configuration values', () => {
    const apiUrl = configService.get('apiUrl');

    expect(apiUrl).toBe('https://api.example.com');
  });

  it('should allow setting a new configuration object', () => {
    configService.config = {
      apiUrl: 'https://updated-api.example.com',
      retryCount: 10,
    };

    expect(configService.config).toEqual({
      apiUrl: 'https://updated-api.example.com',
      retryCount: 10,
    });
  });

  it('should throw an error when getting a config key before initialization', () => {
    const uninitializedConfigService = new ConfigService<TestConfig>();

    expect(() => uninitializedConfigService.get('apiUrl')).toThrowError(
      'ConfigService is not initialized',
    );
  });

  it('should handle multiple types of configuration values correctly', () => {
    const retryCount = configService.get('retryCount');
    const apiUrl = configService.get('apiUrl');

    expect(typeof retryCount).toBe('number');
    expect(retryCount).toBe(3);
    expect(typeof apiUrl).toBe('string');
    expect(apiUrl).toBe('https://api.example.com');
  });
});
