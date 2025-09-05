/**
 * @package rubigraf
 * @since v1.0.0
 */
interface Chat {
  /**
   * User Chat ID.
   */
  chat_id: string;

  /**
   * The type of the chat.
   */
  chat_type: ChatTypeEnum;

  /**
   * User ID.
   */
  user_id: string;

  /**
   * The first name of the user.
   */
  first_name: string;

  /**
   * The last name of the user.
   */
  last_name: string;

  /**
   * title.
   */
  title: string;

  /**
   * The username of the user.
   */
  username: string;
}

/**
 * @package rubigraf
 * @since v1.0.0
 */
enum ChatTypeEnum {
  User,
  Bot,
  Group,
  Channel,
}

export type { Chat, ChatTypeEnum };
