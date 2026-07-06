import { UserRole } from "../../../generated/prisma/enums";

export type IUser = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
};

export interface ILoginUser {
    email: string;
    password: string;
}