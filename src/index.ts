if (process.env.NODE_ENV === "production") {
  require("module-alias/register");
}

import httpStatus from "http-status";
import Koa from "koa";
import routes from "@routes/router";

require("dotenv").config();

const koa = new Koa();

koa.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || httpStatus.INTERNAL_SERVER_ERROR;
    ctx.body = { error: err.message, details: err.details };
  }
});

koa.use(routes.allowedMethods());
koa.use(routes.middleware());

koa.listen(1437, () => {
  console.log("Server started at port 1437");
});
