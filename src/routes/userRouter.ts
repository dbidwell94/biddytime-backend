import UserService from "@services/userServices";
import httpStatus from "http-status";
import Router from "@koa/router";
import { ServerError, validateBody } from "helpers";
import { IUserCreate, userPostSchema, IUserLogin, userLoginSchema } from "@models/user";

class UserRouterError extends ServerError {
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

router.get("/user/:id", async (ctx) => {
  const { id: paramsId } = ctx.params;

  const id = Number(paramsId);

  if (Number.isNaN(id) || id === 0) {
    throw new UserRouterError("id parameter is invalid");
  }

  const user = await ctx.state.getUserById(id);

  ctx.body = user;
  ctx.status = httpStatus.OK;
});

router.post("/register", async (ctx) => {
  const { firstName, lastName, password, username, email } = ctx.request.body as IUserCreate;

  validateBody(userPostSchema, { firstName, lastName, password, username, email });

  const returnUser = await ctx.state.createUser({ firstName, lastName, password, username, email });

  ctx.body = returnUser;
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
