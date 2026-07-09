import httpStatus from "http-status";

import AppError from "../../../errors/AppError";
import { prisma } from "../../../lib/prisma";

export const deleteReview = async (
  reviewId: string,
  customerId: string
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
      "You are not authorized to delete this review."
    );
  }

  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });

  return null;
};