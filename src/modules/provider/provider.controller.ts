import httpStatus from "http-status";

import sendResponse from "../../utils/sendResponse.js";

import { providerService } from "./provider.service.js";
import { catchAsync } from "../../utils/catchAsync.js";

const getDashboard = catchAsync(async (req, res) => {
  const result = await providerService.getDashboard(
    req.user.userId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Provider dashboard retrieved successfully.",
    data: result,
  });
});


const getProviderRentalHistory = catchAsync(async (req, res) => {
  const result =
    await providerService.getProviderRentalHistory(
      req.user.userId,
      req.query
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Provider rental history retrieved successfully.",
    data: result.data,
    meta: result.meta,
  });
});
export const providerController = {
  getDashboard,
  getProviderRentalHistory
};