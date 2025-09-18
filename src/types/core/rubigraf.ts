import { ChatKeypadTypeEnum } from "../../enums";
import { Keypad } from "../rubika";

interface RubigrafOptions {
  baseURL?: string;
  pollIntervalMs?: number;
}

interface SendMessageOptions {
  /** Whether notification should be disabled or not */
  disableNotification?: boolean;
  /** Chat keypad */
  chatKeypad?: Keypad;
  /** Inline keypad */
  inlineKeypad?: Keypad;
  /** The message ID to reply to */
  replyToMessageId?: string;
  /** The type of the keypad */
  chatKeypadType?: ChatKeypadTypeEnum;
}

export type { RubigrafOptions, SendMessageOptions };
