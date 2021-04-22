import Router from "@koa/router";
import { companyPostSchema, ICompanyCreate } from "@models/company";
import CompanyServices from "@services/companyServices";
import { parseId, ServerError, validateBody } from "helpers";
import httpStatus from "http-status";

class CompanyRouterError extends ServerError {
  readonly status: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status || httpStatus.INTERNAL_SERVER_ERROR;
  }
}

const router = new Router<CompanyServices>();

router.use(async (ctx, next) => {
  ctx.state = new CompanyServices();
  await next();
});

router.get("/company/:id", async (ctx) => {
  const id = parseId(ctx.params.id, CompanyRouterError);

  const company = await ctx.state.getCompanyById(id);

  ctx.body = company;
  ctx.status = httpStatus.OK;
});

router.post("/company", async (ctx) => {
  const { adminUser, companyName } = ctx.request.body as ICompanyCreate;
  validateBody(companyPostSchema, { adminUser, companyName });

  const company = await ctx.state.createCompany({ adminUser, companyName });

  ctx.body = company;
  ctx.status = httpStatus.CREATED;
});

export default router;
