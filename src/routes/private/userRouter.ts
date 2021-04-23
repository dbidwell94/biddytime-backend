import Router from "@koa/router";
import { IUserMin } from "@models/user";
import { UserRouterError } from "@routes/userRouter";
import UserService from "@services/userServices";
import httpStatus from "http-status";
import authMiddleware from "middleware/authMiddleware";

interface IPrivateUserRouter {
  user: IUserMin;
  userService: UserService;
}

const router = new Router<IPrivateUserRouter>();

router.use(async (ctx, next) => {
  ctx.state.userService = new UserService();
  await next();
});

router.use(authMiddleware);

router.get("/users/all", async (ctx) => {
  const users = await ctx.state.userService.getAllUsers();

  ctx.body = users;
  ctx.status = httpStatus.OK;
});

router.get("/user/:id", async (ctx) => {
  const { id: paramsId } = ctx.params;

  const id = Number(paramsId);

  if (Number.isNaN(id) || id === 0) {
    throw new UserRouterError("id parameter is invalid");
  }

  const user = await ctx.state.userService.getUserById(id);

  ctx.body = user;
  ctx.status = httpStatus.OK;
});

export default router;
