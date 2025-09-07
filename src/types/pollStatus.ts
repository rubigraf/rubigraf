/**
 * Status / runtime info for a poll.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface PollStatus {
  /** Poll state */
  state: PollStatusEnum;
  /** Index of selected option (1-based) or 0 meaning not selected */
  selection_index: number;
  /** Percent votes for each option */
  percent_vote_options: number[];
  /** Total number of votes */
  total_vote: number;
  /** Whether to show total votes */
  show_total_votes: boolean;
}

/**
 * Poll status enum.
 *
 * @package rubigraf
 * @since v1.0.0
 */
enum PollStatusEnum {
  Open,
  Closed,
}

export type { PollStatus, PollStatusEnum };
