import { catchAsync } from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { rentalService } from "./rental.service.js";
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

const returnRental = catchAsync(async (req, res) => {
  const result = await rentalService.returnRental(
    req.params.id as string,
    req.user.userId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental returned successfully.",
    data: result,
  });
});

  // Only for Customer 
const getMyRentals = catchAsync(async (req, res) => {
  const customerId = req.user.userId;

  const result = await rentalService.getMyRentals(customerId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental orders retrieved successfully.",
    data: result,
  });
});

const cancelRental = catchAsync(async (req, res) => {
  const result = await rentalService.cancelRental(
    req.params.id as string,
    req.user.userId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental cancelled successfully.",
    data: result,
  });
});
export const rentalController={
    createRentalOrder,
    getIncomingRentals,
    confirmRental,
    pickupRental,
    returnRental,
    getMyRentals,
    cancelRental
}