import type { LogLevel, LoggerOptions } from "../../types";
import Colors from "./colors";

const levelOrder: Record<LogLevel, number> = {
  info: 0,
  debug: 1,
  warn: 2,
  error: 3,
};

const levelColors: Record<LogLevel, string> = {
  info: Colors.info,
  debug: Colors.debug,
  warn: Colors.warn,
  error: Colors.error,
};

const prefixColors = [
  Colors.brightGreen,
  Colors.brightBlue,
  Colors.brightYellow,
  Colors.brightWhite,
];

/**
 * Advanced colorized and hierarchical Logger class.
 *
 * @since v1.2.8
 */
export default class Logger {
  private prefix: string;
  private level: LogLevel;
  private timestamp: boolean;
  private color: boolean;
  private showStack: boolean;

  /**
   * Creates a new {@link Logger} instance.
   *
   * @param opts {@link Logger} configuration {@link LoggerOptions opts}
   */
  constructor(opts: LoggerOptions = {}) {
    this.prefix = opts.prefix ?? "Rubigraf";
    this.level = opts.level ?? "info";
    this.timestamp = opts.timestamp ?? true;
    this.color = opts.color ?? true;
    this.showStack = opts.showStack ?? false;
  }

  /**
   * Creates a new child logger inheriting the current configuration.
   * The prefix will be extended hierarchically (e.g., `Rubigraf/Engine`).
   *
   * @param name Name of the child logger to append to the prefix
   * @returns A new {@link Logger} instance with extended prefix
   *
   * @since v1.2.8
   */
  public child(name: string): Logger {
    const newPrefix = this.prefix ? `${this.prefix}/${name}` : name;
    return new Logger({
      prefix: newPrefix,
      level: this.level,
      timestamp: this.timestamp,
      color: this.color,
    });
  }

  /**
   * Determines if a given log level should be output based on the current configured minimum level.
   *
   * @param level The log level to check
   * @returns `true` if the message should be logged, `false` otherwise
   *
   * @since v1.2.8
   */
  private shouldLog(level: LogLevel): boolean {
    return levelOrder[level] <= levelOrder[this.level];
  }

  /**
   * Formats the prefix with colors per hierarchy level.
   * Each segment in the hierarchical prefix gets a distinct color.
   *
   * @returns The formatted (possibly colorized) prefix string
   *
   * @since v1.2.8
   */
  private formatPrefix(): string {
    if (!this.prefix) return "";
    if (!this.color) return `[${this.prefix}]`;

    const parts = this.prefix.split("/");
    const colored = parts.map((part, i) => {
      const colorCode = prefixColors[i % prefixColors.length];
      return `${colorCode}${part}${Colors.reset}`;
    });

    return `${Colors.brightWhite}[${colored.join(`${Colors.brightWhite}/${Colors.reset}`)}${
      Colors.brightWhite
    }]${Colors.reset}`;
  }

  /**
   * Formats a log message into a string for console output.
   * Handles both JSON and text formatting with colorization.
   *
   * @param level The level of the message
   * @param args The message arguments to log
   * @returns Formatted log message as string
   *
   * @since v1.2.8
   */
  private format(level: LogLevel, ...args: any[]): string {
    const timestamp = this.timestamp
      ? this.color
        ? `${Colors.brightMagenta}${new Date().toISOString()}`
        : new Date().toISOString()
      : "";
    const levelText = this.color
      ? `${levelColors[level]}${level.toUpperCase().padEnd(5)}${Colors.reset}`
      : level.toUpperCase();
    const prefixText = this.formatPrefix();

    return [timestamp, levelText, prefixText, ...args].filter(Boolean).join(" ");
  }

  /**
   * Sends formatted output to the appropriate console method.
   * Only outputs if the level meets the current minimum level threshold.
   *
   * @param level The log level
   * @param args Message arguments
   *
   * @since v1.2.8
   */
  private output(level: LogLevel, ...args: any[]): void {
    if (!this.shouldLog(level)) return;

    if (level === "error" && this.showStack) {
      const errorArg = args.find((arg) => arg instanceof Error);
      if (errorArg instanceof Error) {
        const stack = errorArg.stack ?? `${errorArg.name}: ${errorArg.message}`;
        const formattedStack = this.color ? `${Colors.dim}${stack}${Colors.reset}` : stack;

        const baseArgs = args.map((arg) => (arg instanceof Error ? arg.message : arg));

        console.error(this.format(level, ...baseArgs));
        console.error(formattedStack);
        return;
      }

      if (args.length && typeof args[0] === "string") {
        const fakeStack = new Error(args[0]).stack;
        if (fakeStack) {
          const formattedStack = this.color
            ? `${Colors.dim}${fakeStack}${Colors.reset}`
            : fakeStack;
          console.error(this.format(level, ...args));
          console.error(formattedStack);
          return;
        }
      }

      return;
    }

    const formatted = this.format(level, ...args);
    switch (level) {
      case "error":
        console.error(formatted);
        break;

      case "warn":
        console.warn(formatted);
        break;

      case "debug":
        console.debug(formatted);
        break;

      default:
        console.info(formatted);
        break;
    }
  }

  /**
   * Logs an informational message.
   * Visible when level is "info", "debug", "warn", or "error".
   *
   * @param args Message arguments
   *
   * @since v1.2.8
   */
  public info(...args: any[]): void {
    this.output("info", ...args);
  }

  /**
   * Logs a debugging message.
   * Only visible when level is "debug", "warn", or "error".
   *
   * @param args Message arguments
   *
   * @since v1.2.8
   */
  public debug(...args: any[]): void {
    this.output("debug", ...args);
  }

  /**
   * Logs a warning message.
   * Only visible when level is "warn" or "error".
   *
   * @param args Message arguments
   *
   * @since v1.2.8
   */
  public warn(...args: any[]): void {
    this.output("warn", ...args);
  }

  /**
   * Logs an error message.
   * Only visible when level is "error".
   *
   * @param args Message arguments
   *
   * @since v1.2.8
   */
  public error(...args: any[]): void {
    this.output("error", ...args);
  }
}
