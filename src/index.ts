import httpStatus from "http-status";
import Koa from "koa";
import routes from "@routes/routes";

const koa = new Koa();

koa.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.body = { error: err.message, details: err.details };
    ctx.status = err.status || httpStatus.INTERNAL_SERVER_ERROR;
  }
});

koa.use(routes.middleware());
koa.use(routes.allowedMethods());

koa.listen(1437, () => {
  console.log("Server listening on port 1437");
});
