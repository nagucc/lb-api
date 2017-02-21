export default class CommandHandler {
  constructor(cmd, handler) {
    this.command = cmd;
    if (handler) this.handle = handler;
  }
  handle() {
    return null;
  }
}
