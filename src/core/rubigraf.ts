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
} from "../types";
import { compose } from "./middleware";
import { RubigrafEvents } from "../symbols";
import { UpdateTypeEnum } from "../enums";
import { Context } from "../types";
import { createContext } from "./contexts";
import { isCommand, next } from "../helper";
import { MethodError } from "../errors";
import { FetchEngine, HTTPClient } from "./network";

const DEFAULT_OPTS: Required<RubigrafOptions> = {
  baseURL: "https://botapi.rubika.ir/v3/",
  freshnessWindow: 5,
  pollIntervalMs: 2000,
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
  constructor(private token: string, private opts: RubigrafOptions = {}) {
    super();
    this.opts = { ...DEFAULT_OPTS, ...opts };
    this.http = new HTTPClient({ baseURL: this.opts.baseURL!, token });
    this.engine = new FetchEngine(
      this.http,
      {
        freshnessWindow: opts.freshnessWindow || DEFAULT_OPTS.freshnessWindow,
        pollIntervalMs: opts.pollIntervalMs || DEFAULT_OPTS.pollIntervalMs,
      },
      this.handleUpdate.bind(this),
      async (err) => await this.emitAsync(RubigrafEvents.Error, err, next)
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
   * @returns The ID of message
   *
   * @since v1.0.0
   */
  async sendMessage(
    chatId: string,
    text: string,
    opts?: SendMessageOptions
  ): Promise<Message["message_id"]> {
    const payload: Record<string, any> = {
      chat_id: chatId,
      text,
    };

    if (opts) {
      if (opts.chatKeypad) payload.chat_keypad = opts.chatKeypad;
      if (opts.chatKeypadType) payload.chat_keypad_type = opts.chatKeypadType;
      if (opts.disableNotification) payload.disable_notification = opts.disableNotification;
      if (opts.inlineKeypad) payload.inline_keypad = opts.inlineKeypad;
      if (opts.replyToMessageId) payload.reply_to_message_id = opts.replyToMessageId;
    }

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
   *
   * @returns The ID of message
   *
   * @since v1.0.0
   */
  async sendPoll(
    chatId: string,
    question: string,
    options: string[]
  ): Promise<Message["message_id"]> {
    if (!options.length) throw new Error("Poll's options legnth must be higher than 0...");

    const res = await this.http.request<APIResponse<{ message_id: Message["message_id"] }>>(
      "POST",
      "sendPoll",
      {
        chat_id: chatId,
        question,
        options,
      }
    );

    if (res.status !== "OK") throw new MethodError("sendPoll", res.status);

    return res.data.message_id;
  }

  /**
   * Handle a single update.
   *
   * @param update Update payload from API
   *
   * @since v1.0.0
   */
  async handleUpdate<U extends Update>(update: U) {
    const ctx = createContext(update, this);
    await this.composed(ctx, async () => {});

    switch (update.type) {
      case UpdateTypeEnum.NewMessage:
        const m = update.new_message;
        if (isCommand(m.text || "")) {
          await this.emitAsync(RubigrafEvents.Command, ctx as Context<CommandUpdate>, next);
        }

        await this.emitAsync(RubigrafEvents.NewMessage, ctx as Context<NewMessageUpdate>, next);
        break;

      case UpdateTypeEnum.RemovedMessage:
        await this.emitAsync(
          RubigrafEvents.RemovedMessage,
          ctx as Context<RemovedMessageUpdate>,
          next
        );
        break;

      case UpdateTypeEnum.StartedBot:
        await this.emitAsync(RubigrafEvents.StartedBot, ctx as Context<StartedBotUpdate>, next);
        break;

      case UpdateTypeEnum.StoppedBot:
        await this.emitAsync(RubigrafEvents.StoppedBot, ctx as Context<StoppedBotUpdate>, next);
        break;

      case UpdateTypeEnum.UpdatedMessage:
        await this.emitAsync(
          RubigrafEvents.UpdatedMessage,
          ctx as Context<UpdatedMessageUpdate>,
          next
        );
        break;

      case UpdateTypeEnum.UpdatedPayment:
        await this.emitAsync(
          RubigrafEvents.UpdatedPayment,
          ctx as Context<UpdatedPaymentUpdate>,
          next
        );
        break;

      default:
        break;
    }

    await this.emitAsync(RubigrafEvents.Update, ctx, next);
  }

  /**
   * Start the long-polling loop.
   *
   * @since v1.0.0
   */
  async launch() {
    await this.engine.start();
  }

  /**
   * Stop the long-polling loop.
   *
   * @since v1.0.0
   */
  stop() {
    this.engine.stop();
  }
}

export default Rubigraf;
