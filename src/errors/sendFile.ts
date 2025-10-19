import type { UploadResult } from "../types";

class SendFileError extends Error {
  constructor(status: UploadResult["status"]) {
    super(`Failed to upload file due to "${status}" status.`);
    this.name = "SendFileError";
  }
}

export { SendFileError };
