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


const confirmRental = catchAsync(async (req, res) => {
  const result = await rentalService.confirmRental(
    req.params.id as string,
    req.user.userId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental order confirmed successfully.",
    data: result,
  });
});

const pickupRental = catchAsync(async (req, res) => {
  const result = await rentalService.pickupRental(
    req.params.id as string,
    req.user.userId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental marked as picked up successfully.",
    data: result,
  });
});
export const rentalController={
    createRentalOrder,
    getIncomingRentals,
    confirmRental,
    pickupRental
}