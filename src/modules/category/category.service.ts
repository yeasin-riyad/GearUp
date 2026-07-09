import httpStatus from "http-status";
import slugify from "slugify";

import { prisma } from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";

import { ICreateCategory, IUpdateCategory } from "./category.interface.js";
import { categoryFilterableFields, categorySearchableFields, categorySelectableFields, categorySortableFields } from "./category.constant.js";
import QueryBuilder from "../../builder/QueryBuilder.js";
import { Prisma } from "@prisma/client";

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


const getAllCategories = async (
  query: Record<string, unknown>
) => {
  const builder = new QueryBuilder<Prisma.CategoryWhereInput>(
    query
  );

  const options = builder
    .search(categorySearchableFields)
    .filter(categoryFilterableFields)
    .sort(categorySortableFields)
    .paginate()
    .fields(categorySelectableFields)
    .build();

  const data = await prisma.category.findMany(options);

  const total = await prisma.category.count({
    where: options.where,
  });

  return {
    meta: builder.getMeta(total),
    data,
  };
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