import { RouterContext } from "@koa/router";
import { IUserMin } from "@models/user";
import UserService from "@services/userServices";
import { ServerError } from "helpers";
import httpStatus from "http-status";
import { Next } from "koa";

interface IPartialState {
  user: IUserMin;
}

class AuthError extends ServerError {
  readonly status: number;
  constructor() {
    super("You must be logged in to access this resource");
    this.status = httpStatus.FORBIDDEN;
  }
}

/**
 * Middleware that will validate a user and populate the ctx.state with a user
 * @param ctx A router context with state including a user of type IUserMin
 * @param next The native Koa.Next function
 */
export default async function authMiddleware<T extends IPartialState>(ctx: RouterContext<T>, next: Next) {
  const tokenMatcher = /^bearer (.*)$/gim;
  const tokenHeader = ctx.header.authorization;
  if (!tokenHeader) {
    throw new AuthError();
  }

  const token = tokenMatcher.exec(tokenHeader);
  if (!token || token.length <= 1) {
    throw new AuthError();
  }
  const userService = new UserService();
  const user = await userService.verifyJwt(token[1]);
  ctx.state.user = user;

  await next();
}
