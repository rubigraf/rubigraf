/**
 * Button selection search type.
 *
 * @package rubigraf
 * @since v1.0.0
 */
enum ButtonSelectionSearchEnum {
  /** @default */
  None = "None",
  /** Search list items using values ​​passed in the items field */
  Local = "Local",
  /** Searching list items via API */
  Api = "Api",
}

export { ButtonSelectionSearchEnum };
