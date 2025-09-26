import type { HTTPClientOptions, HTTPMethod } from "../../types";

/**
 * Minimal HTTP client using global fetch (Node 18+).
 *
 * @package rubigraf
 * @since v1.0.0
 */
class HTTPClient {
  constructor(private opts: HTTPClientOptions) {}

  /**
   * Adds `Authorization` header alongside other headers.
   *
   * @futureMethod Maybe later API changed and i used it.
   * @param headers Other headers.
   * @returns Headers.
   *
   * @since unknown
   */
  private withAuth(headers: Record<string, string> = {}) {
    if (this.opts.token) headers["Authorization"] = `Bearer ${this.opts.token}`;
    return { ...this.opts.headers, ...headers };
  }

  /**
   * Sends a request to the API with preferred options.
   *
   * @param method Method type.
   * @param path Path of the request (e.g. `getMe` is one of the API's methods in API's path).
   * @param body Optional body payload (If required, then must be added; otherwise it will fail).
   * @returns The `T` type.
   *
   * @since v1.0.0
   */
  async request<T = unknown>(method: HTTPMethod, path: string, body?: any): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort("Request timeout."),
      this.opts.timeoutMs ?? 30000
    );

    try {
      const urlPaths = [
        this.opts.baseURL.endsWith("/")
          ? this.opts.baseURL.slice(0, this.opts.baseURL.length - 1)
          : this.opts.baseURL,
        this.opts.token,
        path,
      ];
      const res = await fetch(urlPaths.join("/"), {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
      }

      return (await res.json()) as T;
    } finally {
      clearTimeout(timeout);
    }
  }
}

export default HTTPClient;
