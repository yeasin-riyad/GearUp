import bcrypt from "bcryptjs";
import httpStatus from "http-status";

import { prisma } from "../../lib/prisma";
import config from "../../config";
import AppError from "../../errors/AppError";
import { IUser } from "./auth.interface";

const registerUserIntoDB = async (payload: IUser) => {

  //admin role is not eligible during registration
  if (payload.role === "ADMIN") {
  throw new AppError(
    httpStatus.FORBIDDEN,
    "You are not allowed to register as an admin."
  );
}
  // Check if user already exists
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
    },
  });

  if (isUserExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User already exists with this email"
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  // Create user
  const user = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

export const authService = {
  registerUserIntoDB,
};