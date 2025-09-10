type APIStatus = "OK" | "INVALID_INPUT" | "SERVER_ERROR";

interface APIResponse<T> {
  /** Indicates if the request was successful */
  status: APIStatus;
  /** Contains the result data if the request was successful */
  data?: T;
}

export type { APIResponse, APIStatus };
