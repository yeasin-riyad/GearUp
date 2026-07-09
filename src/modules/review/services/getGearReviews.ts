import httpStatus from "http-status";

import AppError from "../../../errors/AppError";
import QueryBuilder from "../../../builder/QueryBuilder";
import { prisma } from "../../../lib/prisma";

export const getGearReviews = async (
  gearItemId: string,
  query: Record<string, unknown>
) => {
  /**
   * Validate Gear
   */
  const gear = await prisma.gearItem.findUnique({
    where: {
      id: gearItemId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!gear) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Gear item not found."
    );
  }

  /**
   * Query Builder
   */
  const queryBuilder = new QueryBuilder(query)
    .filter(["rating"])
    .sort(["rating", "createdAt"])
    .paginate();

  const options = queryBuilder.build();

  const where = {
    ...options.where,
    gearItemId,
  };

  /**
   * Fetch Reviews + Statistics
   */
  const [reviews, total, statistics] = await Promise.all([
    prisma.review.findMany({
      ...options,
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    }),

    prisma.review.count({
      where,
    }),

    prisma.review.aggregate({
      where: {
        gearItemId,
      },
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