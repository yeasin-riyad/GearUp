import httpStatus from "http-status";

import AppError from "../../../errors/AppError";
import { prisma } from "../../../lib/prisma";

export const validateRentalAvailability = async (
  gearItemId: string,
  requestedStartDate: Date,
  requestedEndDate: Date
) => {
  const overlappingRental = await prisma.rentalOrderItem.findFirst({
    where: {
      gearItemId,

      rentalOrder: {
        status: {
          in: [
            "PLACED",
            "PAID",
            "CONFIRMED",
            "PICKED_UP",
          ],
        },

        AND: [
          {
            startDate: {
              lt: requestedEndDate,
            },
          },
          {
            endDate: {
              gt: requestedStartDate,
            },
          },
        ],
      },
    },

    include: {
      gearItem: {
        select: {
          name: true,
        },
      },
    },
  });

  if (overlappingRental) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${overlappingRental.gearItem.name} is already booked for the selected dates.`
    );
  }
};