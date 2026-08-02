import httpStatus from "http-status";
import { prisma } from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";
import { ICreateGear, IUpdateGear } from "./gear.interface.js";
import QueryBuilder from "../../builder/QueryBuilder.js";
import { Prisma } from "@prisma/client";
import {
  gearFilterableFields,
  gearSearchableFields,
  gearSortableFields,
} from "./gear.constant.js";

const createGear = async (userId: string, payload: ICreateGear) => {
  // Check category exists
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found.");
  }

  const gear = await prisma.gearItem.create({
    data: {
      name: payload.name,
      description: payload.description,
      location: payload.location,
      brand: payload.brand,
      images: payload.images,
      features: payload.features,
      pricePerDay: payload.pricePerDay,
      deposit: payload.deposit,
      stock: payload.stock,

      availability: payload.stock > 0 ? "AVAILABLE" : "UNAVAILABLE",

      categoryId: payload.categoryId,
      providerId: userId,
    },

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
  });

  return gear;
};

const getAllGears = async (query: Record<string, unknown>) => {
  const builder = new QueryBuilder<Prisma.GearItemWhereInput>(query);

  const options = builder
    .search(gearSearchableFields)
    .filter(gearFilterableFields)
    .sort(gearSortableFields)
    .paginate()
    .build();

    // console.log(options.where);
  const gears = await prisma.gearItem.findMany({
    ...options,

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
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  });

  // console.log(gears,"Filtering")

  const total = await prisma.gearItem.count({
    where: options.where,
  });

  const data = await Promise.all(
    gears.map(async (gear) => {
      const rating = await prisma.review.aggregate({
        where: {
          gearItemId: gear.id,
        },
        _avg: {
          rating: true,
        },
      });

      return {
        ...gear,
        reviewCount: gear._count.reviews,
        averageRating: rating._avg.rating ?? 0,
      };
    }),
  );

  return {
    meta: builder.getMeta(total),
    data,
  };
};

const getSingleGear = async (gearId: string) => {
  const gear = await prisma.gearItem.findUnique({
    where: {
      id: gearId,
    },

    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          createdAt: true,
        },
      },

      reviews: {
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!gear) {
    throw new AppError(httpStatus.NOT_FOUND, "Gear not found.");
  }

  return gear;
};

const updateGear = async (
  gearId: string,
  userId: string,
  payload: IUpdateGear,
) => {
  const gear = await prisma.gearItem.findUnique({
    where: {
      id: gearId,
    },
  });

  if (!gear) {
    throw new AppError(httpStatus.NOT_FOUND, "Gear not found.");
  }

 const user = await prisma.user.findUnique({
   where: {
     id: userId,
   },
   select: {
     role: true,
   },
 });

 if (!user) {
   throw new AppError(httpStatus.NOT_FOUND, "User not found.");
 }

 // Provider or Admin can update
 if (gear.providerId !== userId && user.role !== "ADMIN") {
   throw new AppError(
     httpStatus.FORBIDDEN,
     "You are not authorized to update this gear.",
   );
 }

  /**
   * Category Validation
   */
  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
      },
    });

    if (!category) {
      throw new AppError(httpStatus.NOT_FOUND, "Category not found.");
    }
  }

  /**
   * Dynamic Whitelist Update
   */
  const updateData: IUpdateGear = {};

  if (payload.name !== undefined) updateData.name = payload.name;
  if (payload.description !== undefined)
    updateData.description = payload.description;
  if (payload.location !== undefined) updateData.location = payload.location;
  if (payload.brand !== undefined) updateData.brand = payload.brand;
  if (payload.images !== undefined) updateData.images = payload.images;
  if (payload.features !== undefined) updateData.features = payload.features;
  if (payload.pricePerDay !== undefined)
    updateData.pricePerDay = payload.pricePerDay;
  if (payload.deposit !== undefined) updateData.deposit = payload.deposit;
  if (payload.stock !== undefined) updateData.stock = payload.stock;
  if (payload.categoryId !== undefined)
    updateData.categoryId = payload.categoryId;

  /**
   * Auto Availability Determination
   */
  const stock = updateData.stock ?? gear.stock;

  const updatedGear = await prisma.gearItem.update({
    where: {
      id: gear.id,
    },

    data: {
      ...updateData,

      availability: stock > 0 ? "AVAILABLE" : "UNAVAILABLE",
    },

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
  });

  return updatedGear;
};

const deleteGear = async (gearId: string, userId: string) => {
  const gear = await prisma.gearItem.findUnique({
    where: {
      id: gearId,
    },
  });

  if (!gear) {
    throw new AppError(httpStatus.NOT_FOUND, "Gear not found.");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      role: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  // Provider or Admin can delete
  if (gear.providerId !== userId && user.role !== "ADMIN") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to delete this gear.",
    );
  }

  // Rental history check
  const rentalCount = await prisma.rentalOrderItem.count({
    where: {
      gearItemId: gear.id,
    },
  });

  if (rentalCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This gear cannot be deleted because it has rental history.",
    );
  }

  await prisma.gearItem.delete({
    where: {
      id: gear.id,
    },
  });

  return null;
};

export const gearService = {
  createGear,
  getAllGears,
  getSingleGear,
  updateGear,
  deleteGear,
};
