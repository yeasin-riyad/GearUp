import httpStatus from "http-status";
import { UserRole } from "@prisma/client";

import AppError from "../../../errors/AppError.js";
import { prisma } from "../../../lib/prisma.js";
import { rentalDetailsInclude } from "../constants/rental.include.js";

export const validateRentalAccess = async (
  rentalId: string,
  userId: string,
) => {
  const [user, rental] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    }),

    prisma.rentalOrder.findUnique({
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
    }),
  ]);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental order not found.");
  }

  // Admin can access everything
  if (user.role === UserRole.ADMIN) {
    return rental;
  }

  const hasAccess = rental.items.every(
    (item) => item.gearItem.providerId === userId,
  );

  if (!hasAccess) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this rental.",
    );
  }

  return rental;
};
