import express from "express";

import auth from "../../middlewares/auth.js";

import { reviewController } from "./review.controller.js";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/me",
  auth(UserRole.CUSTOMER),
  reviewController.getMyReviews
);

router.get(
  "/",
  reviewController.getAllGearReviews
);

router.get(
  "/gear/:gearItemId",
  reviewController.getGearReviews
);

router.post(
  "/",
  auth(UserRole.CUSTOMER),
  reviewController.createReview
);

router.patch(
  "/:id",
  auth(UserRole.CUSTOMER),
  reviewController.updateReview
);

router.delete(
  "/:id",
  auth(UserRole.CUSTOMER),
  reviewController.deleteReview
);

export const reviewRoutes = router;