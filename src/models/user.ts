import Auditable from "@models/auditable";
import { IUser } from "@services/UserServices";

export interface IUserCreate {
  firstName: string;
  lastName: string;
  password: string;
}

export default class User extends Auditable {
  firstName: string;
  lastName: string;
  password: string;
  deactivated: boolean;

  constructor(databaseUser: IUser) {
    super(databaseUser.id, databaseUser.createdAt, databaseUser.updatedAt);
    this.firstName = databaseUser.firstName;
    this.lastName = databaseUser.lastName;
    this.deactivated = databaseUser.deactivated;
    this.password = databaseUser.password;
  }
}
