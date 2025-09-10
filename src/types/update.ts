import type { UpdateTypeEnum } from "../enums";
import type { Message } from "./message";
import type { PaymentStatus } from "./paymentStatus";

/**
 * Update event sent by the API.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface Update {
  /** Update type */
  type: UpdateTypeEnum;
  /** Chat id related to update */
  chat_id: string;
  /** Optional removed message id (if a message was deleted) */
  removed_message_id?: string;
  /** New incoming message */
  new_message?: Message;
  /** Edited message */
  updated_message?: Message;
  /** Updated payment information */
  updated_payment?: PaymentStatus;
}

export type { Update };
