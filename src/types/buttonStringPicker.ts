/**
 * String choice picker config.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface ButtonStringPicker {
  /** Array of string choices */
  items: string[];
  /** Default selected value (optional) */
  default_value?: string;
  /** Button title (optional) */
  title?: string;
}

export type { ButtonStringPicker };
