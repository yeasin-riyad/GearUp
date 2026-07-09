import { Router } from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth.js";
import { rentalController } from "./rental.controller.js";

const router=Router()

router.post(
  "/",
  auth(UserRole.CUSTOMER),
  rentalController.createRentalOrder
);


// get user rentals
router.get(
  "/my-rentals",
  auth(UserRole.CUSTOMER),
  rentalController.getMyRentals
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

router.patch(
  "/:id/cancel",
  auth(UserRole.CUSTOMER),
  rentalController.cancelRental
);

export const rentalRoutes=router;