import { knex } from "knex";

declare module "knex/types/tables" {
  interface IAuditable {
    createdAt: Date;
    updatedAt: Date;
    id: number;
  }

  interface IUser extends IAuditable {
    firstName: string;
    lastName: string;
    password: string;
    deactivated: boolean;
  }

  interface ICompany extends IAuditable {
    companyName: string;
    adminUser: number;
  }

  interface IPunch extends IAuditable {
    companyId: number;
    userId: number;
    isPunchIn: boolean;
  }

  interface IUserCompany extends IAuditable {
    userId: number;
    companyId: number;
  }

  interface IForgotPasswordLink extends IAuditable {
    userId: number;
    hash: string;
  }

  interface Tables {
    user: IUser;
    punch: IPunch;
    company: ICompany;
    userCompany: IUserCompany;
    forgotPasswordLink: IForgotPasswordLink;
  }
}
