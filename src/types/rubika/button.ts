import { ButtonTypeEnum } from "../../enums";
import type { ButtonCalendar } from "./buttonCalendar";
import type { ButtonLocation } from "./buttonLocation";
import type { ButtonNumberPicker } from "./buttonNumberPicker";
import type { ButtonSelection } from "./buttonSelection";
import type { ButtonStringPicker } from "./buttonStringPicker";
import type { ButtonTextbox } from "./buttonTextbox";

/**
 * Generic button definition which may contain one of several input types.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface Button {
  /** Button id */
  id: string;
  /** Button type */
  type: ButtonTypeEnum;
  /** Button display text */
  button_text: string;
  /** Selection config */
  button_selection?: ButtonSelection;
  /** Calendar config */
  button_calendar?: ButtonCalendar;
  /** Number picker config */
  button_number_picker?: ButtonNumberPicker;
  /** String picker config */
  button_string_picker?: ButtonStringPicker;
  /** Location config */
  button_location?: ButtonLocation;
  /** Textbox config */
  button_textbox?: ButtonTextbox;
}

export type { Button };
