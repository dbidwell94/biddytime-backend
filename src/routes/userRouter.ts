import UserService from "@services/userServices";
import httpStatus from "http-status";
import Router from "koa-router";
import { ServerError } from "helpers";

class UserRouterError extends ServerError {
  constructor(message: string) {
    super(message);
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
});

export default router;
