export class ServerError extends Error {
  details?: any;
  constructor(message?: string, details?: any) {
    super(message);
    this.details = details;
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export function omit<T extends Object, K extends Extract<keyof T, string>>(obj: T, ...values: K[]): Omit<T, K> {
  values.forEach((key) => {
    delete obj[key];
  });

  return obj;
}
