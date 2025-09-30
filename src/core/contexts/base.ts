import { ChatKeypadTypeEnum, UpdateEndpointTypeEnum } from "../../enums";
import type { BotCommand, Keypad, Update } from "../../types";
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

  /**
   * Forwards a message to a chat by message ID.
   *
   * @param originChatId Origin chat ID
   * @param destChatId Destination chat ID
   * @param messageId Target message ID
   * @param disableNotif Whether to disable notification or not
   *
   * @since v1.0.0
   */
  public async forwardMessage(
    originChatId: string,
    destChatId: string,
    messageId: string,
    disableNotif?: boolean
  ) {
    return await this.bot.forwardMessage(originChatId, destChatId, messageId, disableNotif);
  }

  /**
   * Edits a message by their chat and message ID.
   *
   * @param messageId Target message ID (Will use current `chat_id` if not provided)
   * @param text The new text to replace with old one
   * @param chatId Target chat ID (will use current {@link Update}'s `chat_id` if not provided)
   *
   * @since v1.0.0
   */
  public async editMessageText(messageId: string, text: string, chatId?: string) {
    await this.bot.editMessageText(chatId || this.chatId, messageId, text);
  }

  /**
   * Edits a keypad by their chat and message ID.
   *
   * @param messageId Target message ID
   * @param keypad The new keypad to replace with old one
   * @param chatId Target chat ID (Will use current {@link Update}'s `chat_id` if not provided)
   *
   * @since v1.0.0
   */
  public async editMessageKeypad(messageId: string, keypad: Keypad, chatId?: string) {
    await this.bot.editMessageKeypad(chatId || this.chatId, messageId, keypad);
  }

  /**
   * Deletes a message by their chat and message ID.
   *
   * @param messageId Target message ID
   * @param chatId Target chat ID (Will use current {@link Update}'s `chat_id` if not provided)
   *
   * @since v1.0.0
   */
  public async deleteMessage(messageId: string, chatId?: string) {
    await this.bot.deleteMessage(chatId || this.chatId, messageId);
  }

  /**
   * Sets a list of commands for bot.
   *
   * @param commands The list of commands
   *
   * @since v1.0.0
   */
  public async setCommands(commands: BotCommand[]): Promise<void> {
    await this.bot.setCommands(commands);
  }

  /**
   * Sets a Webhook for the bot to get updates.
   *
   * @param url The url of the webhook
   * @param type The type of the webhook
   *
   * @since v1.0.0
   */
  public async setWebhook(url: string, type: UpdateEndpointTypeEnum): Promise<void> {
    await this.bot.setWebhook(url, type);
  }

  /**
   * Sets a chat keypad into the chat.
   *
   * @param chatId Target chat ID
   * @param keypad The keypad to apply
   *
   * @since v1.0.0
   */
  public async setChatKeypad(chatId: string, keypad: Keypad): Promise<void> {
    await this.bot.editChatKeypad(chatId, ChatKeypadTypeEnum.New, keypad);
  }

  /**
   * Clears chat keypad from the chat.
   *
   * @param chatId Target chat ID
   *
   * @since v1.0.0
   */
  public async clearChatKeypad(chatId: string): Promise<void> {
    await this.bot.editChatKeypad(chatId, ChatKeypadTypeEnum.Remove);
  }
}

export { BaseContext };
