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
} from "../types";
import { compose } from "./middleware";
import { RubigrafEvents } from "../symbols";
import { UpdateTypeEnum } from "../enums";
import { Context } from "../types";
import { createContext } from "./contexts";

const DEFAULT_OPTS: Required<RubigrafOptions> = {
  baseURL: "https://botapi.rubika.ir/v3/",
  pollIntervalMs: 1500,
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
  private offset_id?: string;
  private composed = compose([]);

  /**
   * Create a new Rubigraf instance.
   *
   * @param token Bot token
   * @param opts Optional configuration (baseURL, pollIntervalMs)
   */
  constructor(private token: string, private opts: RubigrafOptions = {}) {
    super();
    opts = { ...DEFAULT_OPTS, ...opts };
    this.http = new HTTPClient({ baseURL: opts.baseURL!, token });
    this.composed = compose(this.middlewares);
  }

  /**
   * Register a middleware.
   *
   * @param mw Middleware function
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
   */
  private async getUpdates(
    offset_id?: string,
    limit?: number
  ): Promise<APIResponse<GetUpdatesResponse>["data"]> {
    const res = await this.http.request<APIResponse<GetUpdatesResponse>>("POST", `getUpdates`, {
      offset_id,
      limit,
    });

    if (res.status !== "OK") {
      throw new Error(`getUpdates failed due to "${res.status}" status.`);
    }
    return res.data;
  }

  /**
   * Send a message to a chat.
   *
   * @param chatId Target chat ID
   * @param text Message content
   */
  async sendMessage(chatId: string, text: string): Promise<Message> {
    const res = await this.http.request<APIResponse<Message>>("POST", `sendMessage`, {
      chat_id: chatId,
      text,
    });

    if (res.status !== "OK") {
      throw new Error(`sendMessage failed due to "${res.status}" status.`);
    }
    return res.data;
  }

  /**
   * Handle a single update.
   *
   * @param update Update payload from API
   */
  async handleUpdate<U extends Update>(update: U) {
    const ctx = createContext(update, this);
    await this.composed(ctx, async () => {});

    switch (update.type) {
      case UpdateTypeEnum.NewMessage:
        this.emit(RubigrafEvents.NewMessage, ctx as Context<NewMessageUpdate>, update.new_message);
        break;

      case UpdateTypeEnum.RemovedMessage:
        this.emit(
          RubigrafEvents.RemovedMessage,
          ctx as Context<RemovedMessageUpdate>,
          update.removed_message_id
        );
        break;

      case UpdateTypeEnum.StartedBot:
        this.emit(RubigrafEvents.StartedBot, ctx as Context<StartedBotUpdate>, update);
        break;

      case UpdateTypeEnum.StoppedBot:
        this.emit(RubigrafEvents.StoppedBot, ctx as Context<StoppedBotUpdate>, update);
        break;

      case UpdateTypeEnum.UpdatedMessage:
        this.emit(
          RubigrafEvents.UpdatedMessage,
          ctx as Context<UpdatedMessageUpdate>,
          update.updated_message
        );
        break;

      case UpdateTypeEnum.UpdatedPayment:
        this.emit(
          RubigrafEvents.UpdatedPayment,
          ctx as Context<UpdatedPaymentUpdate>,
          update.updated_payment
        );
        break;

      default:
        break;
    }

    this.emit(RubigrafEvents.Update, ctx, update);
  }

  /**
   * Start the long-polling loop.
   *
   * Applies time-based filtering: only updates created within
   * `pollIntervalMs` are processed.
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
              u.type === UpdateTypeEnum.NewMessage ? u.new_message.time : u.updated_message.time;

            const maxAge = Math.floor(this.opts.pollIntervalMs! / 1000);
            console.log(`Now: ${now} Time: ${time} Substract: ${now - time} Max Age: ${maxAge}`);
            if (now - time > maxAge) continue;
          }

          await this.handleUpdate(u);
        }

        this.offset_id = updates.next_offset_id || this.offset_id;
      } catch (err) {
        this.emit(RubigrafEvents.Error, err);
      }

      await new Promise((r) => setTimeout(r, interval));
    }
  }

  /**
   * Stop the long-polling loop.
   */
  stop() {
    this.running = false;
  }
}

export default Rubigraf;
