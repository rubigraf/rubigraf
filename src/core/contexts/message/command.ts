import { CommandUpdate } from "../../../types";
import Rubigraf from "../../rubigraf";
import { BaseMessageContext } from "./base";

/**
 * Context related to `NewMessage` update but with Command specifics.
 *
 * @package rubigraf
 * @since v1.0.0
 */
class CommandContext extends BaseMessageContext<CommandUpdate> {
  private subCommands: string[] = [];
  private cmd: string | null = null;

  constructor(update: CommandUpdate, bot: Rubigraf) {
    super(update, bot);

    const splited = update.new_message.text?.match(/"([^"]+)"|(\S+)/g) ?? [];
    if (splited.length > 0) {
      this.cmd = splited[0]?.slice(1) || null;
      if (splited.length > 1) {
        this.subCommands = splited.slice(1).map((s) => s.replace(/(^")|("$)/g, ""));
      }
    }
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
