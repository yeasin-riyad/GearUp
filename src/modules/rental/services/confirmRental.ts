import httpStatus from "http-status";

import AppError from "../../../errors/AppError.js";
import { prisma } from "../../../lib/prisma.js";

import { rentalDetailsInclude } from "../constants/rental.include.js";
import { validateRentalAccess } from "../utils/validateRentalAccess.js";

export const confirmRental = async (
  rentalId: string,
  providerId: string
) => {
  

    const rental = await validateRentalAccess(
  rentalId,
  providerId
);

  /**
   * Status Validation
   */
  if (rental.status !== "PAID") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only paid rental orders can be confirmed."
    );
  }

  /**
   * Confirm Rental
   */
  return await prisma.rentalOrder.update({
    where: {
      id: rental.id,
    },
    data: {
      status: "CONFIRMED",
    },
    include: rentalDetailsInclude,
  });
};