import type { APIStatus, Methods, WebhookAPIStatus } from "../types";

class MethodError extends Error {
  constructor(method: Methods, status: APIStatus | WebhookAPIStatus) {
    super(`${method} failed due to "${status}" status.`);
    this.name = `${method}Error`;
  }
}

export { MethodError };
