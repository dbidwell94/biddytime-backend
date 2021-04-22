import { omit, ServerError } from "helpers";
import connection from "knex-config";
import { Knex } from "knex";
import { IUser, IUserCreate, IUserMin } from "@models/user";
import httpStatus from "http-status";
import { hash } from "bcrypt";
import Service from ".";

export class UserServicesError extends ServerError {
  readonly status: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status || httpStatus.INTERNAL_SERVER_ERROR;
  }
}

export default class UserService extends Service {
  constructor() {
    super();
  }

  async getUserById(id: number): Promise<IUserMin> {
    const users = await this.repository.table<IUser>("user").select("*").where({ id }).limit(1);

    if (users.length === 0) {
      throw new UserServicesError(`User with id ${id} not found`, httpStatus.NOT_FOUND);
    }

    return omit(users[0], "password", "deactivated");
  }

  async createUser(partialUser: IUserCreate): Promise<IUserMin> {
    const hashedPassword = await hash(partialUser.password, 10);

    const userId = await this.repository.table<IUser>("user").insert(
      {
        createdAt: new Date(Date.now()),
        deactivated: false,
        firstName: partialUser.firstName,
        lastName: partialUser.lastName,
        updatedAt: new Date(Date.now()),
        password: hashedPassword,
      },
      "id"
    );

    return await this.getUserById(userId[0]);
  }
}
