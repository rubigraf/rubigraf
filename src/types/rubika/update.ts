import type { UpdateTypeEnum } from "../../enums";
import { RubigrafEvents } from "../../symbols";
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

/**
 * Update union type.
 *
 * @package rubigraf
 * @since v1.0.0
 */
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

// Helper types

// Note: For determining each Update type for sub events like CommandUpdate we need to make
// another unique property which will never accessible in the runtime but in compile-time
// to determine the types correctly.
type CommandUpdate = NewMessageUpdate & { readonly [RubigrafEvents.Command]: never };
type ContactUpdate = NewMessageUpdate & { readonly [RubigrafEvents.Contact]: never };
type FileUpdate = NewMessageUpdate & { readonly [RubigrafEvents.File]: never };
type ForwardedFromUpdate = NewMessageUpdate & { readonly [RubigrafEvents.ForwardedFrom]: never };
type NewMessageUpdate = UpdateMap[UpdateTypeEnum.NewMessage];
type RemovedMessageUpdate = UpdateMap[UpdateTypeEnum.RemovedMessage];
type StartedBotUpdate = UpdateMap[UpdateTypeEnum.StartedBot];
type StoppedBotUpdate = UpdateMap[UpdateTypeEnum.StoppedBot];
type UpdatedMessageUpdate = UpdateMap[UpdateTypeEnum.UpdatedMessage];
type UpdatedPaymentUpdate = UpdateMap[UpdateTypeEnum.UpdatedPayment];

type CustomContextTypes = CommandUpdate | ContactUpdate | FileUpdate | ForwardedFromUpdate;

export type {
  BaseUpdate,
  CommandUpdate,
  ContactUpdate,
  FileUpdate,
  ForwardedFromUpdate,
  CustomContextTypes,
  NewMessageUpdate,
  RemovedMessageUpdate,
  StartedBotUpdate,
  StoppedBotUpdate,
  Update,
  UpdateMap,
  UpdatedMessageUpdate,
  UpdatedPaymentUpdate,
};
