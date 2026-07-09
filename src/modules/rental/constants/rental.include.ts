import { Prisma } from "@prisma/client";

export const rentalDetailsInclude: Prisma.RentalOrderInclude = {
    customer: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },

    payment: {
      select: {
        id: true,
        amount: true,
        status: true,
        paidAt: true,
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
  };