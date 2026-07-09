import express from "express";

import auth from "../../middlewares/auth.js";

import { providerController } from "./provider.controller.js";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/dashboard",
  auth(UserRole.PROVIDER),
  providerController.getDashboard
);

router.get(
  "/rentals/history",
  auth(UserRole.PROVIDER),
  providerController.getProviderRentalHistory
);

export const providerRoutes = router;