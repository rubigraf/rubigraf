/**
 * Calendar input button configuration.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface ButtonCalendar {
  /** Default selected value (optional, ISO date) */
  default_value?: string;
  /** Calendar type */
  type: ButtonCalendarTypeEnum;
  /** Minimum year allowed */
  min_year: string;
  /** Maximum year allowed */
  max_year: string;
  /** Button title */
  title: string;
}

/**
 * Display calendar in Solar or Gregorian format.
 *
 * @package rubigraf
 * @since v1.0.0
 */
enum ButtonCalendarTypeEnum {
  DatePersian,
  DateGregorian,
}

export type { ButtonCalendar, ButtonCalendarTypeEnum };
