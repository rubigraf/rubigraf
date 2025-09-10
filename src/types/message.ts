import type { MessageSenderEnum } from "../enums";
import type { AuxData } from "./auxData";
import type { ContactMessage } from "./contactMessage";
import type { ForwardedFrom } from "./forwardedFrom";
import type { LiveLocation } from "./liveLocation";
import type { Location } from "./location";
import type { Poll } from "./poll";
import type { Sticker } from "./sticker";

/**
 * Main message object used in updates.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface Message {
  /** Unique message id */
  message_id: string;
  /** Text content */
  text?: string;
  /** Unix timestamp / integer time */
  time: number;
  /** Whether the message was edited */
  is_edited: boolean;
  /** Sender type */
  sender_type: MessageSenderEnum;
  /** Sender id */
  sender_id: string;
  /** Optional auxiliary data */
  aux_data?: AuxData;
  /** Attached file */
  file?: File;
  /** If this message is a reply, the replied message id */
  reply_to_message_id?: string;
  /** Forwarded from */
  forwarded_from?: ForwardedFrom;
  /** If forwarded without link */
  forwarded_no_link?: string;
  /** Location attached */
  location?: Location;
  /** Sticker attached */
  sticker?: Sticker;
  /** Contact shared */
  contact_message?: ContactMessage;
  /** Poll attached */
  poll?: Poll;
  /** Live location */
  live_location?: LiveLocation;
}

export type { Message };
