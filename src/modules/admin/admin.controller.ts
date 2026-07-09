import httpStatus from "http-status";

import sendResponse from "../../utils/sendResponse";

import { adminService } from "./admin.service";
import { catchAsync } from "../../utils/catchAsync";

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