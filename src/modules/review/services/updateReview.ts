import httpStatus from "http-status";

import AppError from "../../../errors/AppError.js";
import { prisma } from "../../../lib/prisma.js";

import { IUpdateReview } from "../review.interface.js";

export const updateReview = async (
  reviewId: string,
  customerId: string,
  payload: IUpdateReview
) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Review not found."
    );
  }

  if (review.customerId !== customerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this review."
    );
  }

  if (
    payload.rating !== undefined &&
    (payload.rating < 1 || payload.rating > 5)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rating must be between 1 and 5."
    );
  }

  return prisma.review.update({
    where: {
      id: reviewId,
    },
    data: payload,
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      gearItem: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};