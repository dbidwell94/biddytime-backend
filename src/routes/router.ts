import Router from "koa-router";
import userRouter from "@routes/userRouter";

const routes: Record<string, Router<any, {}>> = {
  users: userRouter,
};

const router = new Router();

Object.keys(routes).forEach((route) => {
  const middleware = routes[route];
  router.use(`/api/${route}`, middleware.middleware());
  router.use(`/api/${route}`, middleware.allowedMethods());
});

export default router;