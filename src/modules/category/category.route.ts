import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { categoryController } from "./category.controller";


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