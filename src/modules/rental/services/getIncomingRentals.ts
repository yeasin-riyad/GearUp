import { prisma } from "../../../lib/prisma";

export const getIncomingRentals = async (providerId: string) => {
  const rentals = await prisma.rentalOrder.findMany({
    where: {
      status: {
        in: [
          "PAID",
          "CONFIRMED",
          "PICKED_UP",
          "RETURNED",
        ],
      },

      items: {
        some: {
          gearItem: {
            providerId,
          },
        },
      },
    },

    include: {
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
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return rentals;
};