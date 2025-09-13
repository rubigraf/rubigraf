import { UpdatedPaymentUpdate } from "../../types";
import { BaseContext } from "./base";

/**
 * Context related to `UpdatedPayment` update.
 *
 * @package rubigraf
 * @since v1.0.0
 */
class UpdatedPaymentContext extends BaseContext<UpdatedPaymentUpdate> {
  /**
   * Get the payment status.
   *
   * @since v1.0.0
   */
  get payment() {
    return this.update.updated_payment;
  }
}

export { UpdatedPaymentContext };
