function isCommand(text: string): boolean {
  return text.startsWith("/");
}

export { isCommand };
