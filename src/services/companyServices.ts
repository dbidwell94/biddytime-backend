import { ICompany, ICompanyCreate, ICompanyFull } from "@models/company";
import { ServerError } from "helpers";
import httpStatus from "http-status";
import Service from ".";
import UserService from "./userServices";

class CompanyServiceError extends ServerError {
  readonly status: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status || httpStatus.INTERNAL_SERVER_ERROR;
  }
}

export default class CompanyServices extends Service {
  readonly userService: UserService;
  constructor() {
    super();
    this.userService = new UserService();
  }

  async getCompanyById(id: number): Promise<ICompanyFull> {
    const companies = await this.repository.table<ICompany>("company").select("*").where({ id }).limit(1);

    if (companies.length === 0) {
      throw new CompanyServiceError(`Company with id ${id} not found`, httpStatus.NOT_FOUND);
    }

    const user = await this.userService.getUserById(companies[0].adminUser);

    return { ...companies[0], adminUser: user };
  }

  async createCompany(companyMin: ICompanyCreate): Promise<ICompanyFull> {
    const id = await this.repository.table<ICompany>("company").insert(
      {
        adminUser: companyMin.adminUser,
        companyName: companyMin.companyName,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
      },
      "id"
    );

    return await this.getCompanyById(id[0]);
  }
}
