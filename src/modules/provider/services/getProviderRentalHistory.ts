import { RentalOrder } from "../../../../generated/prisma/client";
import QueryBuilder from "../../../builder/QueryBuilder";
import { prisma } from "../../../lib/prisma";
import { rentalDetailsInclude } from "../../rental/constants/rental.include";

export const getProviderRentalHistory = async (
  providerId: string,
  query: Record<string, unknown>
) => {
  const queryBuilder = new QueryBuilder<RentalOrder>(query)
    .filter(["status"])
    .sort(["createdAt", "startDate", "endDate", "totalAmount"])
    .paginate();

  const options = queryBuilder.build();

  const where = {
    ...options.where,
    items: {
      some: {
        gearItem: {
          providerId,
        },
      },
    },
  };

  const [rentals, total] = await Promise.all([
    prisma.rentalOrder.findMany({
      ...options,
      where,
      include: rentalDetailsInclude,
    }),

    prisma.rentalOrder.count({
      where,
    }),
  ]);

  return {
    meta: queryBuilder.getMeta(total),
    data: rentals,
  };
};