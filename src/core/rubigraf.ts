import Event from "./event";
import HTTPClient from "./http";
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
  GetUpdatesResponse,
  Middleware,
  CommandUpdate,
  Bot,
  SendMessageOptions,
  Poll,
} from "../types";
import { compose } from "./middleware";
import { RubigrafEvents } from "../symbols";
import { UpdateTypeEnum } from "../enums";
import { Context } from "../types";
import { createContext } from "./contexts";
import { isCommand, next } from "../helper";

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
  private middlewares: Middleware[] = [];
  private running = false;
  private isOnLatestUpdate = false;
  private lastUpdateTime = 0;
  private offset_id?: string;
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
   * Fetch updates from the API.
   *
   * @param offset_id Update offset_id for pagination
   * @param limit Max number of updates to fetch
   *
   * @since v1.0.0
   */
  private async getUpdates(
    offset_id?: string,
    limit?: number
  ): Promise<APIResponse<GetUpdatesResponse>["data"]> {
    const res = await this.http.request<APIResponse<GetUpdatesResponse>>("POST", "getUpdates", {
      offset_id,
      limit,
    });

    if (res.status !== "OK") {
      throw new Error(`getUpdates failed due to "${res.status}" status.`);
    }
    return res.data;
  }

  /**
   * Gets bot's info.
   *
   * @since v1.0.0
   */
  async getMe(): Promise<Bot> {
    const res = await this.http.request<APIResponse<Record<"bot", Bot>>>("POST", "getMe");

    if (res.status !== "OK") {
      throw new Error(`getMe failed due to "${res.status}" status.`);
    }

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

    if (res.status !== "OK") {
      throw new Error(`sendMessage failed due to "${res.status}" status.`);
    }

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

    if (res.status !== "OK") {
      throw new Error(`sendPoll failed due to "${res.status}" status.`);
    }

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
    if (this.running) return;
    this.running = true;
    const interval = this.opts.pollIntervalMs ?? 1500;

    while (this.running) {
      try {
        const updates = await this.getUpdates(this.offset_id);

        for (const u of updates.updates) {
          if (u.type === UpdateTypeEnum.NewMessage || u.type === UpdateTypeEnum.UpdatedMessage) {
            const now = Math.floor(Date.now() / 1000);
            const time =
              u.type === UpdateTypeEnum.NewMessage
                ? u.new_message.time
                : u.updated_message.time || this.lastUpdateTime + 1;

            if (time <= this.lastUpdateTime) continue;
            if (!this.opts.freshnessWindow) continue;
            if (now - time > this.opts.freshnessWindow) continue;

            this.lastUpdateTime = Math.max(this.lastUpdateTime, time);
          }

          await this.handleUpdate(u);
        }

        this.offset_id = updates.next_offset_id || this.offset_id;

        if (updates.next_offset_id) continue;
        if (!this.isOnLatestUpdate) {
          console.log("Rubigraf is up & running...");
          this.isOnLatestUpdate = true;
        }
      } catch (err) {
        await this.emitAsync(RubigrafEvents.Error, err, next);
      }

      // await new Promise((r) => setTimeout(r, interval));
    }
  }

  /**
   * Stop the long-polling loop.
   *
   * @since v1.0.0
   */
  stop() {
    this.running = false;
  }
}

export default Rubigraf;
