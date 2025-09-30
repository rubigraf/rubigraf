import { ContactUpdate } from "../../../types";
import { BaseMessageContext } from "./base";

/**
 * Context related to `NewMessage` update but with Contact specifics.
 *
 * @package rubigraf
 * @since v1.0.0
 */
class ContactContext extends BaseMessageContext<ContactUpdate> {
  /**
   * Get the message related to `NewMessage` update but for {@link ContactContext}.
   *
   * @since v1.0.0
   */
  public get message() {
    return this.update.new_message;
  }

  /**
   * Get contact from the message.
   *
   * @since v1.0.0
   */
  public get contact() {
    return this.update.new_message.contact_message!;
  }

  /**
   * Get the first name of the contact.
   *
   * @since v1.0.0
   */
  public get first_name() {
    return this.contact.first_name;
  }

  /**
   * Get the last name of the contact, it can be `undefined` too.
   *
   * @since v1.0.0
   */
  public get last_name() {
    return this.contact.last_name;
  }

  /**
   * Get the phone number of the contact.
   *
   * @since v1.0.0
   */
  public get phone_number() {
    return this.contact.phone_number;
  }
}

export { ContactContext };
