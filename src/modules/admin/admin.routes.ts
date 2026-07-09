import express from "express";

import auth from "../../middlewares/auth";

import { adminController } from "./admin.controller";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.get(
  "/dashboard",
  auth(UserRole.ADMIN),
  adminController.getDashboard
);

export const adminRoutes = router;