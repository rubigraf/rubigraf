import { PollUpdate } from "../../../types";
import { BaseCustomContext } from "./base";

/**
 * Context related to `NewMessage` update but with Poll specifics.
 *
 * @package rubigraf
 * @since v1.0.0
 */
class PollContext extends BaseCustomContext<PollUpdate> {
  /**
   * Get the message related to `NewMessage` update but for {@link PollContext}.
   *
   * @since v1.0.0
   */
  public get message() {
    return this.update.new_message;
  }

  /**
   * Returns the list of available options in the poll.
   *
   * @since v1.0.0
   */
  public get options() {
    return this.poll.options;
  }

  /**
   * Returns the poll data associated with {@link PollContext this} context.
   *
   * @since v1.0.0
   */
  public get poll() {
    return this.update.new_message.poll!;
  }

  /**
   * Returns the current status of the poll.
   *
   * @since v1.0.0
   */
  public get poll_status() {
    return this.poll.poll_status;
  }

  /**
   * Returns the question text of the poll.
   *
   * @since v1.0.0
   */
  public get question() {
    return this.poll.question;
  }
}

export { PollContext };
