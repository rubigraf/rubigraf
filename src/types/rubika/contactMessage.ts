/**
 * Contact information shared inside a message.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface ContactMessage {
  /** Contact phone number */
  phone_number: string;
  /** First name */
  first_name: string;
  /** Last name (optional) */
  last_name?: string;
}

export type { ContactMessage };
