import { ForwardedFromUpdate } from "../../../types";
import { BaseCustomContext } from "./base";

/**
 * Context related to `NewMessage` update but with ForwardedFrom specifics.
 *
 * @package rubigraf
 * @since v1.0.0
 */
class ForwardedFromContext extends BaseCustomContext<ForwardedFromUpdate> {
  /**
   * Gets forwarded content from the message.
   *
   * @caution As API is limited that can't handle all of the forwarded message, it is recommended to
   * use it with caution. API can't handle old messages to be forwarded which result in forwarded
   * content to be flagged as `undefined`.
   *
   * @since v1.0.0
   */
  public get forwarded_from() {
    return this.update.new_message.forwarded_from;
  }

  /**
   * Gets message ID of the forwarded content.
   *
   * @caution As API is limited that can't handle all of the forwarded message, it is recommended to
   * use it with caution. API can't handle old messages to be forwarded which result in forwarded
   * content to be flagged as `undefined`.
   *
   * @since v1.0.0
   */
  public get forwarded_message_id() {
    return this.forwarded_from?.message_id;
  }

  /**
   * Gets chat ID of the forwarded content.
   *
   * @caution As API is limited that can't handle all of the forwarded message, it is recommended to
   * use it with caution. API can't handle old messages to be forwarded which result in forwarded
   * content to be flagged as `undefined`.
   *
   * @since v1.0.0
   */
  public get from_chat_id() {
    return this.forwarded_from?.from_chat_id;
  }

  /**
   * Gets sender ID of the forwarded content.
   *
   * @caution As API is limited that can't handle all of the forwarded message, it is recommended to
   * use it with caution. API can't handle old messages to be forwarded which result in forwarded
   * content to be flagged as `undefined`.
   *
   * @since v1.0.0
   */
  public get from_sender_id() {
    return this.forwarded_from?.from_sender_id;
  }

  /**
   * Get the message related to `NewMessage` update but for {@link ForwardedFromContext}.
   *
   * @since v1.0.0
   */
  public get message() {
    return this.update.new_message;
  }

  /**
   * Gets type of the forwarded content.
   *
   * @caution As API is limited that can't handle all of the forwarded message, it is recommended to
   * use it with caution. API can't handle old messages to be forwarded which result in forwarded
   * content to be flagged as `undefined`.
   *
   * @since v1.0.0
   */
  public get type_from() {
    return this.forwarded_from?.type_from;
  }
}

export { ForwardedFromContext };
