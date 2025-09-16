import { CommandUpdate } from "../../../types";
import { BaseMessageContext } from "./base";

/**
 * Context related to `NewMessage` update but with Command specifics.
 *
 * @package rubigraf
 * @since v1.0.0
 */
class CommandContext extends BaseMessageContext<CommandUpdate> {
  private static subCommands: string[] = [];

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
    const splited = this.message.text?.split(" ");
    if (!splited || splited.length === 0) return null;
    if (splited.length > 1) CommandContext.subCommands = splited.slice(1);

    return splited[0].slice(1) ?? null;
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
   * if (ctx.subCommand[0] === "option1") {
   *   // do something
   * }
   * ```
   *
   * @since v1.0.0
   */
  public get subCommand() {
    return CommandContext.length > 0 ? CommandContext.subCommands : null;
  }
}

export { CommandContext };
