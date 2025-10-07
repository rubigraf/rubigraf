import {
  CommandContext,
  ContactContext,
  NewMessageContext,
  UpdatedMessageContext,
  RemovedMessageContext,
  StartedBotContext,
  StoppedBotContext,
  UpdatedPaymentContext,
  BaseContext,
  FileContext,
  ForwardedFromContext,
  LiveLocationContext,
  LocationContext,
  PollContext,
  StickerContext,
  QueryContext,
} from "../core/contexts";
import Rubigraf from "../core/rubigraf";
import { UpdateTypeEnum } from "../enums";
import { isCommand } from "../helper";
import type {
  Update,
  CommandUpdate,
  ContactUpdate,
  Context,
  FileUpdate,
  ForwardedFromUpdate,
  LiveLocationUpdate,
  LocationUpdate,
  PollUpdate,
  StickerUpdate,
  QueryUpdate,
} from "../types";

/**
 * Creates a new context based on {@link U Update}'s type.
 *
 * @param update Used to determine type and create correct context based on it
 * @param bot Used for context creation
 * @returns Context
 */
function createContext<U extends Update>(update: U, bot: Rubigraf): Context<U> {
  switch (update.type) {
    case UpdateTypeEnum.NewMessage:
      const m = update.new_message;

      if (isCommand(m.text || "")) {
        return new CommandContext(update as CommandUpdate, bot) as Context<U>;
      }

      if (m.contact_message) {
        return new ContactContext(update as ContactUpdate, bot) as Context<U>;
      }

      if (m.file) {
        return new FileContext(update as FileUpdate, bot) as Context<U>;
      }

      if (m.forwarded_from) {
        return new ForwardedFromContext(update as ForwardedFromUpdate, bot) as Context<U>;
      }

      if (m.live_location) {
        return new LiveLocationContext(update as LiveLocationUpdate, bot) as Context<U>;
      }

      if (m.location) {
        return new LocationContext(update as LocationUpdate, bot) as Context<U>;
      }

      if (m.poll) {
        return new PollContext(update as PollUpdate, bot) as Context<U>;
      }

      if (m.sticker) {
        return new StickerContext(update as StickerUpdate, bot) as Context<U>;
      }

      if (m.aux_data) {
        return new QueryContext(update as QueryUpdate, bot) as Context<U>;
      }

      return new NewMessageContext(update, bot) as Context<U>;

    case UpdateTypeEnum.UpdatedMessage:
      return new UpdatedMessageContext(update, bot) as Context<U>;

    case UpdateTypeEnum.RemovedMessage:
      return new RemovedMessageContext(update, bot) as Context<U>;

    case UpdateTypeEnum.StartedBot:
      return new StartedBotContext(update, bot) as Context<U>;

    case UpdateTypeEnum.StoppedBot:
      return new StoppedBotContext(update, bot) as Context<U>;

    case UpdateTypeEnum.UpdatedPayment:
      return new UpdatedPaymentContext(update, bot) as Context<U>;

    default:
      return new BaseContext(update, bot) as Context<U>;
  }
}

export { createContext };
