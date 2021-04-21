import Koa from "koa";
import Router from "koa-router";

require("dotenv").config();

const koa = new Koa();

koa.listen(1437, () => {
  console.log("Server started at port 1437");
});
