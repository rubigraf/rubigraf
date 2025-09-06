/**
 * @package rubigraf
 * @since v1.0.0
 */
interface File {
  /**
   * The file ID.
   */
  file_id: string;

  /**
   * The file name
   */
  file_name: string;

  /**
   * The size of the file (in Bytes format).
   */
  size: string;
}

export type { File };
