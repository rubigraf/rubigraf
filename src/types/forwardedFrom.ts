export const forwardedFromTypes = ["User", "Channel", "Bot"] as const;

/**
 * Represents data about forwarded messages.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface ForwardedFrom {
  /** The type of source (User, Channel, Bot) */
  type_from: ForwardedFromEnum;
  /** Original message identifier */
  message_id: string;
  /** Source chat identifier */
  from_chat_id: string;
  /** Source user identifier */
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

type ForwardedFromType = typeof forwardedFromTypes[number];

export type { ForwardedFrom, ForwardedFromEnum, ForwardedFromType };
