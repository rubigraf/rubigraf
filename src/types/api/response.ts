import { File, Update } from "../rubika";

type APIStatus = "OK" | "INVALID_INPUT" | "SERVER_ERROR" | "TOO_REQUESTS" | "INVALID_ACCESS";

interface APIResponse<T> {
  /** Indicates if the request was successful */
  status: APIStatus;
  /** Contains the result data if the request was successful */
  data: T;
}

type UploadResult =
  | {
    status: "INVALID_INPUT" | "SERVER_ERROR" | "TOO_REQUESTS" | "INVALID_ACCESS";
    file_id?: undefined;
  }
  | {
    file_id: File["file_id"];
    status?: undefined;
  };

interface GetUpdatesResponse {
  updates: Update[];
  next_offset_id: string;
}

export type { APIResponse, APIStatus, GetUpdatesResponse, UploadResult };
