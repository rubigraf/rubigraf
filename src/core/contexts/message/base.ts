import { Message, NewMessageUpdate, UpdatedMessageUpdate } from "../../../types";
import { BaseContext } from "../base";

/**
 * Base context abstrated generic for {@link Message} updates.
 *
 * @package rubigraf
 * @since v1.0.0
 */
abstract class BaseMessageContext<
  T extends NewMessageUpdate | UpdatedMessageUpdate = NewMessageUpdate
> extends BaseContext<T> {
  public abstract get message(): Message;

  /**
   * Get the ID of the message.
   *
   * @since v1.0.0
   */
  get messageId() {
    return this.message.message_id;
  }

  /**
   * Get the sender ID of the message.
   *
   * @since v1.0.0
   */
  get senderId() {
    return this.message.sender_id;
  }

  /**
   * Get the text content of the message.
   *
   * @since v1.0.0
   */
  get text() {
    return this.message.text;
  }
}

export { BaseMessageContext };
