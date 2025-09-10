/**
 * Number picker config for a button.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface ButtonNumberPicker {
  /** Min value */
  min_value: string;
  /** Max value */
  max_value: string;
  /** Default selected value (optional) */
  default_value?: string;
  /** Button title */
  title: string;
}

export type { ButtonNumberPicker };
