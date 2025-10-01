import type {
  CustomContextTypes,
  Message,
} from "../../../types";
import { BaseContext } from "../base";

/**
 * Base context abstrated generic for custom updates.
 *
 * @package rubigraf
 * @since v1.0.0
 */
abstract class BaseCustomContext<T extends CustomContextTypes> extends BaseContext<T> {
  protected abstract get message(): Message;

  /**
   * Get forwarded from the message, if any.
   *
   * @since v1.0.0
   */
  public get forwarded_from() {
    return this.message.forwarded_from;
  }

  /**
   * Get forwarded without link output from the message, if any.
   *
   * @since v1.0.0
   */
  public get forwarded_no_link() {
    return this.message.forwarded_no_link;
  }

  /**
   * Get the ID of the message.
   *
   * @since v1.0.0
   */
  public get messageId() {
    return this.message.message_id;
  }

  /**
   * Get the ID of the message being replied to, if any.
   *
   * @since v1.0.0
   */
  public get reply_to_message_id() {
    return this.message.reply_to_message_id;
  }

  /**
   * Get the sender ID of the message.
   *
   * @since v1.0.0
   */
  public get senderId() {
    return this.message.sender_id;
  }

  /**
   * Get the type of sender (user, bot).
   *
   * @since v1.0.0
   */
  public get sender_type() {
    return this.message.sender_type;
  }

  /**
   * Get the time the message was sent.
   *
   * @since v1.0.0
   */
  public get time() {
    return this.message.time;
  }
}

export { BaseCustomContext };
