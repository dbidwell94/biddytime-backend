import UserService from "@services/userServices";
import httpStatus from "http-status";
import Router from "koa-router";
import { ServerError } from "helpers";
import { IUserCreate } from "@models/user";

class UserRouterError extends ServerError {
  readonly status: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status || httpStatus.INTERNAL_SERVER_ERROR;
  }
}

const router = new Router<UserService>();

router.use(async (ctx) => {
  ctx.state = new UserService();
});

router.get("/user/:id", async (ctx) => {
  const { id: paramsId } = ctx.params;

  const id = Number(paramsId);

  if (Number.isNaN(id) || id === 0) {
    throw new UserRouterError("id parameter is invalid");
  }

  const user = await ctx.state.getUserById(id);

  ctx.body = { user };
  ctx.status = httpStatus.OK;
});

router.post("/user", async (ctx) => {
  const { firstName, lastName, password } = ctx.body as IUserCreate;
  if (!firstName || !lastName || !password) {
    throw new UserRouterError("firstName, lastName, and password are required", httpStatus.BAD_REQUEST);
  }

  const returnUser = await ctx.state.createUser({ firstName, lastName, password });

  ctx.body = { user: returnUser };
  ctx.status = httpStatus.CREATED;
});

export default router;
