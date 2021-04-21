import httpStatus from "http-status";
import { hash, compare } from "bcrypt";
import { IAuditable } from "services/";
import knexConnection, { IKnexConnection } from "@src/knex-config";
import User, { IUserCreate } from "@models/user";
import { ServerError } from "@src/helpers";

export interface IUser extends IAuditable {
  firstName: string;
  lastName: string;
  deactivated: boolean;
  password: string;
}

export class UserServicesError extends ServerError {
  user?: IUser;
  status: number;
  constructor(message: string, options: { user?: IUser; status?: number }) {
    super(message, options.user);
    this.user = options.user;
    this.status = options.status || httpStatus.INTERNAL_SERVER_ERROR;
  }
}

export default class UserServices {
  private readonly connection: IKnexConnection;

  constructor() {
    this.connection = knexConnection;
  }

  async getUserById(id: number): Promise<User> {
    const databaseResult = await this.connection.table<IUser>("user").select("*").where({ id }).limit(1);
    if (databaseResult.length === 0) {
      throw new UserServicesError(`User with id ${id} not found`, { status: httpStatus.NOT_FOUND });
    }

    return new User(databaseResult[0]);
  }

  async createUser(userCreate: IUserCreate): Promise<User> {
    const password = await hash(userCreate.password, 10);

    const id = await this.connection.table<IUser>("users").insert(
      {
        createdAt: new Date(Date.now()),
        deactivated: false,
        firstName: userCreate.firstName,
        lastName: userCreate.lastName,
        updatedAt: new Date(Date.now()),
        password,
      },
      "id"
    );

    return this.getUserById(id[0]);
  }
}
