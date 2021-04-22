import { Schema } from ".";
import { IAuditable } from "./auditable";
import { IUserMin } from "./user";

export interface ICompany extends IAuditable {
  companyName: string;
  adminUser: number;
}

export interface ICompanyFull extends IAuditable {
  companyName: string;
  adminUser: IUserMin;
}

export type ICompanyCreate = Omit<ICompany, "createdAt" | "updatedAt" | "id">;

export const companyPostSchema: Schema<ICompanyCreate> = {
  adminUser: {
    propertyType: "number",
  },
  companyName: {
    propertyType: "string",
  },
};
