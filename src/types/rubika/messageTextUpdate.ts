/**
 * Update when a message’s text content changes.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface MessageTextUpdate {
  /** Updated text */
  text: string;
  /** Original message ID */
  message_id: string;
}

export type { MessageTextUpdate };
