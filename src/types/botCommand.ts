/**
 * A bot command (e.g. /start) and its description.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface BotCommand {
  /** Command text */
  command: string;
  /** Short description shown in UI */
  description: string;
}

export type { BotCommand };
