import type { Button } from "./button";

/**
 * Row of buttons in a keypad.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface KeypadRow {
  /** Buttons contained in the row */
  buttons: Button[];
}

export type { KeypadRow };
