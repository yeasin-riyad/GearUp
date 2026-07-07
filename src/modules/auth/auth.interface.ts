import { JwtPayload } from "jsonwebtoken";
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

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}

export interface IUpdateProfile {
  name?: string;
  phone?: string;
  avatar?: string;
  address?:string;
  city?:string
}


export interface TJwtPayload extends JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}