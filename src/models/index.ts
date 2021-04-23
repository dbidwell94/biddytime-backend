export type IPropertyType = "string" | "boolean" | "number" | "date" | "array";

export interface IModelSchema {
  propertyType: IPropertyType;
  optional?: boolean;
}

export type Schema<T extends Record<string, any>> = Record<keyof T, IModelSchema>;
