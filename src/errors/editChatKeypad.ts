class EditChatKeypadError extends Error {
  constructor() {
    super("The 'keypad' param must not be undefined while 'type' param is set to the 'New'!");
    this.name = "EditChatKeypadError";
  }
}

export { EditChatKeypadError };
