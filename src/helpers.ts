import httpStatus from "http-status";
import { IModelSchema, IPropertyType, Schema } from "./models";

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
  constructor(details: Record<string, Object>) {
    super("Your request parameters are invalid", details);
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

export function validateBody(schema: Schema<Record<string, IModelSchema>>, args: Record<string, any>): boolean {
  function validateType(argument: any, type: IPropertyType): boolean {
    if (typeof argument !== type) {
      return false;
    }
    return true;
  }

  const missingArgs: Record<string, Object> = {};

  Object.keys(schema).forEach((schemaKey) => {
    if (!(schemaKey in args) || !args[schemaKey]) {
      missingArgs[schemaKey] = schema[schemaKey];
    } else if (!validateType(args[schemaKey], schema[schemaKey].propertyType)) {
      missingArgs[schemaKey] = schema[schemaKey];
    }
  });

  if (Object.keys(missingArgs).length === 0) {
    return true;
  } else throw new ParameterError(missingArgs);
}
