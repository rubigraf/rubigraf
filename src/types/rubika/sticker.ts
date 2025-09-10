/**
 * Represents a sticker attached to a message.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface Sticker {
  /** Sticker identifier */
  sticker_id: string;
  /** File object for the sticker */
  file: File;
  /** Emoji character associated with sticker */
  emoji_character: string;
}

export type { Sticker };
