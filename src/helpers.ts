import httpStatus from "http-status";

export class ServerError extends Error {
  details?: any;
  constructor(message?: string, details?: any) {
    super(message);
    this.details = details;
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export class ParameterError extends ServerError {
  readonly status;
  constructor(details: Record<string, string>) {
    super("Your request is missing parameters", details);
    this.status = httpStatus.BAD_REQUEST;
  }
}

/**
 * Takes an object, and removes all the keys inputted from it
 * @param obj An object to remove keys from
 * @param keys A list of strings that are keys to obj to remove
 * @returns obj, but all the keys inputted are removed
 */
export function omit<T extends Object, K extends Extract<keyof T, string>>(obj: T, ...keys: K[]): Omit<T, K> {
  keys.forEach((key) => {
    (obj[key] as any) = undefined;
  });

  return obj;
}

export function parseId(id: any, errorToThrow: new (message: string) => Error = ServerError): number {
  const toReturn = Number(id);
  if (Number.isNaN(toReturn) || toReturn === 0) {
    throw new errorToThrow("id parameter is invalid");
  }
  return toReturn;
}

export function validateBody(args: Record<string, any>): boolean {
  const missingArgs: Record<string, string> = {};

  Object.keys(args).forEach((arg) => {
    if (!args[arg]) {
      missingArgs[arg] = "This field is required";
    }
  });

  if (Object.keys(missingArgs).length === 0) {
    return true;
  } else throw new ParameterError(missingArgs);
}
