import type { ButtonTextboxTypeKeypadEnum } from "../../enums";
import type { ButtonTextboxTypeLineEnum } from "../../enums";

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

export type { ButtonTextbox };
