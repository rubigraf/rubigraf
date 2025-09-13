import { StoppedBotUpdate } from "../../types";
import { BaseContext } from "./base";

/**
 * Context related to `StoppedBot` update.
 *
 * @package rubigraf
 * @since v1.0.0
 */
class StoppedBotContext extends BaseContext<StoppedBotUpdate> {
  // /**
  //  * Get the ID of the message.
  //  *
  //  * @since v1.0.0
  //  */
  // get messageId() {
  //   return this.update.new_message;
  // }
}

export { StoppedBotContext };
