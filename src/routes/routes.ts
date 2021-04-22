import Router from "@koa/router";
import userRouter from "./userRouter";
import companyRouter from "./companyRouter";

const routes: Record<string, Router<any, {}>> = { users: userRouter, companies: companyRouter };
const router = new Router();

Object.keys(routes).forEach((route) => {
  router.use(`/api/${route}`, routes[route].routes());
  router.use(routes[route].allowedMethods());
});

export default [router.routes(), router.allowedMethods()];
