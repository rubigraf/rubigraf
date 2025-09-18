import { Update } from "../../types";
import Rubigraf from "../rubigraf";

/**
 * Generic abstract context for a dynamic {@link Update} type.
 *
 * @template T Update subtype (defaults to the full union)
 * @package rubigraf
 * @since v1.0.0
 */
class BaseContext<T extends Update = Update> {
  constructor(
    /** The raw update object */
    public readonly update: T,
    /** Reference to the bot instance */
    public readonly bot: Rubigraf
  ) {}

  /**
   * Get the type of this update.
   *
   * @since v1.0.0
   */
  public get type() {
    return this.update.type;
  }

  /**
   * Get the chat ID of this update.
   *
   * @since v1.0.0
   */
  public get chatId() {
    return this.update.chat_id;
  }

  /**
   * Send a reply to the current chat.
   *
   * @param text Text message to send
   * @since v1.0.0
   */
  reply(text: string) {
    return this.bot.sendMessage(this.chatId, text);
  }

  public async getMe() {
    return await this.bot.getMe();
  }
}

export { BaseContext };
