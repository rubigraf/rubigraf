/**
 * Type of updates.
 *
 * @package rubigraf
 * @since v1.0.0
 */
const enum UpdateTypeEnum {
  UpdatedMessage,
  NewMessage,
  RemovedMessage,
  StartedBot,
  StoppedBot,
  UpdatedPayment,
}

export { UpdateTypeEnum };
