import express from "express";

import auth from "../../middlewares/auth.js";

import { adminController } from "./admin.controller.js";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/dashboard",
  auth(UserRole.ADMIN),
  adminController.getDashboard
);

export const adminRoutes = router;