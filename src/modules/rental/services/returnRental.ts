import httpStatus from "http-status";

import AppError from "../../../errors/AppError";
import { prisma } from "../../../lib/prisma";

import { rentalDetailsInclude } from "../constants/rental.include";
import { validateRentalAccess } from "../utils/validateRentalAccess";
import { restoreGearStock } from "../utils/restoreGearStock";

export const returnRental = async (
  rentalId: string,
  providerId: string
) => {
  /**
   * Validate Rental & Provider Access
   */
  const rental = await validateRentalAccess(
    rentalId,
    providerId
  );

  /**
   * Status Validation
   */
  if (rental.status !== "PICKED_UP") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only picked up rental orders can be returned."
    );
  }

  /**
   * Transaction
   */
  return await prisma.$transaction(async (tx) => {
    await restoreGearStock(tx, rental.items);

    return await tx.rentalOrder.update({
      where: {
        id: rental.id,
      },
      data: {
        status: "RETURNED",
      },
      include: rentalDetailsInclude,
    });
  });
};