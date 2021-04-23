import UserService from "@services/userServices";
import httpStatus from "http-status";
import Router from "@koa/router";
import { ServerError, validateBody } from "helpers";
import { IUserCreate, userPostSchema, IUserLogin, userLoginSchema } from "@models/user";

export class UserRouterError extends ServerError {
  readonly status: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status || httpStatus.INTERNAL_SERVER_ERROR;
  }
}

const router = new Router<UserService>();

router.use(async (ctx, next) => {
  ctx.state = new UserService();
  await next();
});

router.post("/register", async (ctx) => {
  const { firstName, lastName, password, username, email } = ctx.request.body as IUserCreate;

  validateBody(userPostSchema, { firstName, lastName, password, username, email });

  const returnUser = await ctx.state.createUser({ firstName, lastName, password, username, email });
  const token = await ctx.state.login({ password, username });

  ctx.body = { user: returnUser, token };
  ctx.status = httpStatus.CREATED;
});

router.post("/login", async (ctx) => {
  const { username, password } = ctx.request.body as IUserLogin;

  validateBody(userLoginSchema, { username, password });

  const jwt = await ctx.state.login({ password, username });

  ctx.body = { token: jwt };
  ctx.status = httpStatus.OK;
});

export default router;
