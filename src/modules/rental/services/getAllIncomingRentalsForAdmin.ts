import { Prisma } from "@prisma/client";
import QueryBuilder from "../../../builder/QueryBuilder.js";
import { prisma } from "../../../lib/prisma.js";

export const getAllIncomingRentals = async (query: Record<string, unknown>) => {
  const builder = new QueryBuilder<Prisma.RentalOrderWhereInput>(query);

  const options = builder
    .filter(["status"])
    .sort(["createdAt", "startDate", "endDate", "totalAmount"])
    .paginate()
    .build();

  const where: Prisma.RentalOrderWhereInput = {
    ...options.where,
  };

  /**
   * Search
   * Customer Name
   * Customer Email
   * Provider Name
   * Gear Name
   */
  const searchTerm = query.searchTerm as string;

  if (searchTerm) {
    where.OR = [
      {
        customer: {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      },

      {
        customer: {
          email: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      },

      {
        items: {
          some: {
            gearItem: {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        },
      },

      {
        items: {
          some: {
            gearItem: {
              provider: {
                name: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            },
          },
        },
      },
    ];
  }

  /**
   * Rental Date Filter
   */
  const startDate = query.startDate as string;
  const endDate = query.endDate as string;

  if (startDate || endDate) {
    where.startDate = {};

    if (startDate) {
      where.startDate.gte = new Date(startDate);
    }

    if (endDate) {
      where.startDate.lte = new Date(endDate);
    }
  }

  const rentals = await prisma.rentalOrder.findMany({
    ...options,
    where,

    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },

      payment: {
        select: {
          id: true,
          amount: true,
          status: true,
          paidAt: true,
          stripePaymentIntentId: true,
        },
      },

      items: {
        include: {
          gearItem: {
            include: {
              category: true,

              provider: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const total = await prisma.rentalOrder.count({
    where,
  });

  return {
    meta: builder.getMeta(total),
    data: rentals,
  };
};
