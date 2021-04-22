import httpStatus from "http-status";
import Koa from "koa";
import routes from "@routes/routes";
import logger from "koa-logger";

const koa = new Koa();

koa.use(logger());

koa.use(routes.middleware());
koa.use(routes.allowedMethods());

routes.stack.forEach((route) => {
  console.log(`${route.methods} -- ${route.path}`);
});

koa.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.body = { error: err.message, details: err.details };
    ctx.status = err.status || httpStatus.INTERNAL_SERVER_ERROR;
  }
});

koa.listen(1437, () => {
  console.log("Server listening on port 1437");
});
