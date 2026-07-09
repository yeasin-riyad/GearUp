import httpStatus from "http-status";

import AppError from "../../../errors/AppError.js";
import { prisma } from "../../../lib/prisma.js";

import { ICreateReview } from "../review.interface.js";

export const createReview = async (
  customerId: string,
  payload: ICreateReview
) => {
  const {
    rentalOrderId,
    gearItemId,
    rating,
    comment,
  } = payload;

  /**
   * Validate Request
   */
  if (!rentalOrderId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rental order id is required."
    );
  }

  if (!gearItemId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Gear item id is required."
    );
  }

  if (rating === undefined || rating === null) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rating is required."
    );
  }

  if (rating < 1 || rating > 5) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rating must be between 1 and 5."
    );
  }

  /**
   * Find Rental Order
   */
  const rental = await prisma.rentalOrder.findUnique({
    where: {
      id: rentalOrderId,
    },
    include: {
      items: true,
    },
  });

  if (!rental) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Rental order not found."
    );
  }

  /**
   * Authorization
   */
  if (rental.customerId !== customerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to review this rental."
    );
  }

  /**
   * Rental Status Validation
   */
  if (rental.status !== "RETURNED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can review only returned rentals."
    );
  }

  /**
   * Validate Gear Item
   */
  const rentedGear = rental.items.find(
    (item) => item.gearItemId === gearItemId
  );

  if (!rentedGear) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This gear item does not belong to the rental order."
    );
  }

  /**
   * Duplicate Review Check
   */
  const existingReview = await prisma.review.findFirst({
    where: {
      rentalOrderId,
      gearItemId,
      customerId,
    },
  });

  if (existingReview) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already reviewed this gear."
    );
  }

  /**
   * Create Review
   */
  const review = await prisma.review.create({
    data: {
      customerId,
      rentalOrderId,
      gearItemId,
      rating,
      comment,
    },
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

  return review;
};