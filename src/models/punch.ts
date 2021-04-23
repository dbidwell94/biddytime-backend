import { Schema } from ".";
import { IAuditable } from "./auditable";
import { ICompany } from "./company";
import { IUserMin } from "./user";

export interface IPunch extends IAuditable {
  companyId: number;
  userId: number;
  isPunchIn: boolean;
}

export type IPunchCreate = Omit<IPunch, "createdAt" | "updatedAt" | "id">;

export interface IPunchFull extends IAuditable {
  company: ICompany;
  user: IUserMin;
  isPunchIn: boolean;
}

export const punchPostSchema: Schema<IPunchCreate> = {
  companyId: {
    propertyType: "number",
  },
  isPunchIn: {
    propertyType: "boolean",
  },
  userId: {
    propertyType: "number",
  },
};
