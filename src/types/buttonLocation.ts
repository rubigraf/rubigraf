import type { ButtonLocationTypeEnum } from "../enums";
import type { Location } from "./location";

/**
 * Location picker configuration.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface ButtonLocation {
  /** Default pointer location */
  default_pointer_location?: Location;
  /** Default map location */
  default_map_location?: Location;
  /** Map/location type */
  type: ButtonLocationTypeEnum;
  /** Optional title */
  title?: string;
  /** Optional image url representing the location */
  location_image_url?: string;
}

export type { ButtonLocation };
