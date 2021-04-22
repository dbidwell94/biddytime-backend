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
