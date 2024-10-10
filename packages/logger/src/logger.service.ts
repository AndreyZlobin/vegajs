type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

interface LogData {
  [key: string]: unknown;
}

interface LoggerOptions {
  isEnabled?: boolean;
  logLevel?: LogLevel;
  sendLogCallback?: (log: string) => void;
  outputFormat?: 'text' | 'json';
  contextId?: string;
}

/**
 * @example
 * const logger = new Logger({
 *   isEnabled: true,
 *   logLevel: 'DEBUG',
 *   sendLogCallback: (log) => {},
 *   contextId: 'user-123', // Example of context identifier
 * });
 *
 * logger.info('Application started');
 * logger.warn('Problem loading data', { endpoint: '/api/data' });
 *
 * logger.error('Error while executing request', {
 *   error: 'Failed to retrieve data',
 * });
 *
 * logger.debug('Debugging information', { userId: 123 });
 *
 * */
export class Logger {
  private isEnabled: boolean;

  private logLevel: LogLevel;

  private readonly sendLogCallback?: (log: string) => void;

  private readonly outputFormat: 'text' | 'json';

  private contextId?: string;

  constructor(options: LoggerOptions = {}) {
    this.isEnabled = options.isEnabled ?? true;
    this.logLevel = options.logLevel ?? 'DEBUG';
    this.sendLogCallback = options.sendLogCallback;
    this.outputFormat = options.outputFormat ?? 'text';
    this.contextId = options.contextId;
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  public setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  public setContextId(contextId: string) {
    this.contextId = contextId;
  }

  private formatMessage(level: LogLevel, message: string, data?: LogData) {
    const timestamp = new Date().toISOString();
    const contextPart = this.contextId ? ` [Context: ${this.contextId}]` : '';
    let formattedMessage = `[${timestamp}] [${level}]${contextPart} ${message}`;

    if (data) {
      const dataPart =
        this.outputFormat === 'json'
          ? ` | Data: ${JSON.stringify(data)}`
          : ` | Data: ${this.formatData(data)}`;

      formattedMessage += dataPart;
    }

    return formattedMessage;
  }

  private formatData(data: LogData) {
    return Object.entries(data)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join(', ');
  }

  private shouldLog(level: LogLevel) {
    const levels: LogLevel[] = ['DEBUG', 'INFO', 'WARN', 'ERROR'];

    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  private sendLog(log: string) {
    if (this.sendLogCallback) {
      this.sendLogCallback(log);
    }
  }

  private log(level: LogLevel, message: string, data?: LogData) {
    if (this.isEnabled && this.shouldLog(level)) {
      const formattedMessage = this.formatMessage(level, message, data);

      this.outputToConsole(level, formattedMessage);
      this.sendLog(formattedMessage);
    }
  }

  private outputToConsole(level: LogLevel, message: string) {
    const mapOFLevels = {
      DEBUG: () => console.debug(message),
      INFO: () => console.info(message),
      WARN: () => console.warn(message),
      ERROR: () => console.error(message),
    };

    mapOFLevels[level]();
  }

  public debug(message: string, data?: LogData) {
    this.log('DEBUG', message, data);
  }

  public info(message: string, data?: LogData) {
    this.log('INFO', message, data);
  }

  public warn(message: string, data?: LogData) {
    this.log('WARN', message, data);
  }

  public error(message: string, data?: LogData) {
    this.log('ERROR', message, data);
  }
}
