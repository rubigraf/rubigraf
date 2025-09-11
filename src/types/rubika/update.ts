import type { UpdateTypeEnum } from "../../enums";
import type { Message } from "./message";
import type { PaymentStatus } from "./paymentStatus";

/**
 * Update event sent by the API.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface BaseUpdate {
  /** Chat id related to update */
  chat_id: string;
}

type Update =
  | (BaseUpdate & {
      type: UpdateTypeEnum.NewMessage;
      new_message: Message;
    })
  | (BaseUpdate & {
      type: UpdateTypeEnum.RemovedMessage;
      removed_message_id: string;
    })
  | (BaseUpdate & {
      type: UpdateTypeEnum.StartedBot;
      new_message: Message;
    })
  | (BaseUpdate & {
      type: UpdateTypeEnum.StoppedBot;
      new_message: Message;
    })
  | (BaseUpdate & {
      type: UpdateTypeEnum.UpdatedMessage;
      updated_message: Message;
    })
  | (BaseUpdate & {
      type: UpdateTypeEnum.UpdatedPayment;
      updated_payment: PaymentStatus;
    });

/**
 * Map each UpdateTypeEnum to its corresponding Update subtype.
 *
 * This allows `Context<T>` to strongly infer the right fields.
 *
 * @package rubigraf
 * @since v1.0.0
 */
type UpdateMap = {
  [K in Update as K["type"]]: Extract<Update, { type: K["type"] }>;
};

export type { BaseUpdate, Update, UpdateMap };
