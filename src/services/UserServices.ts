import Knex from "knex";
import { IUser } from "knex/types/tables";
import knexConnection, { IKnexConnection } from "../knex";
import User from "../models/user";

class UserServicesError extends Error {
  user?: IUser;

  constructor(message: string, user?: IUser) {
    super(message);
    this.user = user;
    Object.setPrototypeOf(this, UserServicesError.prototype);
  }
}

export class UserServices {
  private readonly connection: IKnexConnection;

  constructor() {
    this.connection = knexConnection;
  }

  async getUserById(id: number): Promise<User> {
    const databaseResult = await this.connection.table("user").select("*").where({ id }).limit(1);
    if (databaseResult.length === 0) {
      throw new UserServicesError(`User with id ${id} not found`);
    }

    return new User(databaseResult[0]);
  }
}
