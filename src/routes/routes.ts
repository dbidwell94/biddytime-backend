import Router from "@koa/router";
import userRouter from "./userRouter";
import companyRouter from "./companyRouter";
import privateUserRouter from "@routes/private/userRouter";

const routes: Record<string, Router<any, Record<string, any>>> = {
  "users": userRouter,
  "companies": companyRouter,
  "private/users": privateUserRouter,
};
const router = new Router();

Object.keys(routes).forEach((route) => {
  router.use(`/api/${route}`, routes[route].routes());
  router.use(routes[route].allowedMethods());
});

export default [router.routes(), router.allowedMethods()];
