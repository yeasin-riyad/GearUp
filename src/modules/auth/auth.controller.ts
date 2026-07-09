import { Request, Response } from "express";
import httpStatus from "http-status";

import sendResponse from "../../utils/sendResponse.js";
import { authService } from "./auth.service.js";
import { catchAsync } from "../../utils/catchAsync.js";
import AppError from "../../errors/AppError.js";
import config from "../../config/index.js";

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


const refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Refresh token is required."
    );
  }

  const accessToken = await authService.refreshToken(token);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: "lax",
    maxAge : 1000 * 60 * 60 * 24 // 24 hour or 1 day

  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Access token refreshed successfully.",
    data: accessToken,
  });
});


const logoutUser = catchAsync(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: "lax",
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Logged out successfully",
    data: null,
  });
});

const getMe = catchAsync(async (req, res) => {
    const result = await authService.getMe(req.user.userId);

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"Profile retrieved successfully",
        data:result
    })
})


const updateProfile = catchAsync(async (req, res) => {
  // console.log(req.user.userId);
  // console.log(req.body);
  const result = await authService.updateProfile(
    req.user.userId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully",
    data: result,
  });
});


const changePassword = catchAsync(async (req, res) => {
  await authService.changePassword(
    req.user.userId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password changed successfully",
    data: null,
  });
});
export const authController = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getMe,
  updateProfile,
  changePassword
};