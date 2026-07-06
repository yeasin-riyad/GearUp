import bcrypt from "bcryptjs";
import httpStatus from "http-status";

import { prisma } from "../../lib/prisma";
import config from "../../config";
import AppError from "../../errors/AppError";
import { ILoginUser, IUser } from "./auth.interface";
import { jwtUtils } from "../../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

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


const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found"
    );
  }

  if (user.status === "SUSPENDED") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account has been blocked."
    );
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid email or password"
    );
  }


 // Update last login time
  await prisma.user.update({
  where: { id: user.id },
  data: {
    lastLoginAt: new Date(),
  },
});

  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as any
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as any
  );

  return {
    accessToken,
    refreshToken,
  };
};


const refreshToken = async (token: string) => {
  const decoded = jwtUtils.verifyToken(
    token,
    config.jwt_refresh_secret
  ) as JwtPayload;

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId,
    },
  });

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found"
    );
  }

  if (user.status === "SUSPENDED") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account has been blocked."
    );
  }

  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as any
  );

  return {
    accessToken,
  };
};

const getMe = async (userId:string)=>{

    return prisma.user.findUniqueOrThrow({
        where:{
            id:userId
        },
        select:{
            id:true,
            name:true,
            email:true,
            phone:true,
            avatar:true,
            role:true,
            status:true,
            createdAt:true,
            lastLoginAt:true
        }
    })

}

export const authService = {
  registerUserIntoDB,
  loginUser,
  refreshToken,
  getMe
};