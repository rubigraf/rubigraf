import FormData from "form-data";
import { FileTypeEnum } from "../../enums";
import type { APIResponse, File, HTTPClientOptions, HTTPMethod, UploadResult } from "../../types";
import { UploadFileIDError } from "../../errors";

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
    } catch (err) {
      await this.opts.onError(err);
      return { status: "SERVER_ERROR" } as T;
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Sends a request to Rubika APIs to upload a file
   *
   * @param formData The {@link FormData}
   * @param type {@link FileTypeEnum Type} of the file
   * @returns The upload result
   *
   * @since v1.2.0
   */
  async upload(formData: FormData, type: FileTypeEnum): Promise<UploadResult> {
    try {
      const req = await this.request<APIResponse<{ upload_url: string }>>(
        "POST",
        "requestSendFile",
        { type }
      );

      const headers = formData.getHeaders();

      try {
        const len: number = await new Promise((resolve, reject) => {
          formData.getLength((err: any, length: number) => {
            if (err) return reject(err);
            resolve(length);
          });
        });
        if (len && typeof len === "number") {
          headers["Content-Length"] = String(len);
        }
      } catch (err) {
        this.opts.onError("could not compute form-data length: " + err);
      }

      let res: Response;

      if (typeof formData.getBuffer === "function") {
        try {
          const buffer: Buffer = formData.getBuffer();
          headers["Content-Length"] = String(buffer.length);
          res = await fetch(req.data.upload_url, {
            method: "POST",
            body: buffer as any,
            headers,
          });
        } catch (err) {
          this.opts.onError(err);
          res = await fetch(req.data.upload_url, {
            method: "POST",
            body: formData as any,
            headers,
          });
        }
      } else {
        res = await fetch(req.data.upload_url, {
          method: "POST",
          body: formData as any,
          headers,
        });
      }

      try {
        formData.destroy?.();
      } catch (_) {}

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`upload failed: ${res.status} ${res.statusText} - ${text}`);
      }

      const json = await res.json().catch(async (err) => {
        const txt = await res.text().catch(() => "<no-body>");
        throw new Error(`failed to parse upload response json: ${err} - body: ${txt}`);
      });

      const fileId = json.data.file_id;
      if (!fileId) {
        throw new UploadFileIDError();
      }

      return { file_id: fileId };
    } catch (err) {
      await this.opts.onError(err);
      return { status: "SERVER_ERROR" };
    }
  }
}

export default HTTPClient;
