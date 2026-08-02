import { Router } from "express";
import { gearController } from "./gear.controller.js";
import auth from "../../middlewares/auth.js";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/",
  auth(UserRole.PROVIDER),
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
  auth(UserRole.PROVIDER,UserRole.ADMIN),
  gearController.updateGear
);


router.delete(
  "/:id",
  auth(UserRole.PROVIDER,UserRole.ADMIN),
  gearController.deleteGear
);
export const gearRoutes = router;