import Logger from "../core/log/logger";
import type {
  CommandUpdate,
  ContactUpdate,
  Context,
  FileUpdate,
  ForwardedFromUpdate,
  LiveLocationUpdate,
  LocationUpdate,
  NewMessageUpdate,
  Next,
  PollUpdate,
  QueryUpdate,
  RemovedMessageUpdate,
  RubigrafPayload,
  StartedBotUpdate,
  StickerUpdate,
  StoppedBotUpdate,
  UpdatedMessageUpdate,
  UpdatedPaymentUpdate,
} from "../types";

namespace RubigrafEvents {
  export const Command = Symbol("command");
  export const Contact = Symbol("contact");
  export const Error = Symbol("error");
  export const File = Symbol("file");
  export const ForwardedFrom = Symbol("forwarded_from");
  export const LiveLocation = Symbol("live_location");
  export const Location = Symbol("location");
  export const NewMessage = Symbol("new_message");
  export const Poll = Symbol("poll");
  export const Query = Symbol("query");
  export const RemovedMessage = Symbol("removed_message");
  export const StartedBot = Symbol("started_bot");
  export const Sticker = Symbol("sticker");
  export const StoppedBot = Symbol("stopped_bot");
  export const UpdatedPayment = Symbol("updated_payment");
  export const UpdatedMessage = Symbol("updated_message");
  export const Update = Symbol("update");

  export type Map = {
    [Command]: [ctx: Context<CommandUpdate>, payload: RubigrafPayload, next: Next];
    [Contact]: [ctx: Context<ContactUpdate>, payload: RubigrafPayload, next: Next];
    [Error]: [err: Error | string | unknown, logger: Logger];
    [File]: [ctx: Context<FileUpdate>, payload: RubigrafPayload, next: Next];
    [ForwardedFrom]: [ctx: Context<ForwardedFromUpdate>, payload: RubigrafPayload, next: Next];
    [LiveLocation]: [ctx: Context<LiveLocationUpdate>, payload: RubigrafPayload, next: Next];
    [Location]: [ctx: Context<LocationUpdate>, payload: RubigrafPayload, next: Next];
    [NewMessage]: [ctx: Context<NewMessageUpdate>, payload: RubigrafPayload, next: Next];
    [Poll]: [ctx: Context<PollUpdate>, payload: RubigrafPayload, next: Next];
    [Query]: [ctx: Context<QueryUpdate>, payload: RubigrafPayload, next: Next];
    [RemovedMessage]: [ctx: Context<RemovedMessageUpdate>, payload: RubigrafPayload, next: Next];
    [StartedBot]: [ctx: Context<StartedBotUpdate>, payload: RubigrafPayload, next: Next];
    [Sticker]: [ctx: Context<StickerUpdate>, payload: RubigrafPayload, next: Next];
    [StoppedBot]: [ctx: Context<StoppedBotUpdate>, payload: RubigrafPayload, next: Next];
    [UpdatedPayment]: [ctx: Context<UpdatedPaymentUpdate>, payload: RubigrafPayload, next: Next];
    [UpdatedMessage]: [ctx: Context<UpdatedMessageUpdate>, payload: RubigrafPayload, next: Next];
    [Update]: [ctx: Context, payload: RubigrafPayload, next: Next];
  };

  export type NonErrorEvents = Exclude<keyof Map, typeof Error>;

  /**
   * A lazy-loadable event listener wrapper.
   */
  export type BotEventInstaller<C, K extends keyof Map> = (events: C) => (...args: Map[K]) => void;
}

export { RubigrafEvents };
