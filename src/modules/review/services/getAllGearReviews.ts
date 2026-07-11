import QueryBuilder from "../../../builder/QueryBuilder.js";
import { prisma } from "../../../lib/prisma.js";

export const getAllGearReviews = async (
  query: Record<string, unknown>
) => {
  /**
   * Query Builder
   */
  const queryBuilder = new QueryBuilder(query)
    .filter(["rating"])
    .sort(["rating", "createdAt"])
    .paginate();

  const options = queryBuilder.build();

  /**
   * Fetch Reviews + Statistics
   */
  const [reviews, total, statistics] = await Promise.all([
    prisma.review.findMany({
      ...options,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        gearItem: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    }),

    prisma.review.count({
      where: options.where,
    }),

    prisma.review.aggregate({
      where: options.where,
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    }),
  ]);

  return {
    meta: queryBuilder.getMeta(total),

    statistics: {
      averageRating: Number(
        (statistics._avg.rating ?? 0).toFixed(1)
      ),
      totalReviews: statistics._count.rating,
    },

    data: reviews,
  };
};