import httpStatus from "http-status";
import { IModelSchema, IPropertyType, Schema } from "./models";

export class ServerError extends Error {
  details?: Record<string, any> | string;
  constructor(message?: string, details?: Record<string, any> | string) {
    super(message);
    this.details = details;
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export class ParameterError extends ServerError {
  readonly status;
  constructor(details: Record<string, Record<string, any>>) {
    super("Your request parameters are invalid", details);
    this.status = httpStatus.BAD_REQUEST;
  }
}

export class ConstraintError extends ServerError {
  readonly status: number;
  constructor(message: string) {
    const match = /^key \((.*)\)=\((.*)\) already exists\.$/gim.exec(message);

    const details: Record<string, any> = {};

    if (match && match.length >= 3) {
      details.key = match[1];
      details.value = match[2];
    }
    super("No duplicate keys are allowed", details);
    this.status = httpStatus.BAD_REQUEST;

    Object.setPrototypeOf(this, ConstraintError.prototype);
  }
}

/**
 * Takes an object, and removes all the keys inputted from it
 * @param obj An object to remove keys from
 * @param keys A list of strings that are keys to obj to remove
 * @returns obj, but all the keys inputted are removed
 */
export function omit<T extends Record<string, any>, K extends Extract<keyof T, string>>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  keys.forEach((key) => {
    (obj[key] as any) = undefined;
  });

  return obj;
}

export function parseId(id: unknown, errorToThrow: new (message: string) => Error = ServerError): number {
  const toReturn = Number(id);
  if (Number.isNaN(toReturn) || toReturn === 0) {
    throw new errorToThrow("id parameter is invalid");
  }
  return toReturn;
}

export function validateBody(
  schema: Schema<Record<string, IModelSchema>>,
  args: Record<string, any>,
  shouldThrowError = true
): boolean {
  function validateType(argument: any, type: IPropertyType): boolean {
    if (typeof argument !== type) {
      return false;
    }
    return true;
  }

  const missingArgs: Record<string, Record<string, any>> = {};

  Object.keys(schema).forEach((schemaKey) => {
    if (!schema[schemaKey].optional) {
      schema[schemaKey].optional = false;
    }

    if (!(schemaKey in args) || !args[schemaKey]) {
      missingArgs[schemaKey] = schema[schemaKey];
    } else if (!validateType(args[schemaKey], schema[schemaKey].propertyType)) {
      missingArgs[schemaKey] = schema[schemaKey];
    }
  });

  if (Object.keys(missingArgs).length === 0) {
    return true;
  } else if (!shouldThrowError) {
    return false;
  } else throw new ParameterError(missingArgs);
}

export function getConstraintError(err: Record<string, any>): ConstraintError | null {
  Object.keys(err).forEach((key) => console.log(key));

  if ("detail" in err && /^key \((.*)\)=\((.*)\) already exists\.$/gim.test(err.detail)) {
    return new ConstraintError(err.detail);
  }
  return null;
}
