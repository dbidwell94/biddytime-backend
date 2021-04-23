import { omit, ServerError } from "helpers";
import { IUser, IUserCreate, IUserLogin, IUserMin } from "@models/user";
import httpStatus from "http-status";
import { compare, hash } from "bcrypt";
import Service from ".";
import { sign, decode, verify } from "jsonwebtoken";

export class UserServicesError extends ServerError {
  readonly status: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status || httpStatus.INTERNAL_SERVER_ERROR;
  }
}

export default class UserService extends Service {
  private readonly jwtSecret: string;

  constructor() {
    super();
    this.jwtSecret = process.env.JWT_SECRET || "dudewheresmycar";
  }

  async getUserById(id: number): Promise<IUserMin> {
    const user = await this.repository.table<IUser>("user").select("*").where({ id }).first();

    if (!user) {
      throw new UserServicesError(`User with id ${id} not found`, httpStatus.NOT_FOUND);
    }

    return omit(user, "password", "deactivated");
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
        email: partialUser.email,
        username: partialUser.username,
      },
      "id"
    );

    return await this.getUserById(userId[0]);
  }

  async getFullUserByUsername(username: string): Promise<IUser> {
    const user = await this.repository.table<IUser>("user").select("*").where({ username }).first();

    if (!user) {
      throw new UserServicesError(`Username ${username} not found`, httpStatus.NOT_FOUND);
    }

    return user;
  }

  /**
   * Gets a JWT for a user if username and password are a match
   * @param authInfo
   */
  async login(authInfo: IUserLogin): Promise<string> {
    const user = await this.getFullUserByUsername(authInfo.username);

    if (!(await compare(authInfo.password, user.password))) {
      throw new UserServicesError("Password is invalid", httpStatus.UNAUTHORIZED);
    }

    const jwt = sign(omit(user, "createdAt", "deactivated", "password", "updatedAt"), this.jwtSecret);
    return jwt;
  }

  async verifyJwt(jwt: string): Promise<IUserMin> {
    const userInfo = verify(jwt, this.jwtSecret) as
      | Omit<IUser, "createdAt" | "deactivated" | "password" | "updatedAt">
      | undefined;

    if (!userInfo) {
      throw new UserServicesError("Unable to verify JWT", httpStatus.UNAUTHORIZED);
    }

    return await this.getUserById(userInfo.id);
  }
}
