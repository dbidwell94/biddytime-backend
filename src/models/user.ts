import { IUser } from "knex/types/tables";
import Auditable from "./auditable";

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
