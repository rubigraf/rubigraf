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
   * @param replyTo The message ID to reply to
   * @param disableNotification Whether notification should be disabled or not
   * @since v1.0.0
   */
  reply(text: string, replyTo?: string, disableNotification?: boolean) {
    return this.bot.sendMessage(this.chatId, text, {
      replyToMessageId: replyTo,
      disableNotification,
    });
  }

  /**
   * Gets bot's information.
   *
   * @since v1.0.0
   */
  public async getMe() {
    return await this.bot.getMe();
  }

  /**
   * Send a poll to a chat.
   *
   * @param question Question text content
   * @param options Poll's options
   * @param replyTo The message ID to reply to
   * @param disableNotification Whether notification should be disabled or not
   * @since v1.0.0
   */
  public async sendPoll(
    question: string,
    options: string[],
    replyTo?: string,
    disableNotification?: boolean
  ) {
    return await this.bot.sendPoll(this.chatId, question, options, {
      replyToMessageId: replyTo,
      disableNotification,
    });
  }

  /**
   * Send a location to a chat.
   *
   * @param latitude Latitude of the location
   * @param longitude Longitude of the location
   * @param replyTo The message ID to reply to
   * @param disableNotification Whether notification should be disabled or not
   * @since v1.0.0
   */
  public async sendLocation(
    latitude: string,
    longitude: string,
    replyTo?: string,
    disableNotification?: boolean
  ) {
    return await this.bot.sendLocation(this.chatId, latitude, longitude, {
      replyToMessageId: replyTo,
      disableNotification,
    });
  }

  /**
   * Send a contact to a chat.
   *
   * @param firstName The first name of the contact
   * @param lastName The last name of the contact
   * @param phone The phone number of the contact (notice: don't put 0 at first)
   * @since v1.0.0
   */
  public async sendContact(
    firstName: string,
    lastName: string,
    phone: number,
    replyTo?: string,
    disableNotification?: boolean
  ) {
    return await this.bot.sendContact(
      this.chatId,
      firstName,
      lastName,
      phone.toString().startsWith("98") ? phone : parseInt(`98${phone}`),
      {
        replyToMessageId: replyTo,
        disableNotification,
      }
    );
  }

  /**
   * Gets a chat by message ID.
   *
   * @since v1.0.0
   */
  public async getChat() {
    return await this.bot.getChat(this.chatId);
  }
}

export { BaseContext };
