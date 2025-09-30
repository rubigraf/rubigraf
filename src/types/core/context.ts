import {
  BaseContext,
  CommandContext,
  ContactContext,
  NewMessageContext,
  RemovedMessageContext,
  StartedBotContext,
  StoppedBotContext,
  UpdatedMessageContext,
  UpdatedPaymentContext,
} from "../../core/contexts";
import type {
  CommandUpdate,
  ContactUpdate,
  NewMessageUpdate,
  RemovedMessageUpdate,
  StartedBotUpdate,
  StoppedBotUpdate,
  Update,
  UpdatedMessageUpdate,
  UpdatedPaymentUpdate,
} from "../rubika";

type Context<T extends Update = Update> = T extends CommandUpdate
  ? CommandContext
  : T extends ContactUpdate
  ? ContactContext
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
