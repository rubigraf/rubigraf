/**
 * Update endpoint types.
 *
 * @package rubigraf
 * @since v1.0.0
 */
const enum UpdateEndpointTypeEnum {
  ReceiveUpdate = "ReceiveUpdate",
  ReceiveInlineMessage = "ReceiveInlineMessage",
  ReceiveQuery = "ReceiveQuery",
  GetSelectionItem = "GetSelectionItem",
  SearchSelectionItems = "SearchSelectionItems",
}

export { UpdateEndpointTypeEnum };
