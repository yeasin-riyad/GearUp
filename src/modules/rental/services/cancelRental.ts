import httpStatus from "http-status";

import AppError from "../../../errors/AppError.js";
import { prisma } from "../../../lib/prisma.js";

import { rentalDetailsInclude } from "../constants/rental.include.js";

export const cancelRental = async (
  rentalId: string,
  customerId: string
) => {
  /**
   * Find Rental Order
   */
  const rental = await prisma.rentalOrder.findUnique({
    where: {
      id: rentalId,
    },
    include: {
      ...rentalDetailsInclude,
      payment: true,
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
      "You are not authorized to cancel this rental."
    );
  }

  /**
   * Rental Status Validation
   */
  if (rental.status !== "PLACED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only placed rental orders can be cancelled."
    );
  }

  /**
   * Payment Validation
   */
  if (!rental.payment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Payment record not found."
    );
  }

  if (rental.payment.status !== "PENDING") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This rental payment has already been processed."
    );
  }

  const paymentId = rental.payment.id;

  /**
   * Transaction
   */
  return prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        status: "FAILED",
      },
    });

    return tx.rentalOrder.update({
      where: {
        id: rental.id,
      },
      data: {
        status: "CANCELLED",
      },
      include: rentalDetailsInclude,
    });
  });
};