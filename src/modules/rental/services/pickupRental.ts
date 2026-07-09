import httpStatus from "http-status";

import AppError from "../../../errors/AppError.js";
import { prisma } from "../../../lib/prisma.js";

import { rentalDetailsInclude } from "../constants/rental.include.js";
import { validateRentalAccess } from "../utils/validateRentalAccess.js";

export const pickupRental = async (
  rentalId: string,
  providerId: string
) => {
  /**
   * Find Rental Order
   */
const rental = await validateRentalAccess(
  rentalId,
  providerId
);

  /**
   * Status Validation
   */
  if (rental.status !== "CONFIRMED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only confirmed rental orders can be marked as picked up."
    );
  }

  /**
   * Update Rental Status
   */
  return await prisma.rentalOrder.update({
    where: {
      id: rental.id,
    },
    data: {
      status: "PICKED_UP",
    },
    include: rentalDetailsInclude,
  });
};