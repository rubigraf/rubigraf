/**
 * Textbox input configuration.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface ButtonTextbox {
  /** Line type (single/multi) */
  type_line: ButtonTextboxTypeLineEnum;
  /** Keypad type (numeric/alpha etc) */
  type_keypad: ButtonTextboxTypeKeypadEnum;
  /** Placeholder text */
  place_holder?: string;
  /** Button title (optional) */
  title?: string;
  /** Default value (optional) */
  default_value?: string;
}

/**
 * Line type.
 *
 * @package rubigraf
 * @since v1.0.0
 */
enum ButtonTextboxTypeLineEnum {
  SingleLine,
  MultiLine,
}

/**
 * Keypad type.
 *
 * @package rubigraf
 * @since v1.0.0
 */
enum ButtonTextboxTypeKeypadEnum {
  String,
  Number,
}

export type { ButtonTextbox, ButtonTextboxTypeKeypadEnum, ButtonTextboxTypeLineEnum };
