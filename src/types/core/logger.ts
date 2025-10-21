type LogLevel = "info" | "debug" | "warn" | "error";

/**
 * Logger configuration options.
 */
interface LoggerOptions {
  /** Optional prefix label */
  prefix?: string;

  /** Minimum log level to output */
  level?: LogLevel;

  /** Whether to include ISO timestamps in log messages */
  timestamp?: boolean;

  /** Whether to colorize output (useful for terminal environments) */
  color?: boolean;

  /** Whether to show stack errors (useful only for ERROR level) */
  showStack?: boolean;
}

export type { LogLevel, LoggerOptions };
