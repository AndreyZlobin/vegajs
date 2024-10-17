type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

interface LogData {
  [key: string]: unknown;
}

type SendData = {
  log: string;
  message: string;
  data: unknown;
};

type SendLogCallback = (data: SendData) => void;

interface LoggerOptions {
  isEnabled?: boolean;
  logLevel?: LogLevel;
  sendLogCallback?: SendLogCallback;
  outputFormat?: 'text' | 'json';
  contextId?: string;
  globalContext?: LogData;
  enableColor?: boolean;
}

const colorMap: Record<LogLevel, string> = {
  DEBUG: '\x1b[36m%s\x1b[0m', // Cyan
  INFO: '\x1b[32m%s\x1b[0m', // Green
  WARN: '\x1b[33m%s\x1b[0m', // Yellow
  ERROR: '\x1b[31m%s\x1b[0m', // Red
};

export class Logger {
  private isEnabled: boolean;

  private logLevel: LogLevel;

  private readonly sendLogCallback?: SendLogCallback;

  private readonly outputFormat: 'text' | 'json';

  private contextId?: string;

  private globalContext?: LogData;

  private readonly enableColor: boolean;

  constructor(options: LoggerOptions = {}) {
    this.isEnabled = options.isEnabled ?? true;
    this.logLevel = options.logLevel ?? 'DEBUG';
    this.sendLogCallback = options.sendLogCallback;
    this.outputFormat = options.outputFormat ?? 'text';
    this.contextId = options.contextId;
    this.globalContext = options.globalContext;
    this.enableColor = options.enableColor ?? false;
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

  public setGlobalContext(globalContext: LogData) {
    this.globalContext = globalContext;
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    data?: LogData,
  ): string {
    const timestamp = new Date().toISOString();
    const contextPart = this.contextId ? ` [Context: ${this.contextId}]` : '';
    let formattedMessage = `[${timestamp}] [${level}]${contextPart} ${message}`;

    const mergedData = { ...this.globalContext, ...data }; // Merge global and local context

    if (mergedData && Object.keys(mergedData).length > 0) {
      const dataPart =
        this.outputFormat === 'json'
          ? ` | Data: ${JSON.stringify(mergedData)}`
          : ` | Data: ${this.formatData(mergedData)}`;

      formattedMessage += dataPart;
    }

    return formattedMessage;
  }

  private formatData(data: LogData) {
    return Object.entries(data)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join(', ');
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['DEBUG', 'INFO', 'WARN', 'ERROR'];

    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  private sendLog(data: SendData) {
    if (this.sendLogCallback) {
      this.sendLogCallback(data);
    }
  }

  private outputToConsole(level: LogLevel, message: string) {
    if (this.enableColor) {
      console.log(colorMap[level], message);
    } else {
      const mapOFLevels = {
        DEBUG: () => console.debug(message),
        INFO: () => console.info(message),
        WARN: () => console.warn(message),
        ERROR: () => console.error(message),
      };

      mapOFLevels[level]();
    }
  }

  private log(level: LogLevel, message: string, data?: LogData) {
    if (!this.isEnabled || !this.shouldLog(level)) {
      return;
    }

    const formattedMessage = this.formatMessage(level, message, data);

    this.outputToConsole(level, formattedMessage);
    this.sendLog({ log: formattedMessage, message, data });
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
