import type { PaymentStatusEnum } from "../enums";

/**
 * Status of a payment request.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface PaymentStatus {
  /** The ID of the payment */
  payment_id: string;
  /** Type of payment request status */
  status: PaymentStatusEnum;
}

export type { PaymentStatus };
