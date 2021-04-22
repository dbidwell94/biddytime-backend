import Router from "@koa/router";
import httpStatus from "http-status";
import userRouter from "./userRouter";

const routes: Record<string, Router<any, {}>> = { users: userRouter };
const router = new Router();

Object.keys(routes).forEach((route) => {
  router.use(`/api/${route}`, routes[route].routes());
  router.use(routes[route].allowedMethods());
});

export default [router.routes(), router.allowedMethods()];
