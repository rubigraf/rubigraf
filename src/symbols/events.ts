import {
  Context,
  Message,
  NewMessageUpdate,
  Next,
  PaymentStatus,
  RemovedMessageUpdate,
  StartedBotUpdate,
  StoppedBotUpdate,
  Update,
  UpdatedMessageUpdate,
  UpdatedPaymentUpdate,
} from "../types";

namespace RubigrafEvents {
  export const Command = Symbol("command");
  export const Error = Symbol("error");
  export const NewMessage = Symbol("new_message");
  export const RemovedMessage = Symbol("removed_message");
  export const StartedBot = Symbol("started_bot");
  export const StoppedBot = Symbol("stopped_bot");
  export const UpdatedPayment = Symbol("updated_payment");
  export const UpdatedMessage = Symbol("updated_message");
  export const Update = Symbol("update");

  export type Map = {
    [Command]: [ctx: Context<NewMessageUpdate>, next: Next];
    [Error]: [err: Error | string | unknown, next: Next];
    [NewMessage]: [ctx: Context<NewMessageUpdate>, msg: Message, next: Next];
    [RemovedMessage]: [ctx: Context<RemovedMessageUpdate>, id: string, next: Next];
    [StartedBot]: [ctx: Context<StartedBotUpdate>, update: Update, next: Next];
    [StoppedBot]: [ctx: Context<StoppedBotUpdate>, update: Update, next: Next];
    [UpdatedPayment]: [ctx: Context<UpdatedPaymentUpdate>, payment: PaymentStatus, next: Next];
    [UpdatedMessage]: [ctx: Context<UpdatedMessageUpdate>, msg: Message, next: Next];
    [Update]: [ctx: Context, update: Update, next: Next];
  };

  /**
   * A lazy-loadable event listener wrapper.
   */
  export type BotEventInstaller<C, K extends keyof Map> = (events: C) => (...args: Map[K]) => void;
}

export { RubigrafEvents };
