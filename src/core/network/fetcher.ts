import { MethodError } from "../../errors";
import type {
  APIResponse,
  FetchEngineOptions,
  GetUpdatesResponse,
  Update,
} from "../../types";
import Logger from "../log/logger";
import HTTPClient from "./http";

class FetchEngine {
  private running = false;
  private isOnLatestUpdate = false;
  private lastUpdateTime = 0;
  private offset_id?: string;

  constructor(
    private http: HTTPClient,
    private opts: FetchEngineOptions,
    private logger: Logger,
    private onUpdate: (update: Update) => Promise<void>,
    private onError: (err: unknown) => void
  ) {}

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

    if (res.status !== "OK") throw new MethodError("getUpdates", res.status);

    return res.data;
  }

  private async sleep(interval: number) {
    await new Promise((r) => setTimeout(r, interval));
  }

  /**
   * Start the long-polling loop or webhook configurations.
   *
   * @since v1.0.0
   */
  public async start() {
    if (this.running) return;
    this.running = true;

    const interval = this.opts.pollIntervalMs;

    while (this.running) {
      try {
        const updates = await this.getUpdates(this.offset_id);

        for (const u of updates.updates) {
          if (u.type === "NewMessage" || u.type === "UpdatedMessage") {
            const now = Math.floor(Date.now() / 1000);
            const time =
              u.type === "NewMessage"
                ? u.new_message.time
                : u.updated_message.time || this.lastUpdateTime + 1;

            if (time <= this.lastUpdateTime) continue;
            if (now - time > this.opts.freshnessWindow) continue;

            this.lastUpdateTime = Math.max(this.lastUpdateTime, time);
          }

          this.onUpdate(u).catch((err) => this.onError(err));
        }

        this.offset_id = updates.next_offset_id || this.offset_id;

        if (updates.next_offset_id == null && !this.isOnLatestUpdate) {
          this.logger.info("Rubigraf is up & running...");
          this.isOnLatestUpdate = true;
        }

        if (!updates.next_offset_id) {
          await this.sleep(interval);
        }
      } catch (err) {
        await this.onError(err);
        await this.sleep(interval);
      }
    }
  }

  /**
   * Stop the long-polling loop.
   *
   * @since v1.0.0
   */
  public stop() {
    this.running = false;
  }
}

export default FetchEngine;
