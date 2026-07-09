import QueryBuilder from "../../../builder/QueryBuilder";
import { prisma } from "../../../lib/prisma";

export const getMyReviews = async (
  customerId: string,
  query: Record<string, unknown>
) => {
  const queryBuilder = new QueryBuilder(query)
    .filter(["rating"])
    .sort(["rating", "createdAt"])
    .paginate();

  const options = queryBuilder.build();

  const where = {
    ...options.where,
    customerId,
  };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      ...options,
      where,
      include: {
        gearItem: {
          select: {
            id: true,
            name: true,
            thumbnail: true,
          },
        },
        rentalOrder: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    }),

    prisma.review.count({
      where,
    }),
  ]);

  return {
    meta: queryBuilder.getMeta(total),
    data: reviews,
  };
};