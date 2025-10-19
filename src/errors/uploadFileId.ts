class UploadFileIDError extends Error {
  constructor() {
    super("upload completed but no file_id present in response");
    this.name = "UploadFileIDError";
  }
}

export { UploadFileIDError };
