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

export const rentalRoutes=router;