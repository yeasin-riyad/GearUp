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

export const gearController = {
  createGear,
};