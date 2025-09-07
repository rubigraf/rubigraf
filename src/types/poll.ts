import type { PollStatus } from "./pollStatus";

/**
 * Poll model.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface Poll {
  /** The poll question */
  question: string;
  /** Options available for voting */
  options: string[];
  /** Current poll status / stats */
  poll_status: PollStatus;
}

export type { Poll };
