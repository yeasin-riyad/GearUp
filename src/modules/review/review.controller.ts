import httpStatus from "http-status";

import sendResponse from "../../utils/sendResponse.js";

import { reviewService } from "./review.service.js";
import { catchAsync } from "../../utils/catchAsync.js";

const createReview = catchAsync(async (req, res) => {
  const result = await reviewService.createReview(
    req.user.userId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review created successfully.",
    data: result,
  });
});

export const getAllGearReviews = catchAsync(async (req, res) => {
  const result = await reviewService.getAllGearReviews(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reviews retrieved successfully.",
    meta: result.meta,
    data: {
      statistics: result.statistics,
      reviews: result.data,
    },
  });
});

const getGearReviews = catchAsync(async (req, res) => {
  const gearItemId = req.params.gearItemId as string;

  const result = await reviewService.getGearReviews(
    gearItemId,
    req.query
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reviews retrieved successfully.",
    data: result.data,
    meta: result.meta,
  });
});

const getMyReviews = catchAsync(async (req, res) => {
  const result = await reviewService.getMyReviews(
    req.user.userId,
    req.query
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My reviews retrieved successfully.",
    data: result.data,
    meta: result.meta,
  });
});

const updateReview = catchAsync(async (req, res) => {
  const result = await reviewService.updateReview(
    req.params.id as string,
    req.user.userId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review updated successfully.",
    data: result,
  });
});

const deleteReview = catchAsync(async (req, res) => {
  await reviewService.deleteReview(
    req.params.id as string,
    req.user.userId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review deleted successfully.",
    data: null,
  });
});

export const reviewController = {
  createReview,
  getGearReviews,
  getMyReviews,
  updateReview,
  deleteReview,
  getAllGearReviews
};