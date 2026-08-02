import httpStatus from "http-status";

import sendResponse from "../../utils/sendResponse.js";

import { adminService } from "./admin.service.js";
import { catchAsync } from "../../utils/catchAsync.js";

const getDashboard = catchAsync(async (req, res) => {
  const result = await adminService.getDashboard();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin dashboard retrieved successfully.",
    data: result,
  });
});


const getAllUsers = catchAsync(async (req, res) => {
  const result = await adminService.getAllUsers(req.query);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Users retrieved successfully.",
    meta: result.meta,
    data: result.data,
  });
});

const updateUserStatus = catchAsync(async (req, res) => {
  const result = await adminService.updateUserStatus(
    req.params.id as string,
    req.body.status,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User status updated successfully.",
    data: result,
  });
});
export const adminController = {
  getDashboard,
  getAllUsers,
  updateUserStatus
};