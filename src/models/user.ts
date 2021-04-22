import { Schema } from ".";
import { IAuditable } from "./auditable";

export interface IUser extends IAuditable {
  firstName: string;
  lastName: string;
  deactivated: boolean;
  password: string;
}

export interface IUserCreate {
  firstName: string;
  lastName: string;
  password: string;
}

export type IUserMin = Omit<IUser, "password" | "deactivated">;

export const userPostSchema: Schema<IUserCreate> = {
  firstName: {
    propertyType: "string",
  },
  lastName: {
    propertyType: "string",
  },
  password: {
    propertyType: "string",
  },
};
