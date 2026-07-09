import express from "express";

import auth from "../../middlewares/auth";

import { providerController } from "./provider.controller";
import { UserRole } from "../../../generated/prisma/enums";

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