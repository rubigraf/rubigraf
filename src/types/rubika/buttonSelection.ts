import type { ButtonSelectionItem } from "./buttonSelectionItem";

/**
 * A selection type button (list/grid of items).
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface ButtonSelection {
  /** Selection list identifier */
  selection_id: string;
  /** How searching within the list works */
  search_type: string;
  /** How items are retrieved (API/local/etc) */
  get_type: string;
  /** Items in the selector */
  items: ButtonSelectionItem[];
  /** Allow selecting multiple items? */
  is_multi_selection: boolean;
  /** Number of columns in the UI */
  columns_count: string;
  /** Title for the selection */
  title: string;
}

export type { ButtonSelection };
