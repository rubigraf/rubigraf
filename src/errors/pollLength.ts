class PollLengthError extends Error {
  constructor() {
    super("Expected at least an option for Poll to be sent, but got 0 options!");
    this.name = `PollLengthError`;
  }
}

export { PollLengthError };
