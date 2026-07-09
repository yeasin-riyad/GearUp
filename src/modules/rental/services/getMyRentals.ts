import { prisma } from "../../../lib/prisma.js";

import { rentalDetailsInclude } from "../constants/rental.include.js";

export const getMyRentals = async (
  customerId: string
) => {
  const rentals = await prisma.rentalOrder.findMany({
    where: {
      customerId,
    },
    include: rentalDetailsInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  return rentals;
};