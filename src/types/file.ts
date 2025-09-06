/**
 * Represents a file.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface File {
  /** File identifier */
  file_id: string;
  /** Filename */
  file_name: string;
  /** File size in bytes (as string) */
  size: string;
}

export type { File };
