import httpStatus, { HttpStatus } from "http-status";
import Router from "koa-router";
import { ServerError } from "@src/helpers";
import UserServices from "@services/UserServices";

class UserRouterError extends ServerError {
  status: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status || httpStatus.INTERNAL_SERVER_ERROR;
  }
}

const router = new Router<{ userServices: UserServices }>();
router.use(async (ctx, next) => {
  ctx.state.userServices = new UserServices();

  await next();
});

router.get("/user/:id", async (ctx, next) => {
  const { id: paramId } = ctx.params;

  const id = Number(paramId);
  if (Number.isNaN(id) || id === 0) {
    throw new UserRouterError("Specified id is invalid", httpStatus.BAD_REQUEST);
  }

  ctx.status = httpStatus.OK;
  ctx.body = await ctx.state.userServices.getUserById(id);
  await next();
});

router.post("/user", async (ctx, next) => {
  const { firstName, lastName, password } = ctx.body;
  if (!firstName || !lastName || !password) {
    throw new UserRouterError("firstName, lastName, and password are required", httpStatus.BAD_REQUEST);
  }
});

export default router;
