import httpStatus from "http-status";

import AppError from "../../../errors/AppError";
import { GearAvailability, Prisma } from "../../../../generated/prisma/client";

type RentalItem = {
  gearItemId: string;
  quantity: number;
};

export const updateGearStock = async (
  tx: Prisma.TransactionClient,
  items: RentalItem[]
) => {
  for (const item of items) {
    /**
     * Atomic Stock Update
     */
    const result = await tx.gearItem.updateMany({
      where: {
        id: item.gearItemId,
        stock: {
          gte: item.quantity,
        },
      },
      data: {
        stock: {
          decrement: item.quantity,
        },
      },
    });

    /**
     * Prevent Overselling
     */
    if (result.count === 0) {
      throw new AppError(
        httpStatus.CONFLICT,
        "Insufficient stock available."
      );
    }

    /**
     * Check Updated Stock
     */
    const gear = await tx.gearItem.findUnique({
      where: {
        id: item.gearItemId,
      },
      select: {
        stock: true,
      },
    });

    if (!gear) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Gear not found."
      );
    }

    /**
     * Update Availability
     */
    if (gear.stock === 0) {
      await tx.gearItem.update({
        where: {
          id: item.gearItemId,
        },
        data: {
          availability: GearAvailability.UNAVAILABLE,
        },
      });
    }
  }
};