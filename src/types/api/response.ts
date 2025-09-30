import { Update } from "../rubika";

type APIStatus = "OK" | "INVALID_INPUT" | "SERVER_ERROR" | "TOO_REQUESTS" | "INVALID_ACCESS";

interface APIResponse<T> {
  /** Indicates if the request was successful */
  status: APIStatus;
  /** Contains the result data if the request was successful */
  data: T;
}

interface GetUpdatesResponse {
  updates: Update[];
  next_offset_id: string;
}

export type { APIResponse, APIStatus, GetUpdatesResponse };
