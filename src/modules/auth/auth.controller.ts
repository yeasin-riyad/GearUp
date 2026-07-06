import { Request, Response } from "express";
import httpStatus from "http-status";

import sendResponse from "../../utils/sendResponse";
import { authService } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";
import config from "../../config";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerUserIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: result,
  });
});


const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);

  const { accessToken, refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: "lax",
    maxAge : 1000 * 60 * 60 * 24 * 7 // 7 day

  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: "lax",
    maxAge : 1000 * 60 * 60 * 24 // 24 hour or 1 day

  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Login successful",
    data: {
      accessToken,
    },
  });
});

export const authController = {
  registerUser,
  loginUser
};