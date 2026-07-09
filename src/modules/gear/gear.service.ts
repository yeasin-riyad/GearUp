import httpStatus from "http-status";
import { prisma } from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";
import { ICreateGear, IUpdateGear } from "./gear.interface.js";
import QueryBuilder from "../../builder/QueryBuilder.js";
import { Prisma } from "@prisma/client";
import { GEAR_MANAGEMENT_ROLES, gearFilterableFields, gearSearchableFields, gearSelectableFields, gearSortableFields } from "./gear.constant.js";

const createGear = async (
  userId: string,
  payload: ICreateGear
) => {
  // Check category exists
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Category not found."
    );
  }

  const gear = await prisma.gearItem.create({
    data: {
      name: payload.name,
      description: payload.description,
      brand: payload.brand,
      image: payload.image,
      pricePerDay: payload.pricePerDay,
      stock: payload.stock,

      availability:
        payload.stock > 0
          ? "AVAILABLE"
          : "UNAVAILABLE",

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
        },
      },
    },
  });

  return gear;
};


const getAllGears = async (
  query: Record<string, unknown>
) => {
  const builder =
    new QueryBuilder<Prisma.GearItemWhereInput>(
      query
    );

  const options = builder
    .search(gearSearchableFields)
    .filter(gearFilterableFields)
    .sort(gearSortableFields)
    .paginate()
    .build();

  const gears = await prisma.gearItem.findMany({
    ...options,

    include: {
      category: true,

      provider: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const total = await prisma.gearItem.count({
    where: options.where,
  });

  return {
    meta: builder.getMeta(total),
    data: gears,
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
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Gear not found."
    );
  }

  return gear;
};



const updateGear = async (
  gearId: string,
  userId: string,
  payload: IUpdateGear
) => {
  const gear = await prisma.gearItem.findUnique({
    where: {
      id: gearId,
    },
  });

  if (!gear) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Gear not found."
    );
  }

  /**
   * Authorization
   */
 if (gear.providerId !== userId) {
  throw new AppError(
    httpStatus.FORBIDDEN,
    "You are not authorized to update this gear."
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
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Category not found."
      );
    }
  }

  /**
   * Dynamic Whitelist
   */
  const updateData: IUpdateGear = {};

  if (payload.name !== undefined)
    updateData.name = payload.name;

  if (payload.description !== undefined)
    updateData.description = payload.description;

  if (payload.brand !== undefined)
    updateData.brand = payload.brand;

  if (payload.image !== undefined)
    updateData.image = payload.image;

  if (payload.pricePerDay !== undefined)
    updateData.pricePerDay = payload.pricePerDay;

  if (payload.stock !== undefined)
    updateData.stock = payload.stock;

  if (payload.categoryId !== undefined)
    updateData.categoryId = payload.categoryId;

  /**
   * Auto Availability
   */
  const stock =
    updateData.stock ?? gear.stock;

  const updatedGear =
    await prisma.gearItem.update({
      where: {
        id: gear.id,
      },

      data: {
        ...updateData,

        availability:
          stock > 0
            ? "AVAILABLE"
            : "UNAVAILABLE",
      },

      include: {
        category: true,

        provider: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

  return updatedGear;
};


const deleteGear = async (
  gearId: string,
  userId: string,
) => {
  const gear = await prisma.gearItem.findUnique({
    where: {
      id: gearId,
    },
  });

  if (!gear) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Gear not found."
    );
  }

  // Authorization
if (gear.providerId !== userId) {
  throw new AppError(
    httpStatus.FORBIDDEN,
    "You are not authorized to delete this gear."
  );
}

  // Rental history check
  const rentalCount =
    await prisma.rentalOrderItem.count({
      where: {
        gearItemId: gear.id,
      },
    });

  if (rentalCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This gear cannot be deleted because it has rental history."
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
  deleteGear
};