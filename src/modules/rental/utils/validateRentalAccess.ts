import httpStatus from "http-status";

import AppError from "../../../errors/AppError.js";
import { prisma } from "../../../lib/prisma.js";

import { rentalDetailsInclude } from "../constants/rental.include.js";

export const validateRentalAccess = async (
  rentalId: string,
  providerId: string
) => {
  const rental = await prisma.rentalOrder.findUnique({
    where: {
      id: rentalId,
    },
    include: {
      ...rentalDetailsInclude,
      items: {
        include: {
          gearItem: true,
        },
      },
    },
  });

  if (!rental) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Rental order not found."
    );
  }

  const hasAccess = rental.items.every(
    (item) => item.gearItem.providerId === providerId
  );

  if (!hasAccess) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this rental."
    );
  }

  return rental;
};