import type {
  CommandUpdate,
  ContactUpdate,
  Context,
  NewMessageUpdate,
  Next,
  RemovedMessageUpdate,
  StartedBotUpdate,
  StoppedBotUpdate,
  UpdatedMessageUpdate,
  UpdatedPaymentUpdate,
} from "../types";

namespace RubigrafEvents {
  export const Command = Symbol("command");
  export const Contact = Symbol("contact");
  export const Error = Symbol("error");
  export const NewMessage = Symbol("new_message");
  export const RemovedMessage = Symbol("removed_message");
  export const StartedBot = Symbol("started_bot");
  export const StoppedBot = Symbol("stopped_bot");
  export const UpdatedPayment = Symbol("updated_payment");
  export const UpdatedMessage = Symbol("updated_message");
  export const Update = Symbol("update");

  export type Map = {
    [Command]: [ctx: Context<CommandUpdate>, next: Next];
    [Contact]: [ctx: Context<ContactUpdate>, next: Next];
    [Error]: [err: Error | string | unknown, next: Next];
    [NewMessage]: [ctx: Context<NewMessageUpdate>, next: Next];
    [RemovedMessage]: [ctx: Context<RemovedMessageUpdate>, next: Next];
    [StartedBot]: [ctx: Context<StartedBotUpdate>, next: Next];
    [StoppedBot]: [ctx: Context<StoppedBotUpdate>, next: Next];
    [UpdatedPayment]: [ctx: Context<UpdatedPaymentUpdate>, next: Next];
    [UpdatedMessage]: [ctx: Context<UpdatedMessageUpdate>, next: Next];
    [Update]: [ctx: Context, next: Next];
  };

  /**
   * A lazy-loadable event listener wrapper.
   */
  export type BotEventInstaller<C, K extends keyof Map> = (events: C) => (...args: Map[K]) => void;
}

let s: RubigrafEvents.Map[typeof RubigrafEvents.NewMessage];

export { RubigrafEvents };
