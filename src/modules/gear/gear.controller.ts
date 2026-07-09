import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync.js";
import { gearService } from "./gear.service.js";
import sendResponse from "../../utils/sendResponse.js";

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

const getSingleGear = catchAsync(async (req, res) => {
  const result = await gearService.getSingleGear(
    req.params.id as string
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear retrieved successfully.",
    data: result,
  });
});


const updateGear = catchAsync(async (req, res) => {
  const result =
    await gearService.updateGear(
      req.params.id as string,
      req.user.userId,
      req.body
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear updated successfully.",
    data: result,
  });
});


const deleteGear = catchAsync(async (req, res) => {
  await gearService.deleteGear(
    req.params.id as string,
    req.user.userId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear deleted successfully.",
    data: null,
  });
});

export const gearController = {
  createGear,
  getAllGears,
  getSingleGear,
  updateGear,
  deleteGear
};