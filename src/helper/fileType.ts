import { FileTypeEnum } from "../enums";
import { getMime } from "./mime";

/**
 * Returns type of the file based on {@link FileTypeEnum}.
 *
 * @param mime MIME type
 *
 * @since v1.2.0
 */
function getFileType(mime: ReturnType<typeof getMime>): FileTypeEnum {
  if (mime.startsWith("image/")) {
    if (mime.includes("gif")) return FileTypeEnum.Gif;

    return FileTypeEnum.Image;
  }

  if (mime.startsWith("video/")) {
    return FileTypeEnum.Video;
  }

  if (mime.startsWith("audio/")) {
    if (mime.includes("mpeg") || mime.includes("mp3") || mime.includes("opus")) {
      return FileTypeEnum.Music;
    }

    return FileTypeEnum.Voice;
  }

  return FileTypeEnum.File;
}

export { getFileType };
