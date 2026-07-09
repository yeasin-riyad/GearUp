import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { rentalService } from "./rental.service";
import httpStatus from "http-status";


const createRentalOrder = catchAsync(async (req, res) => {
  const result = await rentalService.createRentalOrder(
    req.user.userId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rental order created successfully.",
    data: result,
  });
});


const getIncomingRentals = catchAsync(
  async (req, res) => {
    const providerId = req.user.userId;

    const result =
      await rentalService.getIncomingRentals(
        providerId
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message:
        "Incoming rental orders retrieved successfully.",
      data: result,
    });
  }
);

export const rentalController={
    createRentalOrder,
    getIncomingRentals
}