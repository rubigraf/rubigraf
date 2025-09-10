/**
 * Button selection search type.
 *
 * @package rubigraf
 * @since v1.0.0
 */
const enum ButtonSelectionSearchEnum {
  /** @default */
  None,
  /** Search list items using values ​​passed in the items field */
  Local,
  /** Searching list items via API */
  Api,
}

export { ButtonSelectionSearchEnum };
