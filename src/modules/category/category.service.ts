import httpStatus from "http-status";
import slugify from "slugify";

import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";

import { ICreateCategory, IUpdateCategory } from "./category.interface";

const createCategory = async (payload: ICreateCategory) => {
    if(!payload?.name){
         throw new AppError(
      httpStatus.CONFLICT,
      "Category Name Required."
    );

    }

  // Generate slug
  const slug = slugify(payload?.name, {
    lower: true,
    strict: true,
    trim: true,
  });

  // Check duplicate name
  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [
        {
          name: payload.name,
        },
        {
          slug,
        },
      ],
    },
  });

  if (existingCategory) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Category already exists."
    );
  }

  const category = await prisma.category.create({
    data: {
        ...payload,
        slug
    }
  });

  return category;
};


const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return categories;
};


const getSingleCategory = async (id: string) => {
  const category = await prisma.category.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return category;
};


const updateCategory = async (
  id: string,
  payload: IUpdateCategory
) => {
  const updateData: Record<string, unknown> = {};

  if (payload.name) {
    updateData.name = payload.name;

    updateData.slug = slugify(payload.name, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  if (payload.description !== undefined) {
    updateData.description = payload.description;
  }

  if (payload.image !== undefined) {
    updateData.image = payload.image;
  }

  const category = await prisma.category.update({
    where: {
      id,
    },
    data: updateData,
  });

  return category;
};

const deleteCategory = async (id: string) => {
    const gearCount = await prisma.gearItem.count({
  where: {
    categoryId: id,
  },
});

if (gearCount > 0) {
  throw new AppError(
    httpStatus.BAD_REQUEST,
    "Cannot delete category because it is assigned to one or more gear items."
  );
}
  await prisma.category.delete({
    where: {
      id,
    },
  });

  return null;
};
export const categoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory
};