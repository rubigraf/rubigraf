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
   * Get auxiliary data from the message.
   *
   * @since v1.0.0
   */
  public get aux_data() {
    return this.message.aux_data;
  }

  /**
   * Get contact message from the message, if any.
   *
   * @since v1.0.0
   */
  public get contact() {
    return this.message.contact_message;
  }

  /**
   * Get file attached to the message, if any.
   *
   * @since v1.0.0
   */
  public get file() {
    return this.message.file;
  }

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
   * Check if the message has been edited.
   *
   * @since v1.0.0
   */
  public get is_edited() {
    return this.message.is_edited;
  }

  /**
   * Get live location from the message, if any.
   *
   * @since v1.0.0
   */
  public get live_location() {
    return this.message.live_location;
  }

  /**
   * Get location from the message, if any.
   *
   * @since v1.0.0
   */
  public get location() {
    return this.message.location;
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
   * Get poll from the message, if any.
   *
   * @since v1.0.0
   */
  public get poll() {
    return this.message.poll;
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
   * Get sticker from the message, if any.
   *
   * @since v1.0.0
   */
  public get sticker() {
    return this.message.sticker;
  }

  /**
   * Get the text content of the message.
   *
   * @since v1.0.0
   */
  public get text() {
    return this.message.text;
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

export { BaseMessageContext };
