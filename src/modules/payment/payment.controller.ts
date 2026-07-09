import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { paymentService } from "./payment.service.js";

const createCheckoutSession = catchAsync(async (req, res) => {
  const { rentalOrderId } = req.params;

  const result = await paymentService.createCheckoutSession(
    rentalOrderId as string,
    req.user.userId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Checkout session created successfully.",
    data: result,
  });
});

const stripeWebhook = catchAsync(async (req, res) => {
  await paymentService.stripeWebhook(req);

  res.status(200).json({
    received: true,
  });
});

export const paymentController = {
  createCheckoutSession,
  stripeWebhook
};