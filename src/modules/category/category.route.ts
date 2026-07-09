import { Router } from "express";
import auth from "../../middlewares/auth.js";
import { UserRole } from "@prisma/client";
import { categoryController } from "./category.controller.js";


const router=Router();

router.post(
    "/",
    auth(UserRole.ADMIN),
    categoryController.createCategory
);

router.get("/", categoryController.getAllCategories);

router.get("/:id", categoryController.getSingleCategory);

router.patch(
  "/:id",
  auth(UserRole.ADMIN),
  categoryController.updateCategory
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  categoryController.deleteCategory
);

export const categoryRoutes=router;