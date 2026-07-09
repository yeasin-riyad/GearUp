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

router.patch(
  "/:id/confirm",
  auth(UserRole.PROVIDER),
  rentalController.confirmRental
);

router.patch(
  "/:id/pick-up",
  auth(UserRole.PROVIDER),
  rentalController.pickupRental
);


router.patch(
  "/:id/return",
  auth(UserRole.PROVIDER),
  rentalController.returnRental
);
export const rentalRoutes=router;