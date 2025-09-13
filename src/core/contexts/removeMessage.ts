import { RemovedMessageUpdate } from "../../types";
import { BaseContext } from "./base";

/**
 * Context related to `RemovedMessage` update.
 *
 * @package rubigraf
 * @since v1.0.0
 */
class RemovedMessageContext extends BaseContext<RemovedMessageUpdate> {
  /**
   * Get the ID of the deleted message.
   *
   * @since v1.0.0
   */
  get messageId() {
    return this.update.removed_message_id;
  }
}

export { RemovedMessageContext };
