class WebhookConfigError extends Error {
  constructor() {
    super("Webhook not configured correctly!");
    this.name = `WebhookConfigError`;
  }
}

export { WebhookConfigError };
