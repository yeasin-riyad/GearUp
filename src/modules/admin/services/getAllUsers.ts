import { Prisma } from "@prisma/client";
import QueryBuilder from "../../../builder/QueryBuilder.js";
import { prisma } from "../../../lib/prisma.js";

export const getAllUsers = async (query: Record<string, unknown>) => {
        // console.log("Hi");

  const builder = new QueryBuilder<Prisma.UserWhereInput>(query);

  const options = builder
    .search(["name", "email"])
    .filter(["role", "status"])
    .sort(["createdAt", "name", "email"])
    .paginate()
    .build();

    // console.log(JSON.stringify(options, null, 2));

  const users = await prisma.user.findMany({
    ...options,

    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      role: true,
      status: true,
      createdAt: true,

      _count: {
        select: {
          rentalOrders: true,
          reviews: true,
        },
      },
    },
  });

  const total = await prisma.user.count({
    where: options.where,
  });

  return {
    meta: builder.getMeta(total),
    data: users,
  };
};
