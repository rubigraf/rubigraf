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
} from "../core/contexts";
import Rubigraf from "../core/rubigraf";
import { UpdateTypeEnum } from "../enums";
import { isCommand } from "../helper";
import { Update, CommandUpdate, ContactUpdate, Context } from "../types";

/**
 * Parses command and sub commands
 *
 * @param text The text to parse command/sub commands
 * @returns Parsed command and sub commands
 */
function parseCommand(text?: string) {
  let cmd: string | null = null;
  let subCommands: string[] = [];

  const splited = text?.match(/"([^"]+)"|(\S+)/g) ?? [];
  if (splited.length > 0) {
    cmd = splited[0]?.slice(1) || null;
    if (splited.length > 1) {
      subCommands = splited.slice(1).map((s) => s.replace(/(^")|("$)/g, ""));
    }
  }

  return { cmd, subCommands };
}

export { parseCommand };
