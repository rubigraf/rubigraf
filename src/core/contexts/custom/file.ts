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
   * Gets MIME type of the file.
   *
   * @since v1.0.0
   */
  private getMime(ext: string = "txt") {
    if (ext[0] === ".") {
      ext = ext.slice(1);
    }

    return (
      {
        aac: "audio/aac",
        abw: "application/x-abiword",
        arc: "application/x-freearc",
        avi: "video/x-msvideo",
        azw: "application/vnd.amazon.ebook",
        bin: "application/octet-stream",
        bmp: "image/bmp",
        bz: "application/x-bzip",
        bz2: "application/x-bzip2",
        cda: "application/x-cdf",
        csh: "application/x-csh",
        css: "text/css",
        csv: "text/csv",
        doc: "application/msword",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        eot: "application/vnd.ms-fontobject",
        epub: "application/epub+zip",
        gz: "application/gzip",
        gif: "image/gif",
        htm: "text/html",
        html: "text/html",
        ico: "image/vnd.microsoft.icon",
        ics: "text/calendar",
        jar: "application/java-archive",
        jpeg: "image/jpeg",
        jpg: "image/jpeg",
        js: "text/javascript",
        json: "application/json",
        jsonld: "application/ld+json",
        mid: "audio/midi audio/x-midi",
        midi: "audio/midi audio/x-midi",
        mjs: "text/javascript",
        mp3: "audio/mpeg",
        mp4: "video/mp4",
        mpeg: "video/mpeg",
        mpkg: "application/vnd.apple.installer+xml",
        odp: "application/vnd.oasis.opendocument.presentation",
        ods: "application/vnd.oasis.opendocument.spreadsheet",
        odt: "application/vnd.oasis.opendocument.text",
        oga: "audio/ogg",
        ogv: "video/ogg",
        ogx: "application/ogg",
        opus: "audio/opus",
        otf: "font/otf",
        png: "image/png",
        pdf: "application/pdf",
        php: "application/x-httpd-php",
        ppt: "application/vnd.ms-powerpoint",
        pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        rar: "application/vnd.rar",
        rtf: "application/rtf",
        sh: "application/x-sh",
        svg: "image/svg+xml",
        swf: "application/x-shockwave-flash",
        tar: "application/x-tar",
        tif: "image/tiff",
        tiff: "image/tiff",
        ts: "video/mp2t",
        ttf: "font/ttf",
        txt: "text/plain",
        vsd: "application/vnd.visio",
        wav: "audio/wav",
        weba: "audio/webm",
        webm: "video/webm",
        webp: "image/webp",
        woff: "font/woff",
        woff2: "font/woff2",
        xhtml: "application/xhtml+xml",
        xls: "application/vnd.ms-excel",
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        xml: "application/xml",
        xul: "application/vnd.mozilla.xul+xml",
        zip: "application/zip",
        "3gp": "video/3gpp",
        "3g2": "video/3gpp2",
        "7z": "application/x-7z-compressed",
      }[ext] || "application/octet-stream"
    );
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
    return this.getMime(this.extension);
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
