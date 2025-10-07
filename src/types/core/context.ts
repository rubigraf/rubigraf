import {
  BaseContext,
  CommandContext,
  ContactContext,
  FileContext,
  ForwardedFromContext,
  LiveLocationContext,
  LocationContext,
  NewMessageContext,
  PollContext,
  QueryContext,
  RemovedMessageContext,
  StartedBotContext,
  StickerContext,
  StoppedBotContext,
  UpdatedMessageContext,
  UpdatedPaymentContext,
} from "../../core/contexts";
import type {
  CommandUpdate,
  ContactUpdate,
  FileUpdate,
  ForwardedFromUpdate,
  LiveLocationUpdate,
  LocationUpdate,
  NewMessageUpdate,
  PollUpdate,
  QueryUpdate,
  RemovedMessageUpdate,
  StartedBotUpdate,
  StickerUpdate,
  StoppedBotUpdate,
  Update,
  UpdatedMessageUpdate,
  UpdatedPaymentUpdate,
} from "../rubika";

type Context<T extends Update = Update> = T extends CommandUpdate
  ? CommandContext
  : T extends ContactUpdate
  ? ContactContext
  : T extends FileUpdate
  ? FileContext
  : T extends ForwardedFromUpdate
  ? ForwardedFromContext
  : T extends LiveLocationUpdate
  ? LiveLocationContext
  : T extends LocationUpdate
  ? LocationContext
  : T extends LocationUpdate
  ? LocationContext
  : T extends PollUpdate
  ? PollContext
  : T extends StickerUpdate
  ? StickerContext
  : T extends QueryUpdate
  ? QueryContext
  : T extends NewMessageUpdate
  ? NewMessageContext
  : T extends RemovedMessageUpdate
  ? RemovedMessageContext
  : T extends StartedBotUpdate
  ? StartedBotContext
  : T extends StoppedBotUpdate
  ? StoppedBotContext
  : T extends UpdatedMessageUpdate
  ? UpdatedMessageContext
  : T extends UpdatedPaymentUpdate
  ? UpdatedPaymentContext
  : BaseContext<T>;

export type { Context };
