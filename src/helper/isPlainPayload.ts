import type { RubigrafPayload } from "../types";

/**
 * Simple payload detection helper
 *
 * @param payload The payload
 * @returns Verify `payload` is {@link RubigrafPayload}
 *
 * @since v1.3.0
 */
function isPlainPayload(payload: any): payload is RubigrafPayload {
  if (!payload || typeof payload !== "object") return false;
  const proto = Object.getPrototypeOf(payload);
  if (proto !== Object.prototype && proto !== null) return false;
  if (Buffer && Buffer.isBuffer(payload)) return false;
  if (Array.isArray(payload)) return false;
  if (payload instanceof Date) return false;
  if (typeof FormData !== "undefined" && payload instanceof (FormData as any)) return false;
  return true;
}

export { isPlainPayload };
