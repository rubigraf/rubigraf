/**
 * HTTP methods.
 *
 * @package rubigraf
 * @since v1.0.0
 */
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

/**
 * HTTP client options.
 *
 * @package rubigraf
 * @since v1.0.0
 */
interface HTTPClientOptions {
  baseURL: string;
  token: string;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export type { HTTPClientOptions, HTTPMethod };
