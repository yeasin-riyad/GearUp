import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { gearService } from "./gear.service";
import sendResponse from "../../utils/sendResponse";

const createGear = catchAsync(async (req, res) => {
  const result = await gearService.createGear(
    req.user.userId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Gear created successfully.",
    data: result,
  });
});


const getAllGears = catchAsync(async (req, res) => {
  const result = await gearService.getAllGears(
    req.query
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gears retrieved successfully.",
    meta: result.meta,
    data: result.data,
  });
});

export const gearController = {
  createGear,
  getAllGears
};