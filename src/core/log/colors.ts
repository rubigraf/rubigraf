/**
 * Colors container.
 *
 * @since v1.2.8
 */
export default class Colors {
  static bold = "\x1b[1m";
  static dim = "\x1b[2m";
  static italic = "\x1b[3m";
  static underline = "\x1b[4m";

  static brightBlue = "\x1b[94m";
  static brightGray = "\x1b[90m";
  static brightYellow = "\x1b[93m";
  static brightRed = "\x1b[91m";
  static brightGreen = "\x1b[92m";
  static brightMagenta = "\x1b[95m";
  static brightWhite = "\x1b[97m";

  static reset = "\x1b[0m";

  static info = this.brightBlue;
  static debug = this.brightGray;
  static warn = this.brightYellow;
  static error = this.brightRed;
}
