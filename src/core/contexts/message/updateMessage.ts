import { UpdatedMessageUpdate } from "../../../types";
import { BaseMessageContext } from "./base";

/**
 * Context related to `UpdatedMessage` update.
 *
 * @package rubigraf
 * @since v1.0.0
 */
class UpdatedMessageContext extends BaseMessageContext<UpdatedMessageUpdate> {
  /**
   * Get the message related to `UpdatedMessage` update.
   *
   * @since v1.0.0
   */
  public get message() {
    return this.update.updated_message;
  }
}

export { UpdatedMessageContext };
