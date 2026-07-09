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

export const adminController = {
  getDashboard,
};