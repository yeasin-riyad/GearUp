import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { rentalController } from "./rental.controller";

const router=Router()

router.post(
  "/",
  auth(UserRole.CUSTOMER),
  rentalController.createRentalOrder
);

router.get(
  "/provider",
  auth(UserRole.PROVIDER),
  rentalController.getIncomingRentals
);

export const rentalRoutes=router;