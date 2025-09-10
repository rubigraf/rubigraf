import type { AuxData } from "./auxData";
import type { Location } from "./location";

/**
 * Inline message representation.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface InlineMessage {
  /** Sender id */
  sender_id: string;
  /** Text content */
  text: string;
  /** Optional file */
  file?: File;
  /** Optional location */
  location?: Location;
  /** Optional aux data */
  aux_data?: AuxData;
  /** Message id */
  message_id: string;
  /** Chat id */
  chat_id: string;
}

export type { InlineMessage };
