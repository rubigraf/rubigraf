import { parseCommand } from "../../../hooks";
import { CommandUpdate } from "../../../types";
import Rubigraf from "../../rubigraf";
import { BaseCustomContext } from "./base";

/**
 * Context related to `NewMessage` update but with Command specifics.
 *
 * @package rubigraf
 * @since v1.0.0
 */
class CommandContext extends BaseCustomContext<CommandUpdate> {
  private cmd: string | null = null;
  private subCommands: string[] = [];

  constructor(update: CommandUpdate, bot: Rubigraf) {
    super(update, bot);

    const { cmd, subCommands } = parseCommand(this.message.text);
    this.cmd = cmd;
    this.subCommands = subCommands;
  }

  /**
   * Get the command from the message.
   *
   * @example
   * ```ts
   * if (ctx.command === "start") {
   *   // do something
   * }
   * ```
   *
   * @since v1.0.0
   */
  public get command() {
    return this.cmd;
  }

  /**
   * Get the message related to `NewMessage` update but for {@link CommandContext}.
   *
   * @since v1.0.0
   */
  public get message() {
    return this.update.new_message;
  }

  /**
   * Get the subcommands from the message.
   *
   * @example
   * ```ts
   * if (ctx.subCommand[0] === "option1" || ctx.subCommand[0] === "some text goes here") {
   *   // do something
   * }
   * ```
   *
   * @since v1.0.0
   */
  public get subCommand() {
    return this.subCommands.length > 0 ? this.subCommands : null;
  }
}

export { CommandContext };
