import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import AppError from "./AppError";
import { Prisma } from "../../generated/prisma/client";
import jwt from "jsonwebtoken";


export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong!";
  let errorName = "InternalServerError";

  /**
   * Handle Custom App Error
   */
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorName = err.name;
  }

  else if (err instanceof jwt.TokenExpiredError) {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Refresh token has expired. Please log in again.";
    errorName = err.name;
}

else if (err instanceof jwt.JsonWebTokenError) {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Invalid token.";
    errorName = err.name;
}

  /**
   * Handle Prisma Validation Error
   */
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    errorName = "PrismaValidationError";
    message =
      "Invalid request data. Please check the provided fields and their values.";
  }

  /**
   * Handle Prisma Known Request Error
   */
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = httpStatus.BAD_REQUEST;
    errorName = "PrismaKnownRequestError";

    switch (err.code) {
      case "P2002":
        statusCode = httpStatus.CONFLICT;
        message = `Duplicate value found for: ${(
          err.meta?.target as string[]
        )?.join(", ")}`;
        break;

      case "P2003":
        statusCode = httpStatus.BAD_REQUEST;
        message = "Foreign key constraint failed.";
        break;

      case "P2025":
        statusCode = httpStatus.NOT_FOUND;
        message = "Requested resource was not found.";
        break;

      default:
        message = err.message;
    }
  }

  /**
   * Handle Prisma Initialization Error
   */
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    errorName = "PrismaInitializationError";

    switch (err.errorCode) {
      case "P1000":
        statusCode = httpStatus.UNAUTHORIZED;
        message = "Database authentication failed.";
        break;

      case "P1001":
        statusCode = httpStatus.BAD_GATEWAY;
        message = "Unable to connect to the database.";
        break;

      default:
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = "Database initialization failed.";
    }
  }

  /**
   * Handle Prisma Unknown Error
   */
  else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    errorName = "PrismaUnknownRequestError";
    message = "Unexpected database error occurred.";
  }

  /**
   * Handle Generic Error
   */
  else if (err instanceof Error) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    errorName = err.name;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    error: {
      name: errorName,
    },
    stack: process.env.NODE_ENV === "development" ? (err as Error).stack : undefined,
  });
};