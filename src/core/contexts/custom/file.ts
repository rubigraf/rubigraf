import { getMime } from "../../../helper";
import { FileUpdate } from "../../../types";
import { BaseCustomContext } from "./base";

/**
 * Context related to `NewMessage` update but with File specifics.
 *
 * @package rubigraf
 * @since v1.0.0
 */
class FileContext extends BaseCustomContext<FileUpdate> {
  /**
   * Gets file basename without extension, e.g. `report`.
   *
   * @since v1.0.0
   */
  public get basename() {
    const ext = this.extension;
    return ext ? this.filename.slice(0, -(ext.length + 1)) : this.filename;
  }

  /**
   * Gets file extension, e.g. `pdf`.
   *
   * @since v1.0.0
   */
  public get extension() {
    return this.filename.split(".").pop()?.toLowerCase() || "";
  }

  /**
   * Gets file from the message.
   *
   * @since v1.0.0
   */
  public get file() {
    return this.update.new_message.file!;
  }

  /**
   * Gets file name with extension, e.g. `roadmap.pdf`.
   *
   * @since v1.0.0
   */
  public get filename() {
    return this.file.file_name;
  }

  /**
   * Gets file unique identifier.
   *
   * @since v1.0.0
   */
  public get id() {
    return this.file.file_id;
  }

  /**
   * Whether the file is an image.
   *
   * @since v1.0.0
   */
  public isImage() {
    return this.mime.startsWith("image/");
  }

  /**
   * Whether the file is a video.
   *
   * @since v1.0.0
   */
  public isVideo() {
    return this.mime.startsWith("video/");
  }

  /**
   * Get the message related to `NewMessage` update but for {@link FileContext}.
   *
   * @since v1.0.0
   */
  public get message() {
    return this.update.new_message;
  }

  /**
   * Gets MIME type of the file, e.g. `image/png`.
   *
   * @since v1.0.0
   */
  public get mime() {
    return getMime(this.extension);
  }

  /**
   * Gets file size in bytes.
   *
   * @since v1.0.0
   */
  public get size() {
    return this.file.size;
  }

  /**
   * Gets file size formatted as human-readable string, e.g. `1.2 MB`.
   *
   * @since v1.0.0
   */
  public get sizeUnit() {
    const size = this.size;
    if (size < 1024) return `${size} B`;

    const units = ["KB", "MB", "GB"];
    let i = -1;
    let s = size;

    do {
      s /= 1024;
      i++;
    } while (s >= 1024 && i < units.length - 1);

    return `${s.toFixed(1)} ${units[i]}`;
  }
}

export { FileContext };
