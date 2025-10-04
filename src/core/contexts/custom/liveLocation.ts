import { LiveLocationUpdate } from "../../../types";
import { BaseCustomContext } from "./base";

/**
 * Context related to `NewMessage` update but with LiveLocation specifics.
 *
 * @package rubigraf
 * @since v1.0.0
 */
class LiveLocationContext extends BaseCustomContext<LiveLocationUpdate> {
  /**
   * Returns the current geographic coordinates of the live location.
   *
   * @since v1.0.0
   */
  public get current_location() {
    return this.live_location.current_location;
  }

  /**
   * Returns the timestamp of the most recent live location update.
   *
   * @since v1.0.0
   */
  public get last_update_time() {
    return this.live_location.last_update_time;
  }

  /**
   * Returns the live location data associated with {@link LiveLocationContext this} context.
   *
   * @since v1.0.0
   */
  public get live_location() {
    return this.update.new_message.live_location!;
  }

  /**
   * Returns the total duration (in seconds) that the live location remains active.
   *
   * @since v1.0.0
   */
  public get live_period() {
    return this.live_location.live_period;
  }

  /**
   * Get the message related to `NewMessage` update but for {@link LiveLocationContext}.
   *
   * @since v1.0.0
   */
  public get message() {
    return this.update.new_message;
  }

  /**
   * Returns the start timestamp for the live location sharing period.
   *
   * @since v1.0.0
   */
  public get start_time() {
    return this.live_location.start_time;
  }

  /**
   * Returns the current status of the live location.
   *
   * @since v1.0.0
   */
  public get status() {
    return this.live_location.status;
  }

  /**
   * Returns the identifier of the user who shared the live location.
   *
   * @since v1.0.0
   */
  public get user_id() {
    return this.live_location.user_id;
  }
}

export { LiveLocationContext };
