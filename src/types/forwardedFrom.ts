/**
 * @package rubigraf
 * @since v1.0.0
 */
interface ForwardedFrom {
  /**
   * The forward type.
   */
  type_from: ForwardedFromEnum;

  /**
   * The message ID.
   */
  message_id: string;

  /**
   * The chat ID of a user.
   */
  from_chat_id: string;

  /**
   * The sender ID.
   */
  from_sender_id: string;
}

/**
 * @package rubigraf
 * @since v1.0.0
 */
enum ForwardedFromEnum {
  User,
  Channel,
  Bot,
}

export type { ForwardedFrom, ForwardedFromEnum };
