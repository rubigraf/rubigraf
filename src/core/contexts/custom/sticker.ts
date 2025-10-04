import { StickerUpdate } from "../../../types";
import { BaseCustomContext } from "./base";

/**
 * Context related to `NewMessage` update but with Sticker specifics.
 *
 * @package rubigraf
 * @since v1.0.0
 */
class StickerContext extends BaseCustomContext<StickerUpdate> {
  /**
   * Returns the emoji character associated with the sticker.
   *
   * @since v1.0.0
   */
  public get emoji_character() {
    return this.sticker.emoji_character;
  }

  /**
   * Returns the file information of the sticker, including file ID and size.
   *
   * @since v1.0.0
   */
  public get file() {
    return this.sticker.file;
  }

  /**
   * Returns the sticker data associated with {@link StickerContext this} context.
   *
   * @since v1.0.0
   */
  public get sticker() {
    return this.update.new_message.sticker!;
  }

  /**
   * Returns the unique identifier of the sticker.
   *
   * @since v1.0.0
   */
  public get sticker_id() {
    return this.sticker.sticker_id;
  }

  /**
   * Get the message related to `NewMessage` update but for {@link StickerContext}.
   *
   * @since v1.0.0
   */
  public get message() {
    return this.update.new_message;
  }
}

export { StickerContext };
