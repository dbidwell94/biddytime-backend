import httpStatus from "http-status";
import Koa from "koa";
import routes from "@routes/routes";
import logger from "koa-logger";
import bodyParser from "koa-bodyparser";
import cors from "koa-cors";

const koa = new Koa();

koa.use(logger());
koa.use(bodyParser());
koa.use(cors({ origin: "*" }));

koa.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.body = { error: err.message, details: err.details };
    ctx.status = err.status || httpStatus.INTERNAL_SERVER_ERROR;
  }
});

routes.forEach((route) => {
  koa.use(route);
});

koa.listen(1437, () => {
  console.log("Server listening on port 1437");
});
