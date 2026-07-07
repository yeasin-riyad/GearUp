import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import { ICreateGear } from "./gear.interface";

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

export const gearService = {
  createGear,
};