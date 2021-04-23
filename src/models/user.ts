import { Schema } from ".";
import { IAuditable } from "./auditable";

export interface IUser extends IAuditable {
  firstName: string;
  lastName: string;
  deactivated: boolean;
  password: string;
  email: string;
  username: string;
  roles: number[];
}

export interface IUserCreate {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  username: string;
}

export type IUserLogin = Pick<IUser, "password" | "username">;

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
  email: {
    propertyType: "string",
  },
  username: {
    propertyType: "string",
  },
};

export const userLoginSchema: Schema<IUserLogin> = {
  password: {
    propertyType: "string",
  },
  username: {
    propertyType: "string",
  },
};
