import httpStatus from "http-status";
import { ICreateRentalOrder } from "../rental.interface.js";
import AppError from "../../../errors/AppError.js";
import { prisma } from "../../../lib/prisma.js";
import { validateRentalAvailability } from "../utils/validateRentalAvailability.js";


export const createRentalOrder = async (
  customerId: string,
  payload: ICreateRentalOrder
) => {
  const { startDate, endDate, items } = payload;

  /**
   * Validate Request
   */
  if (!startDate || !endDate) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Start date and end date are required."
    );
  }

  if (!items || items.length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "At least one gear item is required."
    );
  }

  /**
   * Prevent Duplicate Gear Items
   */
  const gearIds = items.map((item) => item.gearItemId);

  const uniqueGearIds = new Set(gearIds);

  if (uniqueGearIds.size !== gearIds.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Duplicate gear items are not allowed."
    );
  }

  /**
   * Validate Dates
   */
  const rentalStartDate = new Date(startDate);
  const rentalEndDate = new Date(endDate);

  if (
    isNaN(rentalStartDate.getTime()) ||
    isNaN(rentalEndDate.getTime())
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid rental dates."
    );
  }

  rentalStartDate.setHours(0, 0, 0, 0);
  rentalEndDate.setHours(0, 0, 0, 0);

  if (rentalStartDate >= rentalEndDate) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "End date must be after start date."
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (rentalStartDate < today) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Start date cannot be in the past."
    );
  }

  /**
   * Calculate Rental Days
   */
  const rentalDays = Math.ceil(
    (rentalEndDate.getTime() - rentalStartDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  /**
   * Fetch Gear Items
   */
 const gears = await prisma.gearItem.findMany({
  where: {
    id: {
      in: [...uniqueGearIds],
    },
  },
  select: {
    id: true,
    name: true,
    providerId: true,
    availability: true,
    stock: true,
    pricePerDay: true,
  },
});



  if (gears.length !== uniqueGearIds.size) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "One or more gear items were not found."
    );
  }

  /**
 * Validate Same Provider
 */
const providerIds = new Set(
  gears.map((gear) => gear.providerId)
);

if (providerIds.size > 1) {
  throw new AppError(
    httpStatus.BAD_REQUEST,
    "All gear items must belong to the same provider."
  );
}

  /**
   * Prepare Order Items
   */
  let totalAmount = 0;

  const orderItemsPromises = items.map(async (item) => {
    const gear = gears.find(
      (g) => g.id === item.gearItemId
    );

    if (!gear) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Gear not found."
      );
    }

     await validateRentalAvailability(
    gear.id,
    rentalStartDate,
    rentalEndDate
  );

    if (item.quantity < 1) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Quantity must be at least 1."
      );
    }

    if (gear.availability !== "AVAILABLE") {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `${gear.name} is currently unavailable.`
      );
    }

    if (gear.stock < item.quantity) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Only ${gear.stock} unit(s) of ${gear.name} are available.`
      );
    }

    const subtotal = gear.pricePerDay * item.quantity * rentalDays;

    return {
      gearItemId: gear.id,
      quantity: item.quantity,
      pricePerDay: gear.pricePerDay,
      subtotal,
    };
  });
  const orderItems = await Promise.all(orderItemsPromises);

  // calculate total amount after resolving all item promises
  totalAmount = orderItems.reduce((sum, it) => sum + it.subtotal, 0);

  /**
   * Transaction
   */
  const result = await prisma.$transaction(async (tx) => {
    const rentalOrder = await tx.rentalOrder.create({
      data: {
        customerId,
        startDate: rentalStartDate,
        endDate: rentalEndDate,
        totalAmount,
      },
    });

    await tx.rentalOrderItem.createMany({
      data: orderItems.map((item) => ({
        rentalOrderId: rentalOrder.id,
        gearItemId: item.gearItemId,
        quantity: item.quantity,
        pricePerDay: item.pricePerDay,
        subtotal: item.subtotal,
      })),
    });

    await tx.payment.create({
      data: {
        customerId,
        rentalOrderId: rentalOrder.id,
        amount: totalAmount,
      },
    });

    return tx.rentalOrder.findUnique({
      where: {
        id: rentalOrder.id,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            gearItem: {
              include: {
                category: true,
              },
            },
          },
        },
        payment: true,
      },
    });
  });

  return result;
};
