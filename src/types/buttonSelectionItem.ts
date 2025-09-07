/**
 * Single selectable item inside a selection button.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface ButtonSelectionItem {
  /** Display text of the item */
  text: string;
  /** Optional image URL for the item */
  image_url?: string;
  /** Visual type (text only, thumbnail, large image) */
  type: ButtonSelectionTypeEnum;
}

/**
 * Button selection type enum.
 *
 * @package rubigraf
 * @since v1.0.0
 */
enum ButtonSelectionTypeEnum {
  TextOnly,
  TextImgThu,
  TextImgBig,
}

export type { ButtonSelectionItem, ButtonSelectionTypeEnum };
