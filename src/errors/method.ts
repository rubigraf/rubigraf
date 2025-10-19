import type { APIStatus, Methods } from "../types";

class MethodError extends Error {
  constructor(method: Methods, status: APIStatus) {
    super(`${method} failed due to "${status}" status.`);
    this.name = `${method}Error`;
  }
}

export { MethodError };
