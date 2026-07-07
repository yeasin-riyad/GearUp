import { Router } from "express";
import { gearController } from "./gear.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.PROVIDER),
  gearController.createGear
);

router.get(
    "/",
    gearController.getAllGears
);

router.get(
  "/:id",
  gearController.getSingleGear
);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.PROVIDER),
  gearController.updateGear
);

export const gearRoutes = router;