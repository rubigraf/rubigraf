import type { Keypad, QueryUpdate } from "../../../types";
import { BaseCustomContext } from "./base";

/**
 * Context related to `NewMessage` update but with Query specifics.
 *
 * @package rubigraf
 * @since v1.1.0
 */
class QueryContext extends BaseCustomContext<QueryUpdate> {
  /**
   * Returns aux data from the message.
   *
   * @since v1.1.0
   */
  public get aux_data() {
    return this.update.new_message.aux_data!;
  }

  /**
   * Returns button ID related to {@link Keypad} from the query.
   *
   * @since v1.1.0
   */
  public get button_id() {
    return this.query.button_id;
  }

  /**
   * Get the message related to `NewMessage` update but for {@link QueryContext}.
   *
   * @since v1.1.0
   */
  public get message() {
    return this.update.new_message;
  }

  /**
   * Returns raw query data from the message.
   *
   * @alias {@link QueryContext.aux_data aux_data}
   * @since v1.1.0
   */
  public get query() {
    return this.aux_data;
  }

  /**
   * Returns start ID from the query.
   *
   * @since v1.1.0
   */
  public get start_id() {
    return this.query.start_id;
  }
}

export { QueryContext };
