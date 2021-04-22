import { IAuditable } from "./auditable";
import { IUser } from "./user";

export interface ICompany extends IAuditable {
  companyName: string;
  adminUser: number;
}

export interface ICompanyFull extends IAuditable {
  companyName: string;
  adminUser: IUser;
}
