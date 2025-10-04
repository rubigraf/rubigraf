import { LocationUpdate } from "../../../types";
import { BaseCustomContext } from "./base";

/**
 * Context related to `NewMessage` update but with Location specifics.
 *
 * @package rubigraf
 * @since v1.0.0
 */
class LocationContext extends BaseCustomContext<LocationUpdate> {
  /**
   * Returns the latitude coordinate of the shared location.
   *
   * @since v1.0.0
   */
  public get latitude() {
    return this.location.latitude;
  }

  /**
   * Returns the location data associated with {@link LocationContext this} context.
   *
   * @since v1.0.0
   */
  public get location() {
    return this.update.new_message.location!;
  }

  /**
   * Returns the longitude coordinate of the shared location.
   *
   * @since v1.0.0
   */
  public get longitude() {
    return this.location.longitude;
  }

  /**
   * Get the message related to `NewMessage` update but for {@link LocationContext}.
   *
   * @since v1.0.0
   */
  public get message() {
    return this.update.new_message;
  }
}

export { LocationContext };
