import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";

import config from "../config";
import AppError from "../errors/AppError";
import { prisma } from "../lib/prisma";
import { jwtUtils } from "../utils/jwt";
import { UserRole } from "../../generated/prisma/enums";

const auth =
  (...requiredRoles: UserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Unauthorized access."
      );
    }

    const decoded = jwtUtils.verifyToken(
      token,
      config.jwt_access_secret
    ) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "User not found."
      );
    }

    if (user.status === "SUSPENDED") {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Your account has been suspended."
      );
    }

    if (
      requiredRoles.length &&
      !requiredRoles.includes(user.role)
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to access this resource."
      );
    }

    req.user = decoded;

    next();
  };

export default auth;