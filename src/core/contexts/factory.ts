import { UpdateTypeEnum } from "../../enums";
import { isCommand } from "../../helper";
import { CommandUpdate, ContactUpdate, Context, Update } from "../../types";
import Rubigraf from "../rubigraf";
import { BaseContext } from "./base";
import { CommandContext, ContactContext, NewMessageContext, UpdatedMessageContext } from ".";
import { RemovedMessageContext } from "./removeMessage";
import { StartedBotContext } from "./startedBot";
import { StoppedBotContext } from "./stoppedBot";
import { UpdatedPaymentContext } from "./updatedPayment";

/**
 *
 * @param update
 * @param bot
 * @returns
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
