/**
 * Arbitrary extra data attached to messages/buttons.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface AuxData {
  /** Shortcut identifier */
  start_id: string;
  /** Button identifier */
  button_id: string;
  /** Additional arbitrary fields allowed */
  [key: string]: any;
}

export type { AuxData };
