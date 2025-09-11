/**
 * Type of updates.
 *
 * @package rubigraf
 * @since v1.0.0
 */
const enum UpdateTypeEnum {
  UpdatedMessage = "UpdatedMessage",
  NewMessage = "NewMessage",
  RemovedMessage = "RemovedMessage",
  StartedBot = "StartedBot",
  StoppedBot = "StoppedBot",
  UpdatedPayment = "UpdatedPayment",
}

export { UpdateTypeEnum };
