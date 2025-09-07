import type { Location } from "./location";

/**
 * Live-tracking location information.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface LiveLocation {
  /** Start time as ISO string */
  start_time: string;
  /** Live period in seconds */
  live_period: number;
  /** Current location */
  current_location: Location;
  /** User who shares the live location */
  user_id: string;
  /** Live location status */
  status: LiveLocationStatusEnum;
  /** Last update time as ISO string */
  last_update_time: string;
}

/**
 * Live-tracking location status enum.
 *
 * @package rubigraf
 * @since v1.0.0
 */
enum LiveLocationStatusEnum {
  Stopped,
  Live,
}

export type { LiveLocation, LiveLocationStatusEnum };
