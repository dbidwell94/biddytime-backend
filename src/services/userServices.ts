import { ServerError } from "helpers";
import connection from "knex-config";
import { Knex } from "knex";
import { IUser } from "@models/user";

export class UserServicesError extends ServerError {
  constructor(message: string) {
    super(message);
  }
}

export default class UserService {
  private repository: Knex<IUser>;

  constructor() {
    this.repository = connection;
  }

  async getUserById(id: number): Promise<IUser> {
    const users = await this.repository.table<IUser>("user").select("*").where({ id }).limit(1);

    if (users.length === 0) {
      throw new UserServicesError(`User with id ${id} not found`);
    }

    return users[0];
  }
}
