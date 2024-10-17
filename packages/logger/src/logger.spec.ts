import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Logger } from './logger';

describe('Logger', () => {
  let logger: Logger;
  let sendLogCallback: Mock;

  beforeEach(() => {
    sendLogCallback = vi.fn();

    logger = new Logger({
      isEnabled: true,
      logLevel: 'DEBUG',
      sendLogCallback,
      contextId: 'user-123',
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should log messages for each level correctly', () => {
    const consoleSpies = {
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    };

    logger.debug('Debug message');

    expect(consoleSpies.debug).toHaveBeenCalledWith(
      expect.stringContaining('Debug message'),
    );

    logger.info('Info message');

    expect(consoleSpies.info).toHaveBeenCalledWith(
      expect.stringContaining('Info message'),
    );

    logger.warn('Warning message');

    expect(consoleSpies.warn).toHaveBeenCalledWith(
      expect.stringContaining('Warning message'),
    );

    logger.error('Error message');

    expect(consoleSpies.error).toHaveBeenCalledWith(
      expect.stringContaining('Error message'),
    );
  });

  it('should not log when logger is disabled', () => {
    const consoleInfoSpy = vi
      .spyOn(console, 'info')
      .mockImplementation(() => {});

    logger.setEnabled(false);
    logger.info('This should not be logged');
    expect(sendLogCallback).not.toHaveBeenCalled();
    expect(consoleInfoSpy).not.toHaveBeenCalled();
    consoleInfoSpy.mockRestore();
  });

  it('should format messages correctly in text format', () => {
    // @ts-ignore
    const message = logger.formatMessage('INFO', 'Test message', {
      key: 'value',
    });

    expect(message).toMatch(
      /\[.*\] \[INFO\] \[Context: user-123\] Test message \| Data: key: "value"/,
    );
  });

  it('should format messages correctly in JSON format', () => {
    logger.setLogLevel('DEBUG');
    // @ts-ignore
    logger.outputFormat = 'json';

    // @ts-ignore
    const message = logger.formatMessage('INFO', 'Test message', {
      key: 'value',
    });

    expect(message).toMatch(
      /\[.*\] \[INFO\] \[Context: user-123\] Test message \| Data: {"key":"value"}/,
    );
  });

  it('should call the sendLogCallback when logging', () => {
    logger.info('Info message for callback', { extra: 'data' });

    expect(sendLogCallback).toHaveBeenCalledWith({
      log: expect.stringContaining('Info message for callback'),
      message: 'Info message for callback',
      data: { extra: 'data' },
    });
  });

  it('should only log messages at or above the set log level', () => {
    logger.setLogLevel('WARN');

    const consoleInfoSpy = vi
      .spyOn(console, 'info')
      .mockImplementation(() => {});

    logger.info('This message should not log');
    expect(consoleInfoSpy).not.toHaveBeenCalled();

    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    logger.warn('Warning message');
    expect(consoleWarnSpy).toHaveBeenCalled();
    consoleInfoSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it('should handle logging with a custom context ID', () => {
    logger.setContextId('custom-id');

    const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

    logger.info('Message with custom context');

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Context: custom-id]'),
    );
  });

  it('should handle undefined or null data gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    logger.warn('Warning message', undefined);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Warning message'),
    );

    // @ts-ignore
    logger.warn('Warning message with null', null);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Warning message with null'),
    );
  });

  it('should allow resetting log level and context ID', () => {
    logger.setLogLevel('WARN');
    logger.setContextId('reset-id');
    // @ts-ignore
    expect(logger.logLevel).toBe('WARN');
    // @ts-ignore
    expect(logger.contextId).toBe('reset-id');
    logger.setLogLevel('DEBUG');
    logger.setContextId('user-456');
    // @ts-ignore
    expect(logger.logLevel).toBe('DEBUG');
    // @ts-ignore
    expect(logger.contextId).toBe('user-456');
  });

  it('should not log messages below the ERROR level if logLevel is set to ERROR', () => {
    logger.setLogLevel('ERROR');

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    logger.warn('This is a warning message');
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    logger.error('This is an error message');
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });
});
