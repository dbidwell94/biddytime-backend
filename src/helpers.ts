export class ServerError extends Error {
  details?: any;
  constructor(message?: string, details?: any) {
    super(message);
    this.details = details;
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}
