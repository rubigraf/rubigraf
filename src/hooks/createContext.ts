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
} from "../core/contexts";
import Rubigraf from "../core/rubigraf";
import { UpdateTypeEnum } from "../enums";
import { isCommand } from "../helper";
import { Update, CommandUpdate, ContactUpdate, Context, FileUpdate } from "../types";

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
      if (isCommand(update.new_message.text || "")) {
        return new CommandContext(update as CommandUpdate, bot) as Context<U>;
      }

      if (update.new_message.contact_message) {
        return new ContactContext(update as ContactUpdate, bot) as Context<U>;
      }

      if (update.new_message.file) {
        return new FileContext(update as FileUpdate, bot) as Context<U>;
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
