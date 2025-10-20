import { ChatKeypadTypeEnum, UpdateEndpointTypeEnum } from "../../enums";
import { Keypad } from "../rubika";

interface BaseRubigrafOptions {
  baseURL: string;
  freshnessWindow: number;
}

type ConditionalRubigrafOptions =
  | {
      polling: true | RubigrafPollingOptions;
      webhook?: undefined;
    }
  | {
      polling: false;
      webhook: RubigrafWebhookOptions;
    };

type RubigrafOptions = BaseRubigrafOptions & ConditionalRubigrafOptions;

interface RubigrafPollingOptions {
  pollIntervalMs: number;
}

interface RubigrafWebhookOptions {
  type: UpdateEndpointTypeEnum;
  url: string;
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
