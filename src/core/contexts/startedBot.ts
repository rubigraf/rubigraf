import { StartedBotUpdate } from "../../types";
import { BaseContext } from "./base";

/**
 * Context related to `StartedBot` update.
 *
 * @package rubigraf
 * @since v1.0.0
 */
class StartedBotContext extends BaseContext<StartedBotUpdate> {
  // /**
  //  * Get the ID of the message.
  //  *
  //  * @since v1.0.0
  //  */
  // get messageId() {
  //   return this.update.new_message;
  // }
}

export { StartedBotContext };
