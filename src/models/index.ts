export type IPropertyType = "string" | "boolean" | "number" | "date";

export interface IModelSchema {
  propertyType: IPropertyType
  optional?: boolean;
}

export type Schema<T extends Object> = Record<keyof T, IModelSchema>;
