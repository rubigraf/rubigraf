import Event from "./event";
import type {
  Update,
  Message,
  APIResponse,
  RubigrafOptions,
  NewMessageUpdate,
  RemovedMessageUpdate,
  StartedBotUpdate,
  StoppedBotUpdate,
  UpdatedMessageUpdate,
  UpdatedPaymentUpdate,
  Middleware,
  CommandUpdate,
  Bot,
  SendMessageOptions,
  Chat,
  Keypad,
  BotCommand,
  ContactUpdate,
  FileUpdate,
  ForwardedFromUpdate,
  LiveLocationUpdate,
  LocationUpdate,
  PollUpdate,
  StickerUpdate,
  QueryUpdate,
  WebhookAPIStatus,
} from "../types";
import { compose } from "./middleware";
import { RubigrafEvents } from "../symbols";
import { ChatKeypadTypeEnum, FileTypeEnum, UpdateEndpointTypeEnum, UpdateTypeEnum } from "../enums";
import { Context } from "../types";
import { createContext } from "../hooks";
import { getFileType, isCommand, next } from "../helper";
import { EditChatKeypadError, MethodError, PollLengthError, WebhookConfigError } from "../errors";
import { FetchEngine, HTTPClient } from "./network";
import FormData from "form-data";
import Logger from "./log/logger";

const DEFAULT_OPTS: RubigrafOptions = {
  baseURL: "https://botapi.rubika.ir/v3/",
  freshnessWindow: 5,
  polling: {
    pollIntervalMs: 0,
  },
};

/**
 * Main Bot class.
 *
 * Handles long-polling updates, middleware execution, and event dispatching.
 *
 * @package rubigraf
 * @since v1.0.0
 */
class Rubigraf extends Event {
  private http: HTTPClient;
  private engine: FetchEngine;
  private logger: Logger;
  private middlewares: Middleware[] = [];
  private composed = compose([]);

  /**
   * Create a new Rubigraf instance.
   *
   * @param token Bot token
   * @param opts Optional configuration
   *
   * @since v1.0.0
   */
  constructor(private token: string, private opts: Partial<RubigrafOptions> = {}) {
    super();
    this.opts = {
      baseURL: opts.baseURL ?? DEFAULT_OPTS.baseURL,
      freshnessWindow: opts.freshnessWindow ?? DEFAULT_OPTS.freshnessWindow,
      logger: { ...DEFAULT_OPTS.logger, ...opts.logger },
      polling: opts.webhook === undefined ? opts.polling ?? DEFAULT_OPTS.polling : undefined,
      webhook: !opts.polling ? opts.webhook : undefined,
    } as RubigrafOptions;
    const pollIntervalMs =
      typeof opts.polling !== "boolean" && opts.polling !== undefined
        ? opts.polling.pollIntervalMs
        : 0;
    this.http = new HTTPClient({
      baseURL: this.opts.baseURL!,
      token,
      onError: (err) => this.emitError(err),
    });
    this.logger = new Logger({ ...this.opts.logger });
    this.engine = new FetchEngine(
      this.http,
      {
        freshnessWindow: opts.freshnessWindow ?? DEFAULT_OPTS.freshnessWindow,
        pollIntervalMs,
      },
      this.logger.child("Engine"),
      this.handleUpdate.bind(this),
      (err) => this.emitError(err)
    );
    this.composed = compose(this.middlewares);
  }

  /**
   * Register a middleware.
   *
   * @param mw Middleware function
   *
   * @since v1.0.0
   */
  use(mw: Middleware) {
    this.middlewares.push(mw);
    this.composed = compose(this.middlewares);
    return this;
  }

  /**
   * @param payload The payload
   * @param opts The options of message
   * @returns The payload
   *
   * @since v1.0.0
   */
  private fillSendMessagePayload<T extends Record<string, any>>(
    payload: T,
    opts?: SendMessageOptions
  ): T {
    if (!opts) return payload;

    if (opts.chatKeypad) (payload.chat_keypad as any) = opts.chatKeypad;
    if (opts.chatKeypadType) (payload.chat_keypad_type as any) = opts.chatKeypadType;
    if (opts.disableNotification) (payload.disable_notification as any) = opts.disableNotification;
    if (opts.inlineKeypad) (payload.inline_keypad as any) = opts.inlineKeypad;
    if (opts.replyToMessageId) (payload.reply_to_message_id as any) = opts.replyToMessageId;

    return payload;
  }

  /**
   * Gets bot's info.
   *
   * @since v1.0.0
   */
  async getMe(): Promise<Bot> {
    const res = await this.http.request<APIResponse<Record<"bot", Bot>>>("POST", "getMe");

    if (res.status !== "OK") throw new MethodError("getMe", res.status);

    return res.data.bot;
  }

  /**
   * Send a message to a chat.
   *
   * @param chatId Target chat ID
   * @param text Message content
   * @param opts Send message options
   *
   * @returns The ID of the sent message
   *
   * @since v1.0.0
   */
  async sendMessage(
    chatId: string,
    text: string,
    opts?: SendMessageOptions
  ): Promise<Message["message_id"]> {
    const payload: Record<string, any> = this.fillSendMessagePayload(
      {
        chat_id: chatId,
        text,
      },
      opts
    );

    const res = await this.http.request<APIResponse<{ message_id: Message["message_id"] }>>(
      "POST",
      "sendMessage",
      payload
    );

    if (res.status !== "OK") throw new MethodError("sendMessage", res.status);

    return res.data.message_id;
  }

  /**
   * Send a poll to a chat.
   *
   * @param chatId Target chat ID
   * @param question Question text content
   * @param options Poll's options
   * @param opts Send message options
   *
   * @returns The ID of the sent message
   *
   * @since v1.0.0
   */
  async sendPoll(
    chatId: string,
    question: string,
    options: string[],
    opts?: SendMessageOptions
  ): Promise<Message["message_id"]> {
    if (!options.length) throw new PollLengthError();

    const payload = this.fillSendMessagePayload(
      {
        chat_id: chatId,
        question,
        options,
      },
      opts
    );

    const res = await this.http.request<APIResponse<{ message_id: Message["message_id"] }>>(
      "POST",
      "sendPoll",
      payload
    );

    if (res.status !== "OK") throw new MethodError("sendPoll", res.status);

    return res.data.message_id;
  }

  /**
   * Send a location to a chat.
   *
   * @param chatId Target chat ID
   * @param latitude Latitude of the location
   * @param longitude Longitude of the location
   * @param opts Send message options
   *
   * @returns The ID of the sent message
   *
   * @since v1.0.0
   */
  async sendLocation(
    chatId: string,
    latitude: string,
    longitude: string,
    opts?: SendMessageOptions
  ): Promise<Message["message_id"]> {
    const payload = this.fillSendMessagePayload(
      {
        chat_id: chatId,
        latitude,
        longitude,
      },
      opts
    );

    const res = await this.http.request<APIResponse<{ message_id: Message["message_id"] }>>(
      "POST",
      "sendLocation",
      payload
    );

    if (res.status !== "OK") throw new MethodError("sendLocation", res.status);

    return res.data.message_id;
  }

  /**
   * Send a contact to a chat.
   *
   * @param chatId Target chat ID
   * @param firstName The first name of the contact
   * @param lastName The last name of the contact
   * @param phone The phone number of the contact (notice: don't put 0 at first)
   * @param opts Send message options
   *
   * @returns The ID of the sent message
   *
   * @since v1.0.0
   */
  async sendContact(
    chatId: string,
    firstName: string,
    lastName: string,
    phone: number,
    opts?: SendMessageOptions
  ): Promise<Message["message_id"]> {
    const payload = this.fillSendMessagePayload(
      {
        chat_id: chatId,
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
      },
      opts
    );

    const res = await this.http.request<APIResponse<{ message_id: Message["message_id"] }>>(
      "POST",
      "sendContact",
      payload
    );

    if (res.status !== "OK") throw new MethodError("sendContact", res.status);

    return res.data.message_id;
  }

  /**
   * Gets a chat by message ID.
   *
   * @param chatId Target chat ID
   *
   * @returns The Chat type
   *
   * @since v1.0.0
   */
  async getChat(chatId: string): Promise<Chat> {
    const res = await this.http.request<APIResponse<{ chat: Chat }>>("POST", "getChat", {
      chat_id: chatId,
    });

    if (res.status !== "OK") throw new MethodError("getChat", res.status);

    return res.data.chat;
  }

  /**
   * Forwards a message to a chat by message ID.
   *
   * @param origin Origin chat ID
   * @param destination Destination chat ID
   * @param messageId Target message ID
   * @param disable_notification Whether to disable notification or not
   *
   * @returns The new message ID
   *
   * @since v1.0.0
   */
  async forwardMessage(
    origin: string,
    destination: string,
    messageId: string,
    disable_notification?: boolean
  ): Promise<Message["message_id"]> {
    const res = await this.http.request<APIResponse<{ new_message_id: Message["message_id"] }>>(
      "POST",
      "forwardMessage",
      {
        from_chat_id: origin,
        message_id: messageId,
        to_chat_id: destination,
        disable_notification,
      }
    );

    if (res.status !== "OK") throw new MethodError("forwardMessage", res.status);

    return res.data.new_message_id;
  }

  /**
   * Edits a message by their chat and message ID.
   *
   * @param chatId Target chat ID
   * @param messageId Target message ID
   * @param text The new text to replace with old one
   *
   * @since v1.0.0
   */
  async editMessageText(chatId: string, messageId: string, text: string): Promise<void> {
    const res = await this.http.request<APIResponse<null>>("POST", "editMessageText", {
      chat_id: chatId,
      message_id: messageId,
      text,
    });

    if (res.status !== "OK") throw new MethodError("editMessageText", res.status);
  }

  /**
   * Edits a keypad by their chat and message ID.
   *
   * @param chatId Target chat ID
   * @param messageId Target message ID
   * @param keypad The new keypad to replace with old one
   *
   * @since v1.0.0
   */
  async editMessageKeypad(chatId: string, messageId: string, keypad: Keypad): Promise<void> {
    const res = await this.http.request<APIResponse<null>>("POST", "editMessageKeypad", {
      chat_id: chatId,
      message_id: messageId,
      inline_keypad: keypad,
    });

    if (res.status !== "OK") throw new MethodError("editMessageKeypad", res.status);
  }

  /**
   * Deletes a message by their chat and message ID.
   *
   * @param chatId Target chat ID
   * @param messageId Target message ID
   *
   * @since v1.0.0
   */
  async deleteMessage(chatId: string, messageId: string): Promise<void> {
    const res = await this.http.request<APIResponse<null>>("POST", "deleteMessage", {
      chat_id: chatId,
      message_id: messageId,
    });

    if (res.status !== "OK") throw new MethodError("deleteMessage", res.status);
  }

  /**
   * Sets a list of commands for bot.
   *
   * @param commands The list of commands
   *
   * @since v1.0.0
   */
  async setCommands(commands: BotCommand[]): Promise<void> {
    const res = await this.http.request<APIResponse<null>>("POST", "setCommands", {
      bot_commands: commands,
    });

    if (res.status !== "OK") throw new MethodError("setCommands", res.status);
  }

  /**
   * Sets a Webhook for the bot to get updates.
   *
   * @param url The url of the webhook
   * @param type The type of the webhook
   *
   * @since v1.0.0
   */
  private async setWebhook(url: string, type: UpdateEndpointTypeEnum): Promise<void> {
    const maxRetries = 3;
    const retryDelay = 2000;

    const requestWebhook = async () => {
      const res = await this.http.request<APIResponse<{ status: WebhookAPIStatus }>>(
        "POST",
        "updateBotEndpoints",
        { url, type }
      );

      if (res.data.status !== "Done") {
        throw new MethodError("updateBotEndpoints", res.data.status);
      }
    };

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await requestWebhook();
        this.logger.debug(`Webhook successfully set on attempt ${attempt}.`);
        return;
      } catch (err) {
        this.logger.warn(`Webhook setup failed (attempt ${attempt}/${maxRetries});`, err);

        if (attempt < maxRetries) {
          const delay = retryDelay * attempt;
          this.logger.debug(`Retrying in ${delay / 1000}s...`);
          await new Promise((res) => setTimeout(res, delay));
        } else {
          this.logger.error("Webhook setup failed after all retries.");
          throw err;
        }
      }
    }
  }

  /**
   * Edits or removes a keypad into the chat.
   *
   * @param chatId Target chat ID
   * @param type Type of edit to apply to the keypad
   * @param keypad It is required if `type` param is set to the {@link ChatKeypadTypeEnum.New New}
   *
   * @since v1.0.0
   */
  async editChatKeypad<T extends ChatKeypadTypeEnum.New | ChatKeypadTypeEnum.Remove>(
    chatId: string,
    type: T,
    keypad: T extends ChatKeypadTypeEnum.New ? Keypad : undefined = undefined as any
  ): Promise<void> {
    if (type === ChatKeypadTypeEnum.New && keypad === undefined) throw new EditChatKeypadError();

    let payload: any = {
      chat_id: chatId,
      chat_keypad_type: type,
    };

    if (type === ChatKeypadTypeEnum.New) {
      payload.chat_keypad = keypad;
    }

    const res = await this.http.request<APIResponse<null>>("POST", "editChatKeypad", payload);

    if (res.status !== "OK") throw new MethodError("editChatKeypad", res.status);
  }

  /**
   * Gets file's download url.
   *
   * @param fileId Target file ID
   *
   * @since v1.2.0
   */
  async getFile(fileId: string): Promise<string> {
    const res = await this.http.request<APIResponse<{ download_url: string }>>("POST", "getFile", {
      file_id: fileId,
    });

    if (res.status !== "OK") throw new MethodError("getFile", res.status);

    return res.data.download_url;
  }

  /**
   * Uploads a file.
   *
   * @param chatId Target chat ID
   * @param file The file to send
   * @param text Optionally text with the file
   * @param opts Options to send alongside with file
   *
   * @since v1.2.0
   */
  async sendFile(
    chatId: string,
    file: File,
    text?: string,
    opts?: SendMessageOptions
  ): Promise<Message["message_id"] | null> {
    const type = getFileType(file.type as any);
    const { file_id, status } = await this.requestSendFile(file, type);

    if (status) return null;

    const payload = this.fillSendMessagePayload(
      {
        chat_id: chatId,
        file_id,
        text,
      },
      opts
    );

    const res = await this.http.request<APIResponse<Pick<Message, "message_id">>>(
      "POST",
      "sendFile",
      payload
    );

    if (res.status !== "OK") throw new MethodError("sendFile", res.status);

    return res.data.message_id;
  }

  /**
   * @param file The file
   * @returns The `file_id`
   *
   * @since v1.2.0
   */
  private async requestSendFile(file: File, type: FileTypeEnum) {
    const formData = new FormData({ autoDestroy: true });
    const filename = file.name;
    const contentType = file.type;

    try {
      const hasArrayBuffer = typeof file.arrayBuffer === "function";
      if (hasArrayBuffer) {
        const buf = Buffer.from(await file.arrayBuffer());
        formData.append("file", buf, { filename, contentType });
      } else {
        formData.append("file", file, { filename, contentType });
      }
    } catch (err) {
      formData.append("file", file, { filename, contentType });
      this.emitError(err);
    }

    return await this.http.upload(formData, type);
  }

  private async emitError(error: unknown) {
    this.emitSync(RubigrafEvents.Error, error, this.logger.child("ErrorEvent"));
  }

  /**
   * Handle a single update.
   *
   * @param update Update payload from API
   *
   * @since v1.0.0
   */
  async handleUpdate<U extends Update>(update: U) {
    try {
      const ctx = <T extends Update>(): Context<T> =>
        createContext<T>(update as unknown as T, this);
      await this.composed(ctx<U>(), async () => {});

      switch (update.type) {
        case UpdateTypeEnum.NewMessage:
          const m = update.new_message;

          if (isCommand(m.text || "")) {
            await this.emitAsync(RubigrafEvents.Command, ctx<CommandUpdate>(), {}, next);
          }

          if (m.contact_message) {
            await this.emitAsync(RubigrafEvents.Contact, ctx<ContactUpdate>(), {}, next);
          }

          if (m.file) {
            await this.emitAsync(RubigrafEvents.File, ctx<FileUpdate>(), {}, next);
          }

          if (m.forwarded_from) {
            await this.emitAsync(
              RubigrafEvents.ForwardedFrom,
              ctx<ForwardedFromUpdate>(),
              {},
              next
            );
          }

          if (m.live_location) {
            await this.emitAsync(RubigrafEvents.LiveLocation, ctx<LiveLocationUpdate>(), {}, next);
          }

          if (m.location) {
            await this.emitAsync(RubigrafEvents.Location, ctx<LocationUpdate>(), {}, next);
          }

          if (m.poll) {
            await this.emitAsync(RubigrafEvents.Poll, ctx<PollUpdate>(), {}, next);
          }

          if (m.sticker) {
            await this.emitAsync(RubigrafEvents.Sticker, ctx<StickerUpdate>(), {}, next);
          }

          if (m.aux_data) {
            await this.emitAsync(RubigrafEvents.Query, ctx<QueryUpdate>(), {}, next);
          }

          await this.emitAsync(RubigrafEvents.NewMessage, ctx<NewMessageUpdate>(), {}, next);
          break;

        case UpdateTypeEnum.RemovedMessage:
          await this.emitAsync(
            RubigrafEvents.RemovedMessage,
            ctx<RemovedMessageUpdate>(),
            {},
            next
          );
          break;

        case UpdateTypeEnum.StartedBot:
          await this.emitAsync(RubigrafEvents.StartedBot, ctx<StartedBotUpdate>(), {}, next);
          break;

        case UpdateTypeEnum.StoppedBot:
          await this.emitAsync(RubigrafEvents.StoppedBot, ctx<StoppedBotUpdate>(), {}, next);
          break;

        case UpdateTypeEnum.UpdatedMessage:
          await this.emitAsync(
            RubigrafEvents.UpdatedMessage,
            ctx<UpdatedMessageUpdate>(),
            {},
            next
          );
          break;

        case UpdateTypeEnum.UpdatedPayment:
          await this.emitAsync(
            RubigrafEvents.UpdatedPayment,
            ctx<UpdatedPaymentUpdate>(),
            {},
            next
          );
          break;

        default:
          break;
      }

      await this.emitAsync(RubigrafEvents.Update, ctx<U>(), {}, next);
    } catch (err) {
      this.emitError(err);
    }
  }

  /**
   * Start the long-polling loop or webhook configurations.
   *
   * @since v1.0.0
   */
  async launch() {
    try {
      if (this.opts.polling) {
        await this.engine.start();
      } else {
        if (!this.opts.webhook) throw new WebhookConfigError();

        await this.setWebhook(this.opts.webhook.url, this.opts.webhook.type);
        this.logger.info("Webhook successfully configured.");
        this.logger.warn(
          "Polling is disabled, Please use Rubigraf.handleUpdate(update) before using events to process incoming updates."
        );
      }

      process.on("unhandledRejection", async (reason) => {
        this.emitError(reason);
      });

      process.on("uncaughtException", async (err) => {
        this.emitError(err);
      });
    } catch (err) {
      this.emitError(err);
    }
  }

  /**
   * Stop and destroy the {@link Rubigraf} instance.
   *
   * @since v1.0.0
   */
  stop() {
    this.uninstallAll();
    this.engine.stop();
    this.logger.info("Rubigraf instance has been destroyed!");
  }
}

export default Rubigraf;
