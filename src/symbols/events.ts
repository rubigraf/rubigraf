import {
  Context,
  Message,
  NewMessageUpdate,
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
    [Command]: [ctx: Context<NewMessageUpdate>];
    [Error]: [err: Error | string | unknown, code?: number];
    [NewMessage]: [ctx: Context<NewMessageUpdate>, msg: Message];
    [RemovedMessage]: [ctx: Context<RemovedMessageUpdate>, id: string];
    [StartedBot]: [ctx: Context<StartedBotUpdate>, update: Update];
    [StoppedBot]: [ctx: Context<StoppedBotUpdate>, update: Update];
    [UpdatedPayment]: [ctx: Context<UpdatedPaymentUpdate>, payment: PaymentStatus];
    [UpdatedMessage]: [ctx: Context<UpdatedMessageUpdate>, msg: Message];
    [Update]: [ctx: Context, update: Update];
  };

  /**
   * A lazy-loadable event listener wrapper.
   */
  export type BotEventInstaller<C, K extends keyof Map> = (events: C) => (...args: Map[K]) => void;
}

export { RubigrafEvents };
