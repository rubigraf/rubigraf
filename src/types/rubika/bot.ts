/**
 * Bot descriptor.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface Bot {
  /** Bot unique id */
  bot_id: string;
  /** Bot title */
  bot_title: string;
  /** Avatar file descriptor */
  avatar: File;
  /** Bot description */
  description: string;
  /** Bot username */
  username: string;
  /** Text sent to users when they start the bot */
  start_message: string;
  /** Sharing URL for the bot */
  share_url: string;
}

export type { Bot };
