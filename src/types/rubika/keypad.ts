import type { KeypadRow } from "./keypadRow";

/**
 * Custom keypad layout.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface Keypad {
  /** Rows that form the keypad */
  rows: KeypadRow[];
  /** Whether keyboard should resize */
  resize_keyboard?: boolean;
  /** Whether keyboard is one-time */
  on_time_keyboard?: boolean;
}

export type { Keypad };
