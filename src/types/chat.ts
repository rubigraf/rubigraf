export const chatTypes = ["User", "Bot", "Group", "Channel"] as const;

/**
 * Represents a chat.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface Chat {
  /** Chat identifier */
  chat_id: string;
  /** Type of chat (e.g., User, Bot, Group, Channel) */
  chat_type: ChatTypeEnum;
  /** User identifier */
  user_id: string;
  /** First name */
  first_name: string;
  /** Last name */
  last_name: string;
  /** Title */
  title: string;
  /** Username */
  username: string;
}

/**
 * @package rubigraf
 * @since v1.0.0
 */
enum ChatTypeEnum {
  User = "User",
  Bot = "Bot",
  Group = "Group",
  Channel = "Channel",
}

type ChatTypes = (typeof chatTypes)[number];

export type { Chat, ChatTypeEnum, ChatTypes };
