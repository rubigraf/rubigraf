import { NewMessageUpdate } from "../../../types";
import { BaseMessageContext } from "./base";

/**
 * Context related to `NewMessage` update.
 *
 * @package rubigraf
 * @since v1.0.0
 */
class NewMessageContext extends BaseMessageContext<NewMessageUpdate> {
  /**
   * Get the message related to `NewMessage` update.
   *
   * @since v1.0.0
   */
  public get message() {
    return this.update.new_message;
  }
}

export { NewMessageContext };
