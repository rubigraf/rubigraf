import type { Keypad } from "./keypad";

/**
 * Update payload when a message's inline keypad changes.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface MessageKeypadUpdate {
  /** Message id */
  message_id: string;
  /** New inline keypad */
  inline_keypad: Keypad;
}

export type { MessageKeypadUpdate };
